'use client'

import { useEffect, useRef } from "react"
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
}

interface ChatMessagesProps {
  messages: Message[]
  isLoading?: boolean
}

export function ChatMessages({ messages, isLoading = false }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div 
      className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-transparent"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgb(156 163 175) transparent'
      }}
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center space-y-2">
            <p className="text-lg">Begin Your Chat Now!</p>
            <p className="text-sm opacity-70">This is a temporary chat session. Your conversation will not be saved.</p>
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))
      )}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="flex max-w-[80%] gap-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs">
              AI
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  )
}