'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp?: Date
  user?: {
    name: string
    image?: string
  }
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  
  return (
    <div className={cn(
      "flex w-full mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex max-w-[80%] gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <div className="flex flex-col items-center gap-1">
          <Avatar className="h-8 w-8 flex-shrink-0">
            {isUser && message.user?.image ? (
              <AvatarImage src={message.user.image} alt={message.user.name} />
            ) : null}
            <AvatarFallback>
              {isUser ? (message.user?.name?.charAt(0) || "U") : "AI"}
            </AvatarFallback>
          </Avatar>
          {isUser && message.user?.name && (
            <span className="text-xs text-muted-foreground max-w-16 truncate">
              {message.user.name}
            </span>
          )}
        </div>
        
        <Card className={cn(
          "border",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted"
        )}>
          <CardContent className="p-3 flex items-center">
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}