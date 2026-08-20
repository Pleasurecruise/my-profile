import { describe, expect, it } from "vite-plus/test";
import { createChatTools } from "../tools";

describe("chat tools", () => {
  it("reads the public profile through the assets binding", async () => {
    let requestedUrl = "";
    const assets = {
      fetch: async (request: Request) => {
        requestedUrl = request.url;
        return new Response("# Public profile");
      },
    } as unknown as Fetcher;
    const tools = createChatTools({
      assets,
      profileUrl: new URL("https://you-find.me/llms-full.txt"),
    });
    const tool = tools.find((candidate) => candidate.name === "get_profile");

    const result = await tool?.execute("call", {});
    expect(requestedUrl).toBe("https://you-find.me/llms-full.txt");
    expect(result).toMatchObject({
      content: [{ type: "text", text: "# Public profile" }],
      details: { source: "/llms-full.txt" },
    });
  });

  it("exposes only the public profile tool", () => {
    const tools = createChatTools({
      assets: {} as Fetcher,
      profileUrl: new URL("https://you-find.me/llms-full.txt"),
    });

    expect(tools.map((tool) => tool.name)).toEqual(["get_profile"]);
    expect(tools.every((tool) => tool.executionMode === "sequential")).toBe(true);
  });
});
