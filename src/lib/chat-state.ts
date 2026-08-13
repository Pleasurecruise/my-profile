import type { ChatEvent, ChatMessage } from "@/types";

export function applyChatEvent(
  messages: ChatMessage[],
  assistantId: string,
  event: ChatEvent,
): ChatMessage[] {
  if (event.type === "error") throw new Error(event.message);

  const assistantIndex = messages.findIndex((message) => message.id === assistantId);
  if (event.type === "assistant-step") {
    if (assistantIndex === -1) {
      return [
        ...messages,
        {
          id: assistantId,
          role: "assistant",
          steps: [{ parts: [] }],
          status: "streaming",
          timestamp: new Date().toISOString(),
        },
      ];
    }
    return messages.map((message, index) =>
      index === assistantIndex && message.role === "assistant"
        ? { ...message, steps: [...message.steps, { parts: [] }] }
        : message,
    );
  }

  if (event.type === "finish") {
    return messages.map((message, index) =>
      index === assistantIndex && message.role === "assistant"
        ? { ...message, status: "done" }
        : message,
    );
  }

  const assistant = messages[assistantIndex];
  if (!assistant || assistant.role !== "assistant") {
    throw new Error("Chat event arrived before an assistant message started.");
  }
  const steps = assistant.steps.map((step) => ({ ...step, parts: [...step.parts] }));
  const parts = steps.at(-1)?.parts;
  if (!parts) throw new Error("Chat event arrived before an assistant step started.");

  if (event.type === "text-delta") {
    const lastIndex = parts.length - 1;
    const last = parts[lastIndex];
    if (last?.type === "text") parts[lastIndex] = { ...last, text: last.text + event.delta };
    else parts.push({ type: "text", text: event.delta });
  }

  if (event.type === "tool-input") {
    parts.push({
      type: "tool",
      state: "input-available",
      toolCallId: event.toolCallId,
      toolName: event.toolName,
      input: event.input,
    });
  }

  if (event.type === "tool-output" || event.type === "tool-error") {
    const partIndex = parts.findIndex(
      (part) => part.type === "tool" && part.toolCallId === event.toolCallId,
    );
    const part = parts[partIndex];
    if (part?.type === "tool") {
      parts[partIndex] =
        event.type === "tool-output"
          ? { ...part, state: "output-available", output: event.output }
          : { ...part, state: "output-error", errorText: event.errorText };
    }
  }

  return messages.map((message, index) =>
    index === assistantIndex ? { ...assistant, steps } : message,
  );
}
