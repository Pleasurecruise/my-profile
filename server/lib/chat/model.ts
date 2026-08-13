import { createOpenAICompatibleModel, type Model } from "@my-profile/ai-core";

export function createChatModel(options: {
  baseUrl: string;
  modelId: string;
}): Model<"openai-completions"> {
  return createOpenAICompatibleModel({
    id: options.modelId,
    provider: "siliconflow",
    baseUrl: options.baseUrl,
    maxTokens: 1_000,
    samplingParams: { temperature: 0.7 },
  });
}
