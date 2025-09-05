'use client'

import {useState} from "react"
import {ChatMessages} from "./_components/chat-messages"
import {ChatInput} from "./_components/chat-input"
import BlurFade from "@/components/magicui/blur-fade";
import {Card, CardContent, CardHeader, CardTitle, CardFooter} from "@/components/ui/card"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {api} from "@/trpc/react"
import {useSession, authClient} from "@/lib/auth-client"
import {useRouter} from "next/navigation"
import {LogOut, LogIn} from "lucide-react"
import { toast } from "sonner";

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

const BLUR_FADE_DELAY = 0.04;

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { data: session } = useSession()
    const chatMutation = api.chat.chat.useMutation()
    const router = useRouter()

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

    const simulateTyping = (content: string, messageId: string) => {
        let currentContent = '';
        let index = 0;

        const typeCharacter = () => {
            if (index < content.length) {
                currentContent += content[index];
                setMessages(prev => prev.map(msg =>
                    msg.id === messageId
                        ? { ...msg, content: currentContent }
                        : msg
                ));
                index++;
                setTimeout(typeCharacter, 20);
            }
        };

        typeCharacter();
    };

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

        setMessages(prev => [...prev, userMessage])
        setIsLoading(true)

        try {
            const response = await chatMutation.mutateAsync({
                messages: [...messages, userMessage].map(msg => ({
                    role: msg.role as 'user' | 'assistant' | 'system',
                    content: msg.content,
                })),
            });

            setIsLoading(false);

            const assistantMessageId = (Date.now() + 1).toString()
            const assistantMessage: Message = {
                id: assistantMessageId,
                content: '',
                role: 'assistant',
                timestamp: new Date(),
            }

            setMessages(prev => [...prev, assistantMessage])
            simulateTyping(response.content, assistantMessageId);
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
            setMessages(prev => [...prev, errorMessage])
        }
    }

    return (
        <BlurFade delay={BLUR_FADE_DELAY}>
            <div className="flex flex-col h-full w-full">
                <Card className="flex flex-col flex-1 w-full max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Chat with DeepSeek</span>
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
                                    
                                    {/* 悬浮时显示的退出按钮 */}
                                    <div className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button
                                            onClick={signOut}
                                            className="h-8 w-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                                            title="Sign out"
                                        >
                                            <LogOut size={14} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => router.push('/login')}
                                    className="h-8 w-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                                    title="Sign in"
                                >
                                    <LogIn size={14} />
                                </button>
                            )}
                        </CardTitle>
                    </CardHeader>

                    {/* 消息流 */}
                    <CardContent className="flex-1 overflow-y-auto p-4">
                        <ChatMessages messages={messages} isLoading={isLoading}/>
                    </CardContent>

                    {/* 输入框固定在底部 */}
                    <CardFooter className="border-t p-2">
                        <ChatInput onSendMessage={sendMessage} disabled={isLoading}/>
                    </CardFooter>
                </Card>
            </div>
        </BlurFade>
    )
}
