import { z } from "zod";

export type ChatStatus = "ready" | "submitted" | "streaming" | "error";
export type MessageStatus = "streaming" | "done" | "error";

export interface TextPart {
  type: "text";
  text: string;
}

interface ToolPartBase {
  type: "tool";
  toolCallId: string;
  toolName: string;
  input: unknown;
}

export type ToolPart =
  | (ToolPartBase & { state: "input-available" })
  | (ToolPartBase & { state: "output-available"; output: unknown })
  | (ToolPartBase & { state: "output-error"; errorText: string });

export type ChatPart = TextPart | ToolPart;

export interface UserChatMessage {
  id: string;
  role: "user";
  parts: TextPart[];
  timestamp?: string;
  user?: { name: string; image?: string | null };
}

export interface AssistantStep {
  parts: ChatPart[];
}

export interface AssistantChatMessage {
  id: string;
  role: "assistant";
  steps: AssistantStep[];
  timestamp?: string;
  status?: MessageStatus;
}

export type ChatMessage = UserChatMessage | AssistantChatMessage;

export type ChatEvent =
  | { type: "assistant-step" }
  | { type: "text-delta"; delta: string }
  | { type: "tool-input"; toolCallId: string; toolName: string; input: unknown }
  | { type: "tool-output"; toolCallId: string; output: unknown }
  | { type: "tool-error"; toolCallId: string; errorText: string }
  | { type: "error"; message: string }
  | { type: "finish" };

const toolBase = {
  type: z.literal("tool"),
  toolCallId: z.string().min(1),
  toolName: z.string().min(1),
  input: z.unknown(),
};

const textPartSchema = z.object({ type: z.literal("text"), text: z.string() });

const partSchema = z.union([
  textPartSchema,
  z.object({ ...toolBase, state: z.literal("input-available") }),
  z.object({ ...toolBase, state: z.literal("output-available"), output: z.unknown() }),
  z.object({ ...toolBase, state: z.literal("output-error"), errorText: z.string() }),
]);

const messageSchema: z.ZodType<ChatMessage> = z.discriminatedUnion("role", [
  z.object({ id: z.string().min(1), role: z.literal("user"), parts: z.array(textPartSchema) }),
  z.object({
    id: z.string().min(1),
    role: z.literal("assistant"),
    steps: z.array(z.object({ parts: z.array(partSchema) })),
  }),
]);

export const chatRequestSchema = z.object({
  messages: z
    .array(messageSchema)
    .nonempty()
    .refine((messages) => messages.at(-1)?.role === "user", "The last message must be user."),
});

const chatEventSchema: z.ZodType<ChatEvent> = z.discriminatedUnion("type", [
  z.object({ type: z.literal("assistant-step") }),
  z.object({ type: z.literal("text-delta"), delta: z.string() }),
  z.object({
    type: z.literal("tool-input"),
    toolCallId: z.string(),
    toolName: z.string(),
    input: z.unknown(),
  }),
  z.object({ type: z.literal("tool-output"), toolCallId: z.string(), output: z.unknown() }),
  z.object({ type: z.literal("tool-error"), toolCallId: z.string(), errorText: z.string() }),
  z.object({ type: z.literal("error"), message: z.string() }),
  z.object({ type: z.literal("finish") }),
]);

export function parseChatEvent(line: string): ChatEvent {
  return chatEventSchema.parse(JSON.parse(line));
}
