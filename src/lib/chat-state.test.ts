import { describe, expect, it } from "vite-plus/test";
import type { ChatMessage } from "@/types";
import { applyChatEvent } from "./chat-state";

describe("chat state", () => {
  it("appends text deltas without mutating the previous state", () => {
    const messages: ChatMessage[] = [
      {
        id: "assistant",
        role: "assistant",
        steps: [{ parts: [{ type: "text", text: "你好" }] }],
        status: "streaming",
      },
    ];
    const event = { type: "text-delta" as const, delta: "，世界！\n下一行。" };

    const firstResult = applyChatEvent(messages, "assistant", event);
    const secondResult = applyChatEvent(messages, "assistant", event);

    expect(firstResult).toEqual(secondResult);
    expect(messages[0]).toMatchObject({ steps: [{ parts: [{ text: "你好" }] }] });
    expect(firstResult[0]).toMatchObject({
      steps: [{ parts: [{ text: "你好，世界！\n下一行。" }] }],
    });
  });
});
