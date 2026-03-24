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
				const readableStream = asyncIterableToReadableStream(
					openAiChunkStream(input.messages),
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
