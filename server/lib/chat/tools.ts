import { Type, type AgentTool } from "@my-profile/ai-core";

const noParameters = Type.Object({});

export function createChatTools(bindings: { assets: Fetcher; profileUrl: URL }): AgentTool[] {
  const getProfile: AgentTool<typeof noParameters> = {
    name: "get_profile",
    label: "Read profile",
    description:
      "Read the public profile, education, work, projects, devices, travel, and contact information published on this website.",
    parameters: noParameters,
    executionMode: "sequential",
    async execute(_toolCallId, _params, signal) {
      const response = await bindings.assets.fetch(new Request(bindings.profileUrl, { signal }));
      if (!response.ok) {
        throw new Error(`The public profile document is unavailable (${response.status}).`);
      }
      const profile = await response.text();
      return {
        content: [{ type: "text", text: profile }],
        details: { source: "/llms-full.txt" },
      };
    },
  };

  return [getProfile];
}
