"use client";

import { LogIn, LogOut, Sparkles } from "lucide-react";
import { useNavigate, createFileRoute } from "@tanstack/react-router";
import BlurFade from "@/components/magicui/blur-fade";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient, useSession } from "@/lib/auth-client";
import { Loader } from "@/components/ui/shadcn-io/ai/loader";
import { Message, MessageContent } from "@/components/ui/shadcn-io/ai/message";
import { Response as MarkdownResponse } from "@/components/ui/shadcn-io/ai/response";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ui/shadcn-io/ai/prompt-input";
import { Suggestion, Suggestions } from "@/components/ui/shadcn-io/ai/suggestion";
import type { ChatMessage } from "@/types";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
});

const BLUR_FADE_DELAY = 0.04;

const ChatErrorSchema = z.object({
  error: z.string().optional(),
});

const SUGGESTIONS = [
  "Tell me about yourself",
  "What can you help me with?",
  "Write a short poem",
  "Explain quantum computing simply",
  "Best practices for React",
  "Help me brainstorm ideas",
];

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const { data: session } = useSession();
  const navigate = useNavigate();
  const abortRef = useRef<AbortController | null>(null);

  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => navigate({ to: "/" }),
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    });
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
      user: session?.user ? { name: session.user.name, image: session.user.image } : undefined,
    };

    const assistantId = `assistant-${Date.now()}`;
    const assistantMsg: ChatMessage = {
      id: assistantId,
      content: "",
      role: "assistant",
      timestamp: new Date(),
      status: "streaming",
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsLoading(true);

    try {
      const apiMessages = [...messages, userMsg].map(({ role, content: c }) => ({
        role,
        content: c,
      }));

      const res = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
        credentials: "include",
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const rawError = await res.json().catch(() => ({ error: "Request failed" }));
        const parsedError = ChatErrorSchema.safeParse(rawError);
        throw new Error(
          parsedError.success ? (parsedError.data.error ?? "Request failed") : "Request failed",
        );
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + chunk } : m)),
        );
      }

      setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, status: "done" } : m)));
    } catch (error) {
      if ((error as Error).name === "AbortError") return;
      const errorContent =
        error instanceof Error ? error.message : "Sorry, an error occurred. Please try again.";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: errorContent, status: "error" as const } : m,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (message: PromptInputMessage) => {
    const trimmed = message.text.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setText("");
  };

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const hasMessages = messages.length > 0;

  return (
    <BlurFade delay={BLUR_FADE_DELAY}>
      <div className="flex min-h-[calc(100dvh-14rem)] flex-col">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b px-1 py-3">
          <div>
            <h2 className="text-sm font-semibold">Chat with Vesper</h2>
            <p className="text-xs text-muted-foreground">Private · messages are not saved</p>
          </div>
          {session?.user ? (
            <div className="group relative">
              <Avatar className="h-8 w-8 cursor-pointer transition-transform hover:scale-105">
                {session.user.image && (
                  <AvatarImage src={session.user.image} alt={session.user.name} />
                )}
                <AvatarFallback className="text-xs">
                  {session.user.name?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute top-0 left-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={signOut}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg transition-colors hover:bg-destructive/90"
                  title="Sign out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => navigate({ to: "/login" })}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              title="Sign in"
            >
              <LogIn size={14} />
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex flex-1 flex-col gap-6 py-4">
          {!hasMessages && (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Sparkles className="size-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-sm">How can I help you today?</h3>
                <p className="text-muted-foreground text-xs">
                  Ask anything to start a private conversation.
                </p>
              </div>
            </div>
          )}
          {messages.map((message) => (
            <Message from={message.role} key={message.id}>
              <MessageContent>
                {message.role === "user" ? (
                  <p className="text-sm leading-relaxed">{message.content}</p>
                ) : message.content ? (
                  <MarkdownResponse className="text-sm leading-relaxed">
                    {message.content}
                  </MarkdownResponse>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader size={14} />
                    <span>Typing...</span>
                  </div>
                )}
              </MessageContent>
            </Message>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Footer: suggestions + input */}
        <div className="space-y-3 pt-3">
          {!hasMessages && (
            <Suggestions>
              {SUGGESTIONS.map((s) => (
                <Suggestion
                  key={s}
                  suggestion={s}
                  onClick={() => sendMessage(s)}
                  disabled={isLoading}
                />
              ))}
            </Suggestions>
          )}
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputTextarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={isLoading ? "Waiting for response..." : "Ask anything..."}
                disabled={isLoading}
              />
            </PromptInputBody>
            <PromptInputFooter>
              <div className="px-1 text-xs text-muted-foreground">Shift+Enter for newline</div>
              <PromptInputTools>
                <PromptInputSubmit
                  disabled={!text.trim() || isLoading}
                  status={isLoading ? "submitted" : undefined}
                />
              </PromptInputTools>
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </BlurFade>
  );
}
