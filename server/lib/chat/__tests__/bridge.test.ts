import { describe, expect, it } from "vite-plus/test";
import type { AgentEvent, AssistantMessage } from "@my-profile/ai-core";
import type { ChatEvent, ChatMessage } from "@shared/chat";
import { createChatModel } from "../model";
import { AgentChatStreamBridge, uiMessagesToPi } from "../bridge";

describe("chat bridge", () => {
  it("preserves nested tool arguments and null output in the Pi transcript", () => {
    const input = { nested: [null, false, 0, "", { key: "value" }] };
    const model = createChatModel({ baseUrl: "https://example.test/v1", modelId: "model" });
    const converted = uiMessagesToPi(
      [
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
      ],
      model,
    );

    expect(converted).toEqual([
      expect.objectContaining({
        content: [
          {
            type: "toolCall",
            id: "tool-1",
            name: "get_profile",
            arguments: input,
          },
        ],
      }),
      expect.objectContaining({
        role: "toolResult",
        content: [{ type: "text", text: "null" }],
        details: null,
        isError: false,
      }),
    ]);
  });

  it("converts the complete UI transcript to Pi messages", () => {
    const transcript: ChatMessage[] = [
      { id: "user", role: "user", parts: [{ type: "text", text: "hello" }] },
      {
        id: "assistant",
        role: "assistant",
        steps: [{ parts: [{ type: "text", text: "hi" }] }],
      },
    ];
    const model = createChatModel({ baseUrl: "https://example.test/v1", modelId: "model" });

    expect(uiMessagesToPi(transcript, model)).toEqual([
      expect.objectContaining({ role: "user", content: "hello" }),
      expect.objectContaining({
        role: "assistant",
        content: [{ type: "text", text: "hi" }],
        model: "model",
      }),
    ]);
  });

  it("maps Pi text and tool lifecycle events to the shared protocol", () => {
    const events: ChatEvent[] = [];
    const bridge = new AgentChatStreamBridge((event) => events.push(event));
    const assistant: AssistantMessage = {
      role: "assistant",
      content: [],
      api: "openai-completions",
      provider: "test",
      model: "model",
      usage: {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
        totalTokens: 0,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
      },
      stopReason: "stop",
      timestamp: 1,
    };

    const start: AgentEvent = { type: "message_start", message: assistant };
    const update: AgentEvent = {
      type: "message_update",
      message: assistant,
      assistantMessageEvent: {
        type: "text_delta",
        delta: "你好，世界！\n下一行。",
        contentIndex: 0,
        partial: assistant,
      },
    };
    bridge.write(start);
    bridge.write(update);
    bridge.write({
      type: "tool_execution_start",
      toolCallId: "tool-1",
      toolName: "get_profile",
      args: {},
    });

    expect(events).toEqual([
      { type: "assistant-step" },
      { type: "text-delta", delta: "你好，世界！\n下一行。" },
      {
        type: "tool-input",
        toolCallId: "tool-1",
        toolName: "get_profile",
        input: {},
      },
    ]);
  });
});
