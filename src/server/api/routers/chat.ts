import { z } from "zod";
import OpenAI from "openai";
import { TRPCError } from "@trpc/server";

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

const storedMessages = new Map<string, StoredMessage>();

if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not set in environment variables");
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_URL,
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

async function* openAiChunkStream(messages: Array<z.infer<typeof chatMessageSchema>>) {
    const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
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

const consumeStream = (stream: ReadableStream<string>, message: StoredMessage) => {
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

export const chatRouter = createTRPCRouter({
    sendMessage: protectedProcedure
        .input(z.object({
            messages: z.array(chatMessageSchema),
        }))
        .mutation(async function* ({ input }): AsyncGenerator<StreamChunk> {
            if (!process.env.OPENAI_API_KEY) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "服务器配置错误：缺少API密钥",
                });
            }

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

                if (error instanceof Error) {
                    if (error.message.includes("401") || error.message.includes("无效的令牌")) {
                        throw new TRPCError({
                            code: "INTERNAL_SERVER_ERROR",
                            message: "API密钥无效或已过期，请联系管理员检查配置",
                        });
                    }

                    if (error.message.includes("429")) {
                        throw new TRPCError({
                            code: "TOO_MANY_REQUESTS",
                            message: "API请求频率过高，请稍后再试",
                        });
                    }

                    if (
                        error.message.includes("500") ||
                        error.message.includes("502") ||
                        error.message.includes("503")
                    ) {
                        throw new TRPCError({
                            code: "INTERNAL_SERVER_ERROR",
                            message: "AI服务暂时不可用，请稍后再试",
                        });
                    }
                }

                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "AI服务出现错误，请稍后再试",
                });
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