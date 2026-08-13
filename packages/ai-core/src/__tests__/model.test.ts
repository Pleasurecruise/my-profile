import { describe, expect, it } from "vite-plus/test";
import { createOpenAICompatibleModel } from "../model";

describe("OpenAI-compatible model", () => {
  it("normalizes the base URL and keeps explicit sampling policy", () => {
    const model = createOpenAICompatibleModel({
      id: "deepseek",
      baseUrl: "https://example.test/v1/",
      maxTokens: 1_000,
      samplingParams: { temperature: 0.7 },
    });

    expect(model).toMatchObject({
      id: "deepseek",
      api: "openai-completions",
      baseUrl: "https://example.test/v1",
      maxTokens: 1_000,
      samplingParams: { temperature: 0.7 },
    });
  });
});
