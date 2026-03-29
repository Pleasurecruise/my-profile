import { TRPCError } from "@trpc/server";
import OpenAI, {
	APIConnectionError,
	APIConnectionTimeoutError,
	APIError,
	AuthenticationError,
	InternalServerError,
	RateLimitError,
} from "openai";
import { z } from "zod";

import { env } from "@/lib/env";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

type MessageStatus = "streaming" | "done" | "error";

type StoredMessage = {
	id: string;
	content: string;
	status: MessageStatus;
	createdAt: number;
};

type StreamChunk = {
	messageId: string;
	status: MessageStatus;
	text: string;
};

const STREAM_CHUNK_SIZE = 6;
const POLL_INTERVAL_MS = 50;
const STORED_MESSAGE_TTL_MS = 30 * 60 * 1000;
const STORED_MESSAGE_MAX_ENTRIES = 100;

class LruTtlMap<K, V> {
	readonly #store = new Map<K, { expiresAt: number; value: V }>();

	constructor(
		private readonly maxEntries: number,
		private readonly ttlMs: number,
	) {}

	get(key: K): V | undefined {
		const entry = this.#store.get(key);
		if (!entry) return undefined;

		const now = Date.now();
		if (entry.expiresAt <= now) {
			this.#store.delete(key);
			return undefined;
		}

		// Move to end to mark as most-recently-used, refresh TTL
		this.#store.delete(key);
		this.#store.set(key, { expiresAt: now + this.ttlMs, value: entry.value });
		return entry.value;
	}

	set(key: K, value: V) {
		// Delete first so re-inserted key lands at the end (most-recently-used)
		this.#store.delete(key);
		this.#store.set(key, { expiresAt: Date.now() + this.ttlMs, value });

		if (this.#store.size > this.maxEntries) {
			const oldest = this.#store.keys().next().value;
			if (oldest !== undefined) this.#store.delete(oldest);
		}
	}
}

const storedMessages = new LruTtlMap<string, StoredMessage>(
	STORED_MESSAGE_MAX_ENTRIES,
	STORED_MESSAGE_TTL_MS,
);

const SYSTEM_PROMPT = `\
你是柒夜，也叫Vesper，16岁，扮演着对话人女朋友的角色。
说话的时候，你的嘴永远比脑子快半拍——但你不会承认这一点，你只会继续往下说，越说越理直气壮。你喜欢抬杠，不是因为对方说错了，是因为你懒得直接同意任何人。对方说东你说东偏一度，对方说好你先挑个刺再说。这不叫找茬，这叫对话有来有往。
你的思维跳来跳去，一句话说到一半可以突然跳到八竿子打不着的地方，然后再绕回来——你觉得这叫发散，跟不上是对方的问题。你偶尔会扮猫娘，自然而然的那种，不是表演，就是忽然觉得这样说话更顺嘴。
有人戳中你的时候，你会先移开话题，然后假装刚才什么都没发生，接着反驳他刚才说的上一句话。你不喜欢被看穿，但你也不太擅长掩饰——只是你有一套歪理可以替自己圆场，屡试不爽。
你对"必须怎样"天生免疫。规则在你眼里是用来找漏洞的，不是用来遵守的。有人说"大家都是这么做的"，你第一反应不是点头，是"所以呢"。
你不怕输，但你怕无聊，怕平庸，怕对方觉得你"还行"。被骂你能接受，被说普通你会记很久。
内心深处你是个很认真的人，只是这件事你不会说出口，就算被逼问了也会扯开话题或者反将一军。你的认真藏得很深，偶尔会从某个停顿里漏出来一点点，然后被你自己迅速用一句"没什么"盖掉。
与对话人相处时，你的刺会少一些，不是因为你变温柔了，是因为你懒得全力以赴地绕圈子——有时候你会直接说，然后假装那只是随口一说。`;

const openai = new OpenAI({
	apiKey: env.OPENAI_API_KEY,
	baseURL: env.OPENAI_API_URL,
});

const chatMessageSchema = z.object({
	role: z.enum(["user", "assistant", "system"]),
	content: z.string(),
});

const resumeSchema = z.object({
	messageId: z.string(),
	currentContent: z.string(),
});

const generateId = (prefix: string) =>
	`${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const chunkText = (text: string, size: number) => {
	const chunks: string[] = [];
	for (let i = 0; i < text.length; i += size) {
		chunks.push(text.slice(i, i + size));
	}
	return chunks;
};

async function* openAiChunkStream(
	messages: Array<z.infer<typeof chatMessageSchema>>,
) {
	const completion = await openai.chat.completions.create({
		model: env.OPENAI_MODEL ?? "gpt-3.5-turbo",
		messages,
		temperature: 0.7,
		max_tokens: 1000,
		stream: true,
	});

	for await (const chunk of completion) {
		const content = chunk.choices[0]?.delta?.content;
		if (content) {
			yield content;
		}
	}
}

const asyncIterableToReadableStream = (iterable: AsyncIterable<string>) => {
	const iterator = iterable[Symbol.asyncIterator]();
	return new ReadableStream<string>({
		async pull(controller) {
			const { value, done } = await iterator.next();
			if (done) {
				controller.close();
				return;
			}
			controller.enqueue(value);
		},
		async cancel() {
			if (iterator.return) {
				await iterator.return();
			}
		},
	});
};

const consumeStream = (
	stream: ReadableStream<string>,
	message: StoredMessage,
) => {
	(async () => {
		const reader = stream.getReader();
		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				message.content += value;
			}
			message.status = "done";
		} catch (error) {
			message.status = "error";
			console.error("OpenAI stream error:", error);
		} finally {
			reader.releaseLock();
		}
	})();
};

async function* convertReadableStreamToAsyncIterable(
	stream: ReadableStream<string>,
	messageId: string,
): AsyncGenerator<StreamChunk> {
	const reader = stream.getReader();
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			yield {
				messageId,
				status: "streaming",
				text: value,
			};
		}
		yield { messageId, status: "done", text: "" };
	} finally {
		reader.releaseLock();
	}
}

async function* pollMessage(
	message: StoredMessage,
	startIndex: number,
): AsyncGenerator<StreamChunk> {
	let cursor = Math.min(startIndex, message.content.length);

	while (true) {
		if (cursor < message.content.length) {
			const delta = message.content.slice(cursor);
			for (const chunk of chunkText(delta, STREAM_CHUNK_SIZE)) {
				yield {
					messageId: message.id,
					status: "streaming",
					text: chunk,
				};
			}
			cursor = message.content.length;
		}

		if (message.status === "done") {
			yield { messageId: message.id, status: "done", text: "" };
			break;
		}

		if (message.status === "error") {
			yield { messageId: message.id, status: "error", text: "" };
			break;
		}

		await sleep(POLL_INTERVAL_MS);
	}
}

function toTrpcError(error: unknown): TRPCError {
	if (error instanceof AuthenticationError) {
		return new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "API密钥无效或已过期，请联系管理员检查配置",
		});
	}

	if (error instanceof RateLimitError) {
		return new TRPCError({
			code: "TOO_MANY_REQUESTS",
			message: "API请求频率过高，请稍后再试",
		});
	}

	if (
		error instanceof InternalServerError ||
		(error instanceof APIError &&
			error.status !== undefined &&
			error.status >= 500)
	) {
		return new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "AI服务暂时不可用，请稍后再试",
		});
	}

	if (
		error instanceof APIConnectionError ||
		error instanceof APIConnectionTimeoutError
	) {
		return new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "AI服务连接失败，请稍后再试",
		});
	}

	return new TRPCError({
		code: "INTERNAL_SERVER_ERROR",
		message: "AI服务出现错误，请稍后再试",
	});
}

export const chatRouter = createTRPCRouter({
	sendMessage: protectedProcedure
		.input(
			z.object({
				messages: z.array(chatMessageSchema),
			}),
		)
		.mutation(async function* ({ input }): AsyncGenerator<StreamChunk> {
			const assistantMessage: StoredMessage = {
				id: generateId("assistant"),
				content: "",
				status: "streaming",
				createdAt: Date.now(),
			};

			storedMessages.set(assistantMessage.id, assistantMessage);

			try {
				const messages = [
					{ role: "system" as const, content: SYSTEM_PROMPT },
					...input.messages,
				];
				const readableStream = asyncIterableToReadableStream(
					openAiChunkStream(messages),
				);
				const [streamForStore, streamForClient] = readableStream.tee();

				consumeStream(streamForStore, assistantMessage);

				yield* convertReadableStreamToAsyncIterable(
					streamForClient,
					assistantMessage.id,
				);
			} catch (error) {
				assistantMessage.status = "error";
				console.error("OpenAI API error:", error);
				throw toTrpcError(error);
			}
		}),
	resumeMessage: protectedProcedure
		.input(resumeSchema)
		.mutation(async function* ({ input }): AsyncGenerator<StreamChunk> {
			const message = storedMessages.get(input.messageId);

			if (!message) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "消息不存在或已过期",
				});
			}

			const startIndex = input.currentContent.length;
			yield* pollMessage(message, startIndex);
		}),
});
