import type { AgentEvent, AgentMessage, AgentTool } from "@earendil-works/pi-agent-core";
import type { Model, ProviderHeaders } from "@earendil-works/pi-ai";

export interface OpenAICompatibleModelOptions {
  id: string;
  provider?: string;
  name?: string;
  baseUrl: string;
  contextWindow?: number;
  maxTokens?: number;
  headers?: Record<string, string>;
  samplingParams?: Record<string, unknown>;
}

export interface RunAgentOptions {
  systemPrompt: string;
  model: Model<"openai-completions">;
  messages: AgentMessage[];
  tools?: AgentTool[];
  apiKey?: string;
  headers?: ProviderHeaders;
  signal?: AbortSignal;
  onEvent?: (event: AgentEvent) => void | Promise<void>;
}
