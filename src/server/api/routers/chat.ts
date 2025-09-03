import { z } from "zod";
import OpenAI from 'openai';
import { TRPCError } from "@trpc/server";

import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";

// 检查必要的环境变量
if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_URL,
});

export const chatRouter = createTRPCRouter({
    chat: protectedProcedure
        .input(z.object({ 
            messages: z.array(z.object({
                role: z.enum(['user', 'assistant', 'system']),
                content: z.string()
            }))
        }))
        .mutation(async ({ input, ctx: _ctx }) => {
            // 检查API密钥是否存在
            if (!process.env.OPENAI_API_KEY) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: '服务器配置错误：缺少API密钥',
                });
            }

            try {
                const completion = await openai.chat.completions.create({
                    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
                    messages: input.messages,
                    temperature: 0.7,
                    max_tokens: 1000,
                    stream: true,
                });

                let fullContent = '';
                const chunks: string[] = [];

                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content;
                    if (content) {
                        fullContent += content;
                        chunks.push(content);
                    }
                }

                return {
                    content: fullContent,
                    chunks: chunks,
                };
            } catch (error) {
                console.error('OpenAI API error:', error);
                
                // 处理具体的API错误
                if (error instanceof Error) {
                    if (error.message.includes('401') || error.message.includes('无效的令牌')) {
                        throw new TRPCError({
                            code: 'INTERNAL_SERVER_ERROR',
                            message: 'API密钥无效或已过期，请联系管理员检查配置',
                        });
                    }
                    
                    if (error.message.includes('429')) {
                        throw new TRPCError({
                            code: 'TOO_MANY_REQUESTS',
                            message: 'API请求频率过高，请稍后再试',
                        });
                    }
                    
                    if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
                        throw new TRPCError({
                            code: 'INTERNAL_SERVER_ERROR',
                            message: 'AI服务暂时不可用，请稍后再试',
                        });
                    }
                }
                
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'AI服务出现错误，请稍后再试',
                });
            }
        }),
});