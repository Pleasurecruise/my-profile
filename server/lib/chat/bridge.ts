import type {
  AgentEvent,
  AgentMessage,
  AssistantMessage,
  Model,
  ToolResultMessage,
} from "@my-profile/ai-core";
import type { ChatEvent, ChatMessage } from "@shared/chat";

const EMPTY_USAGE = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
  totalTokens: 0,
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
};

export function uiMessagesToPi(
  messages: ChatMessage[],
  model: Model<"openai-completions">,
): AgentMessage[] {
  const converted: AgentMessage[] = [];

  for (const message of messages) {
    if (message.role === "user") {
      converted.push({
        role: "user",
        content: message.parts.map((part) => part.text).join("\n"),
        timestamp: Date.now(),
      });
      continue;
    }

    for (const step of message.steps) {
      const content: AssistantMessage["content"] = [];
      const toolResults: ToolResultMessage[] = [];

      for (const part of step.parts) {
        if (part.type === "text" && part.text) content.push({ type: "text", text: part.text });
        if (part.type !== "tool" || part.state === "input-available") continue;

        content.push({
          type: "toolCall",
          id: part.toolCallId,
          name: part.toolName,
          arguments: part.input ?? {},
        });
        const output = part.state === "output-available" ? part.output : part.errorText;
        toolResults.push({
          role: "toolResult",
          toolCallId: part.toolCallId,
          toolName: part.toolName,
          content: [
            { type: "text", text: typeof output === "string" ? output : JSON.stringify(output) },
          ],
          details: part.state === "output-available" ? part.output : undefined,
          isError: part.state === "output-error",
          timestamp: Date.now(),
        });
      }

      if (!content.length) continue;
      converted.push({
        role: "assistant",
        content,
        api: model.api,
        provider: model.provider,
        model: model.id,
        usage: EMPTY_USAGE,
        stopReason: toolResults.length ? "toolUse" : "stop",
        timestamp: Date.now(),
      });
      converted.push(...toolResults);
    }
  }

  return converted;
}

export class AgentChatStreamBridge {
  constructor(private readonly writeEvent: (event: ChatEvent) => void) {}

  write(event: AgentEvent) {
    if (event.type === "message_start" && event.message.role === "assistant") {
      this.writeEvent({ type: "assistant-step" });
      return;
    }

    if (event.type === "message_update") {
      const update = event.assistantMessageEvent;
      if (update.type === "text_delta") {
        this.writeEvent({ type: "text-delta", delta: update.delta });
      }
      return;
    }

    if (event.type === "tool_execution_start") {
      this.writeEvent({
        type: "tool-input",
        toolCallId: event.toolCallId,
        toolName: event.toolName,
        input: event.args,
      });
      return;
    }

    if (event.type === "tool_execution_end") {
      this.writeEvent(
        event.isError
          ? {
              type: "tool-error",
              toolCallId: event.toolCallId,
              errorText: event.result?.content?.[0]?.text ?? "Tool failed.",
            }
          : {
              type: "tool-output",
              toolCallId: event.toolCallId,
              output: event.result?.details ?? event.result,
            },
      );
    }
  }
}
