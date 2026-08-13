import { Agent, type AgentMessage, type StreamFn } from "@earendil-works/pi-agent-core";
import type { Model } from "@earendil-works/pi-ai";
import { streamSimple } from "@earendil-works/pi-ai/api/openai-completions";
import type { RunAgentOptions } from "./types";

/** Runs one stateless agent invocation and lets pi own the complete agent loop. */
export async function runAgent({
  systemPrompt,
  model,
  messages,
  tools = [],
  apiKey,
  headers,
  signal,
  onEvent,
}: RunAgentOptions): Promise<AgentMessage[]> {
  const stream: StreamFn = (streamModel, context, options) =>
    streamSimple(streamModel as Model<"openai-completions">, context, { ...options, headers });
  const agent = new Agent({
    initialState: { systemPrompt, model, messages, tools },
    streamFn: stream,
    getApiKey: apiKey ? () => apiKey : undefined,
    toolExecution: "parallel",
  });

  const unsubscribe = onEvent ? agent.subscribe(onEvent) : undefined;
  const abort = () => agent.abort();
  signal?.addEventListener("abort", abort, { once: true });

  try {
    if (signal?.aborted) agent.abort();
    await agent.continue();
    if (signal?.aborted) {
      throw signal.reason instanceof Error ? signal.reason : new Error("Agent run aborted.");
    }
    if (agent.state.errorMessage) throw new Error(agent.state.errorMessage);
    return agent.state.messages;
  } finally {
    unsubscribe?.();
    signal?.removeEventListener("abort", abort);
  }
}
