import { describe, expect, it } from "vite-plus/test";
import { chatRequestSchema, parseChatEvent } from "@shared/chat";

describe("chat protocol", () => {
  it("requires the transcript to end with a user message", () => {
    const result = chatRequestSchema.safeParse({
      messages: [{ id: "assistant", role: "assistant", steps: [] }],
    });
    expect(result.success).toBe(false);
  });

  it("parses typed NDJSON events", () => {
    const event = { type: "text-delta" as const, delta: "你好，世界！\n下一行。" };

    expect(parseChatEvent(JSON.stringify(event))).toEqual({
      type: "text-delta",
      delta: "你好，世界！\n下一行。",
    });
  });
});
