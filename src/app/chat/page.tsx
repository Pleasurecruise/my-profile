'use client'

import { useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
import { ChatMessages } from "./_components/chat-messages"
import { ChatInput } from "./_components/chat-input"
import BlurFade from "@/components/magicui/blur-fade"
import { api } from "@/trpc/react"
import { useSession, authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { LogOut, LogIn } from "lucide-react"
import { toast } from "sonner"

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

const BLUR_FADE_DELAY = 0.04;

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { data: session } = useSession()
    const sendMessageMutation = api.chat.sendMessage.useMutation()
    const resumeMessageMutation = api.chat.resumeMessage.useMutation()
    const router = useRouter()
    const isResumingRef = useRef(false)

    const signOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                },
            },
        });
    };

    const appendAssistantChunk = (messageId: string, text: string, status: Message['status']) => {
        setMessages(prev => {
            const existingIndex = prev.findIndex(msg => msg.id === messageId)
            const next = [...prev]

            if (existingIndex >= 0) {
                const existing = next[existingIndex]
                next[existingIndex] = {
                    ...existing,
                    content: existing.content + text,
                    status,
                }
                return next
            }

            const pendingIndex = next.findIndex(
                msg => msg.role === 'assistant' && msg.status === 'streaming' && msg.content === ''
            )

            const nextMessage: Message = {
                id: messageId,
                content: text,
                role: 'assistant',
                timestamp: new Date(),
                status,
            }

            if (pendingIndex >= 0) {
                next[pendingIndex] = nextMessage
            } else {
                next.push(nextMessage)
            }

            return next
        })
    }

    const updateAssistantStatus = (messageId: string, status: Message['status']) => {
        setMessages(prev =>
            prev.map(msg =>
                msg.id === messageId ? { ...msg, status } : msg
            )
        )
    }

    const resumeStreamingMessage = async (message: Message) => {
        if (isResumingRef.current) return
        isResumingRef.current = true
        setIsLoading(true)

        try {
            const stream = await resumeMessageMutation.mutateAsync({
                messageId: message.id,
                currentContent: message.content,
            })

            for await (const chunk of stream) {
                if (chunk.text) {
                    appendAssistantChunk(chunk.messageId, chunk.text, chunk.status)
                } else {
                    updateAssistantStatus(chunk.messageId, chunk.status)
                }
            }
        } catch (error) {
            console.error('Error resuming message:', error)
        } finally {
            setIsLoading(false)
            isResumingRef.current = false
        }
    }

    const sendMessage = async (content: string) => {
        const userMessage: Message = {
            id: Date.now().toString(),
            content,
            role: 'user',
            timestamp: new Date(),
            user: session?.user ? {
                name: session.user.name,
                image: session.user.image || undefined
            } : undefined
        }

        const pendingAssistantId = `pending-${userMessage.id}`
        const pendingAssistantMessage: Message = {
            id: pendingAssistantId,
            content: '',
            role: 'assistant',
            timestamp: new Date(),
            status: 'streaming',
        }

        setMessages(prev => [...prev, userMessage, pendingAssistantMessage])
        setIsLoading(true)

        try {
            const stream = await sendMessageMutation.mutateAsync({
                messages: [...messages, userMessage].map(msg => ({
                    role: msg.role as 'user' | 'assistant' | 'system',
                    content: msg.content,
                })),
            })

            for await (const chunk of stream) {
                if (chunk.text) {
                    appendAssistantChunk(chunk.messageId, chunk.text, chunk.status)
                } else {
                    updateAssistantStatus(chunk.messageId, chunk.status)
                }
            }
        } catch (error) {
            console.error('Error sending message:', error)
            setIsLoading(false)

            let errorContent = '抱歉，发生了错误。请稍后再试。'
            if (error && typeof error === 'object' && 'message' in error) {
                errorContent = error.message as string
            }

            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: errorContent,
                role: 'assistant',
                timestamp: new Date(),
            }
            setMessages(prev => [
                ...prev.filter(msg => msg.id !== pendingAssistantId),
                errorMessage,
            ])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isLoading) return
        const streamingMessage = messages.find(message => message.status === 'streaming')
        if (streamingMessage) {
            void resumeStreamingMessage(streamingMessage)
        }
    }, [messages, isLoading])

    return (
        <BlurFade delay={BLUR_FADE_DELAY}>
            <div className="flex flex-col h-full w-full">
                <Card className="flex flex-col flex-1 w-full max-w-2xl mx-auto border shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between border-b px-4 py-3 sm:px-6">
                        <div>
                            <h2 className="text-lg font-semibold">Chat with DeepSeek</h2>
                            <p className="text-xs text-muted-foreground">Private session. Messages are not saved.</p>
                        </div>
                        {session?.user ? (
                            <div className="group relative">
                                <Avatar className="h-8 w-8 cursor-pointer transition-transform hover:scale-105">
                                    {session.user.image ? (
                                        <AvatarImage src={session.user.image} alt={session.user.name} />
                                    ) : null}
                                    <AvatarFallback className="text-xs">
                                        {session.user.name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button
                                        onClick={signOut}
                                        className="h-8 w-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-lg transition-colors hover:bg-destructive/90"
                                        title="Sign out"
                                    >
                                        <LogOut size={14} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => router.push('/login')}
                                className="h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center transition-colors shadow-sm hover:bg-primary/90"
                                title="Sign in"
                            >
                                <LogIn size={14} />
                            </button>
                        )}
                    </CardHeader>

                    <CardContent className="flex-1 p-0">
                        <ChatMessages messages={messages} isLoading={isLoading} />
                    </CardContent>

                    <CardFooter className="border-t p-3 sm:p-4">
                        <ChatInput onSendMessage={sendMessage} disabled={isLoading} loading={isLoading} />
                    </CardFooter>
                </Card>
            </div>
        </BlurFade>
    )
}
