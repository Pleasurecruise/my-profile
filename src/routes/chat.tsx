"use client";

import {
  ArrowUp,
  Check,
  CircleStop,
  LogIn,
  LogOut,
  RotateCcw,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import BlurFade from "@/components/magicui/blur-fade";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageResponse } from "@/components/ui/shadcn-io/ai/message";
import { authClient, useSession } from "@/lib/auth-client";
import { applyChatEvent } from "@/lib/chat-state";
import { cn } from "@/lib/utils";
import type {
  AssistantChatMessage,
  ChatMessage,
  ChatPart,
  ChatStatus,
  ToolPart,
  UserChatMessage,
} from "@/types";
import { parseChatEvent } from "@shared/chat";

export const Route = createFileRoute("/chat")({ component: ChatPage });

const ChatErrorSchema = z.object({ error: z.string().optional() });

const SUGGESTIONS = [
  "介绍一下你自己",
  "你觉得我是怎样的人？",
  "今天有什么想和我说的？",
  "给我讲一件有趣的事",
];

function AgentActivity() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const startedAt = performance.now();
    const timer = window.setInterval(
      () => setElapsed((performance.now() - startedAt) / 1_000),
      100,
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2.5 py-1 text-xs text-muted-foreground" role="status">
      <span className="grid size-3 grid-cols-3 gap-px" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => (
          <span
            key={index}
            className="size-[3px] animate-pulse rounded-[1px] bg-foreground/50"
            style={{ animationDelay: `${index * 75}ms` }}
          />
        ))}
      </span>
      <span className="font-medium text-foreground/70">Thinking</span>
      <span className="font-mono tabular-nums">{elapsed.toFixed(1)}s</span>
    </div>
  );
}

function ToolChip({ part }: { part: ToolPart }) {
  const isDone = part.state === "output-available";
  const isError = part.state === "output-error";
  const detail = isDone ? part.output : isError ? part.errorText : part.input;

  return (
    <details className="group rounded-md border bg-muted/45 text-xs">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-2.5 py-2 text-muted-foreground transition-colors hover:text-foreground">
        {isDone ? (
          <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
        ) : isError ? (
          <X className="size-3.5 text-destructive" />
        ) : (
          <Wrench className="size-3.5 animate-pulse" />
        )}
        <span className="font-medium text-foreground">{part.toolName}</span>
        <span>{isDone ? "Completed" : isError ? "Failed" : "Running"}</span>
      </summary>
      <pre className="max-h-48 overflow-auto border-t px-2.5 py-2 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
        {typeof detail === "string" ? detail : JSON.stringify(detail, null, 2)}
      </pre>
    </details>
  );
}

function AssistantStep({ parts, isStreaming }: { parts: ChatPart[]; isStreaming: boolean }) {
  return (
    <div className="space-y-2.5 animate-in fade-in slide-in-from-bottom-1 duration-300">
      {parts.map((part, index) => {
        if (part.type !== "text") return <ToolChip key={part.toolCallId} part={part} />;

        const isActiveText = isStreaming && index === parts.length - 1;
        return (
          <MessageResponse
            key={`text-${index}`}
            className="text-sm leading-relaxed whitespace-pre-wrap"
            isAnimating={isActiveText}
            mode={isActiveText ? "streaming" : "static"}
          >
            {part.text}
          </MessageResponse>
        );
      })}
    </div>
  );
}

function AssistantMessageView({ message }: { message: AssistantChatMessage }) {
  const isEmpty = message.steps.every((step) => step.parts.length === 0);

  return (
    <div className="max-w-[92%] space-y-2.5">
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <span className="font-medium text-foreground">Vesper</span>
        <span>Pi Agent</span>
      </div>
      {message.steps.map((step, index) => (
        <AssistantStep
          key={`${message.id}-${index}`}
          parts={step.parts}
          isStreaming={message.status === "streaming" && index === message.steps.length - 1}
        />
      ))}
      {message.status === "streaming" && isEmpty && <AgentActivity />}
    </div>
  );
}

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("ready");
  const [text, setText] = useState("");
  const { data: session } = useSession();
  const navigate = useNavigate();
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isRunning = status === "submitted" || status === "streaming";

  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => navigate({ to: "/" }),
        onError: (context) => {
          toast.error(context.error.message);
        },
      },
    });
  };

  const sendMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isRunning) return;

    const userMessage: UserChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      parts: [{ type: "text", text: trimmed }],
      timestamp: new Date().toISOString(),
      user: session?.user ? { name: session.user.name, image: session.user.image } : undefined,
    };
    const requestMessages = [...messages, userMessage];
    const assistantId = crypto.randomUUID();
    const controller = new AbortController();
    abortRef.current = controller;
    setMessages(requestMessages);
    setStatus("submitted");
    setText("");

    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: requestMessages }),
        credentials: "include",
        signal: controller.signal,
      });

      if (!response.ok) {
        const parsed = ChatErrorSchema.safeParse(await response.json());
        throw new Error(
          parsed.success ? (parsed.data.error ?? "Request failed.") : "Request failed.",
        );
      }
      if (!response.body) throw new Error("Chat response has no body.");

      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      let buffer = "";
      let finished = false;

      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        buffer += chunk.value;
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line) continue;
          const event = parseChatEvent(line);
          if (event.type === "error") throw new Error(event.message);
          finished ||= event.type === "finish";
          if (event.type !== "finish") setStatus("streaming");
          setMessages((current) => applyChatEvent(current, assistantId, event));
        }
      }

      if (buffer.trim()) {
        const event = parseChatEvent(buffer);
        if (event.type === "error") throw new Error(event.message);
        finished ||= event.type === "finish";
        setMessages((current) => applyChatEvent(current, assistantId, event));
      }
      if (!finished) throw new Error("Chat stream ended unexpectedly.");
      setStatus("ready");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setStatus("ready");
        return;
      }

      const message = error instanceof Error ? error.message : "Chat request failed.";
      setMessages((current) => {
        const assistant = current.find((item) => item.id === assistantId);
        if (assistant?.role === "assistant") {
          return current.map((item) =>
            item.id === assistantId && item.role === "assistant"
              ? {
                  ...item,
                  status: "error" as const,
                  steps: [...item.steps, { parts: [{ type: "text" as const, text: message }] }],
                }
              : item,
          );
        }
        return [
          ...current,
          {
            id: assistantId,
            role: "assistant" as const,
            status: "error" as const,
            steps: [{ parts: [{ type: "text" as const, text: message }] }],
          },
        ];
      });
      setStatus("error");
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  };

  return (
    <BlurFade delay={0.04}>
      <section className="flex h-[min(720px,calc(100dvh-9rem))] flex-col overflow-hidden rounded-xl border bg-card shadow-sm sm:h-[min(720px,calc(100dvh-12rem))]">
        <header className="flex shrink-0 items-center justify-between border-b p-1.5">
          <div className="flex items-center gap-1">
            <div className="rounded-md bg-muted px-2.5 py-1 text-sm font-medium">Vesper</div>
            <div className="px-2 py-1 text-xs text-muted-foreground">Private session</div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && !isRunning && (
              <button
                type="button"
                onClick={() => {
                  setMessages([]);
                  setStatus("ready");
                }}
                className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Clear conversation"
                title="Clear conversation"
              >
                <RotateCcw className="size-3.5" />
              </button>
            )}
            {session?.user ? (
              <button
                type="button"
                onClick={signOut}
                className="group relative size-8 rounded-full"
                aria-label="Sign out"
                title="Sign out"
              >
                <Avatar className="size-8 transition-opacity group-hover:opacity-15">
                  {session.user.image && (
                    <AvatarImage src={session.user.image} alt={session.user.name} />
                  )}
                  <AvatarFallback className="text-xs">
                    {session.user.name?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <LogOut className="absolute inset-0 m-auto size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate({ to: "/login" })}
                className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Sign in"
                title="Sign in"
              >
                <LogIn className="size-3.5" />
              </button>
            )}
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col justify-center gap-5 pb-10">
              <div className="space-y-2">
                <div className="flex size-9 items-center justify-center rounded-lg border bg-muted/50">
                  <Sparkles className="size-4 text-muted-foreground" />
                </div>
                <h1 className="text-base font-semibold tracking-tight">Chat with Vesper</h1>
                <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                  A private, in-memory conversation powered by Pi Agent. Messages disappear when you
                  leave.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => void sendMessage(suggestion)}
                    className="rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((message) =>
                message.role === "user" ? (
                  <div key={message.id} className="flex justify-end pl-12">
                    <div className="max-w-[85%] rounded-xl bg-muted px-3 py-2 text-sm leading-relaxed">
                      {message.parts.map((part) => part.text).join("\n")}
                    </div>
                  </div>
                ) : (
                  <AssistantMessageView key={message.id} message={message} />
                ),
              )}
              {status === "submitted" && <AgentActivity />}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <form
          className="shrink-0 p-2"
          onSubmit={(event) => {
            event.preventDefault();
            void sendMessage(text);
          }}
        >
          <div className="rounded-xl border bg-muted/45 p-2.5 shadow-xs transition-[border-color,box-shadow] focus-within:border-foreground/25 focus-within:shadow-sm">
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder={isRunning ? "Vesper is thinking…" : "Write a message…"}
              disabled={isRunning}
              rows={2}
              className="max-h-32 min-h-11 w-full resize-none bg-transparent px-1 text-sm leading-relaxed outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
              aria-label="Chat message"
            />
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 px-1 text-[11px] text-muted-foreground">
                <span className="rounded-md border bg-background px-1.5 py-0.5">Pi Agent</span>
                <span className="hidden sm:inline">Shift + Enter for newline</span>
              </div>
              {isRunning ? (
                <button
                  type="button"
                  onClick={() => abortRef.current?.abort()}
                  className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background transition-transform active:scale-95"
                  aria-label="Stop response"
                >
                  <CircleStop className="size-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg transition-[background-color,color,transform] active:scale-95",
                    text.trim()
                      ? "bg-foreground text-background"
                      : "cursor-not-allowed bg-border text-muted-foreground",
                  )}
                  aria-label="Send message"
                >
                  <ArrowUp className="size-4" />
                </button>
              )}
            </div>
          </div>
        </form>
      </section>
    </BlurFade>
  );
}
