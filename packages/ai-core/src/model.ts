import type { Model } from "@earendil-works/pi-ai";
import type { OpenAICompatibleModelOptions } from "./types";

/** Builds the small pi model descriptor needed by OpenAI-compatible chat-completions APIs. */
export function createOpenAICompatibleModel({
  id,
  provider = "openai-compatible",
  name = id,
  baseUrl,
  contextWindow = 128_000,
  maxTokens = 8_192,
  headers,
  samplingParams,
}: OpenAICompatibleModelOptions): Model<"openai-completions"> {
  return {
    id,
    name,
    api: "openai-completions",
    provider,
    baseUrl: baseUrl.replace(/\/$/, ""),
    reasoning: false,
    input: ["text"],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow,
    maxTokens,
    headers,
    samplingParams,
    compat: {
      supportsDeveloperRole: false,
      supportsStore: false,
      supportsReasoningEffort: false,
      supportsUsageInStreaming: true,
      maxTokensField: "max_tokens",
      requiresToolResultName: false,
      requiresAssistantAfterToolResult: false,
      requiresThinkingAsText: false,
      requiresReasoningContentOnAssistantMessages: false,
      thinkingFormat: "deepseek",
      supportsStrictMode: false,
      supportsOpenAIGrammarTools: false,
      sendSessionAffinityHeaders: false,
      supportsLongCacheRetention: false,
    },
  };
}
