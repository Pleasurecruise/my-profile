'use client'

import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ui/shadcn-io/ai/prompt-input"
import { useState } from "react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  loading?: boolean
}

export function ChatInput({ onSendMessage, disabled = false, loading }: ChatInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <PromptInput onSubmit={handleSubmit} className="w-full">
      <PromptInputTextarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? "Waiting for response..." : "Input your message here..."}
        disabled={disabled}
      />
      <PromptInputToolbar>
        <div className="text-xs text-muted-foreground px-2">
          Shift+Enter for newline
        </div>
        <PromptInputTools>
          <PromptInputSubmit
            disabled={!message.trim() || disabled}
            status={loading ? "submitted" : undefined}
          />
        </PromptInputTools>
      </PromptInputToolbar>
    </PromptInput>
  )
}