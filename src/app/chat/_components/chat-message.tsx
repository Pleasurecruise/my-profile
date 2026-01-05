'use client'

import { Loader } from "@/components/ui/shadcn-io/ai/loader"
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/shadcn-io/ai/message"
import { Response } from "@/components/ui/shadcn-io/ai/response"
import { cn, formatTime } from "@/lib/utils"

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp?: Date
  user?: {
    name: string
    image?: string
  }
  status?: 'streaming' | 'done' | 'error'
}

interface ChatMessageProps {
  message: Message
}

function getStatusText(status?: string, isUser?: boolean): string {
  if (isUser) {
    return status === 'done' ? 'Delivered' : ''
  }
  switch (status) {
    case 'streaming': return 'Typing...'
    case 'done': return 'Delivered'
    case 'error': return 'Error'
    default: return ''
  }
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const showLoader = !isUser && message.status === 'streaming'
  const statusText = getStatusText(message.status, isUser)
  const displayName = isUser ? (message.user?.name ?? "You") : "Assistant"
  const avatarSrc = isUser
    ? message.user?.image
    : "https://avatars.githubusercontent.com/u/148330874"
  const defaultUserAvatar = "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.svg"

  return (
    <Message from={isUser ? "user" : "assistant"} className="py-2">
      <MessageContent className="space-y-2">
        <div
          className={cn(
            "flex items-center gap-2 text-xs",
            isUser
              ? "justify-end text-primary-foreground/80"
              : "justify-start text-muted-foreground"
          )}
        >
          <span className={cn("font-medium", isUser ? "text-primary-foreground" : "text-foreground")}>
            {displayName}
          </span>
          {message.timestamp && (
            <time className={cn(isUser ? "text-primary-foreground/60" : "text-muted-foreground")}>
              {formatTime(message.timestamp)}
            </time>
          )}
        </div>
        {message.content ? (
          isUser ? (
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </div>
          ) : (
            <Response className="text-sm leading-relaxed">
              {message.content}
            </Response>
          )
        ) : null}
        {showLoader ? (
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <Loader size={14} />
            <span>Typing...</span>
          </div>
        ) : statusText ? (
          <div className="text-xs text-muted-foreground">{statusText}</div>
        ) : null}
      </MessageContent>
      <MessageAvatar
        name={displayName}
        src={avatarSrc || defaultUserAvatar}
      />
    </Message>
  )
}