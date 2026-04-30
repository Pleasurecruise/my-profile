export type MessageStatus = "streaming" | "done" | "error";

export type ChatMessage = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp?: Date;
  user?: { name: string; image?: string | null };
  status?: MessageStatus;
};
