import { describe, expect, it } from "vite-plus/test";
import { chatRequestSchema, parseChatEvent } from "@shared/chat";

describe("chat protocol", () => {
  it.each([null, [], "invalid", 42, { nested: undefined }])(
    "rejects invalid tool arguments at the request boundary: %j",
    (input) => {
      expect(
        chatRequestSchema.safeParse({
          messages: [
            {
              id: "assistant",
              role: "assistant",
              steps: [
                {
                  parts: [
                    {
                      type: "tool",
                      toolCallId: "tool-1",
                      toolName: "get_profile",
                      state: "output-available",
                      input,
                      output: null,
                    },
                  ],
                },
              ],
            },
            { id: "user", role: "user", parts: [{ type: "text", text: "continue" }] },
          ],
        }).success,
      ).toBe(false);
    },
  );

  it("validates tool events without replacing JSON values", () => {
    const input = { nested: [null, false, 0, "", { key: "value" }] };
    const event = { type: "tool-input", toolCallId: "tool-1", toolName: "get_profile", input };
    expect(parseChatEvent(JSON.stringify(event))).toEqual(event);
    expect(() => parseChatEvent(JSON.stringify({ ...event, input: [] }))).toThrow();
    expect(() =>
      parseChatEvent(JSON.stringify({ type: "tool-output", toolCallId: "tool-1" })),
    ).toThrow();
    expect(
      parseChatEvent(JSON.stringify({ type: "tool-output", toolCallId: "tool-1", output: null })),
    ).toEqual({ type: "tool-output", toolCallId: "tool-1", output: null });
  });

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
