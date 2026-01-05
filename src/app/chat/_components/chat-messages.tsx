'use client'

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ui/shadcn-io/ai/conversation"
import { ChatMessage } from "./chat-message"

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

interface ChatMessagesProps {
  messages: Message[]
  isLoading?: boolean
}

export function ChatMessages({ messages, isLoading = false }: ChatMessagesProps) {
  return (
    <Conversation
      className="relative flex-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ConversationContent className="space-y-4">
        {messages.length === 0 ? (
          isLoading ? (
            <ChatMessage
              message={{
                id: "loading",
                content: "",
                role: "assistant",
                status: "streaming",
              }}
            />
          ) : (
            <div className="flex min-h-[260px] items-center justify-center text-muted-foreground">
              <div className="text-center space-y-2">
                <p className="text-lg">Begin your chat now!</p>
                <p className="text-sm opacity-70">
                  This is a temporary chat session. Your conversation will not be saved.
                </p>
              </div>
            </div>
          )
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  )
}