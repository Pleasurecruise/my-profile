import { runAgent } from "@my-profile/ai-core";
import { chatRequestSchema, type ChatEvent } from "@shared/chat";
import { env } from "void/env";
import { requireAuth } from "void/auth";
import { defineHandler } from "void/handler";
import { AgentChatStreamBridge, uiMessagesToPi } from "@server/lib/chat/bridge";
import { createChatModel } from "@server/lib/chat/model";
import { CHAT_SYSTEM_PROMPT } from "@server/lib/chat/prompt";
import { createChatTools } from "@server/lib/chat/tools";

export const POST = defineHandler(async (c) => {
  requireAuth(c);

  const validation = chatRequestSchema.safeParse(await c.req.json<unknown>());
  if (!validation.success) return c.json({ error: "Invalid chat transcript." }, 400);

  const model = createChatModel({ baseUrl: env.OPENAI_API_URL, modelId: env.OPENAI_MODEL });
  const encoder = new TextEncoder();
  const abort = new AbortController();
  const signal = AbortSignal.any([c.req.raw.signal, abort.signal]);
  let cancelled = false;

  const responseStream = new ReadableStream<Uint8Array>({
    start(controller) {
      const write = (event: ChatEvent) => {
        if (!cancelled) controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };

      void (async () => {
        const bridge = new AgentChatStreamBridge(write);
        try {
          await runAgent({
            systemPrompt: CHAT_SYSTEM_PROMPT,
            model,
            messages: uiMessagesToPi(validation.data.messages, model),
            tools: createChatTools({
              assets: c.env.ASSETS,
              blogBucket: c.env.BLOG_BUCKET,
              profileUrl: new URL("/llms-full.txt", c.req.url),
            }),
            apiKey: env.OPENAI_API_KEY,
            signal,
            onEvent: (event) => bridge.write(event),
          });
          write({ type: "finish" });
        } catch (error) {
          if (!cancelled && !signal.aborted) {
            console.error("[chat] pi Agent run failed", {
              name: error instanceof Error ? error.name : "UnknownError",
              message: error instanceof Error ? error.message.slice(0, 1_000) : String(error),
            });
            write({ type: "error", message: "AI 服务暂时不可用，请稍后再试。" });
          }
        } finally {
          if (!cancelled) controller.close();
        }
      })();
    },
    cancel() {
      cancelled = true;
      abort.abort();
    },
  });

  return new Response(responseStream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
});
