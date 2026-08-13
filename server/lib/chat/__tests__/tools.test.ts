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
      blogBucket: {} as R2Bucket,
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

  it("lists and reads only the blog namespace", async () => {
    const blogBucket = {
      list: async () => ({
        objects: [{ key: "blog/hello.md" }, { key: "img/photo.jpg" }],
        truncated: false,
      }),
      get: async (key: string) =>
        key === "blog/hello.md" ? { text: async () => "# Hello" } : null,
    } as unknown as R2Bucket;
    const tools = createChatTools({
      assets: {} as Fetcher,
      blogBucket,
      profileUrl: new URL("https://you-find.me/llms-full.txt"),
    });
    const blog = tools.find((candidate) => candidate.name === "get_blog");

    const listed = await blog?.execute("list", {});
    const article = await blog?.execute("read", { slug: "hello.md" });
    expect(listed?.details).toEqual({ count: 1, slugs: ["hello.md"] });
    expect(article).toMatchObject({ content: [{ type: "text", text: "# Hello" }] });
  });

  it("exposes only the two necessary read-only tools", () => {
    const tools = createChatTools({
      assets: {} as Fetcher,
      blogBucket: {} as R2Bucket,
      profileUrl: new URL("https://you-find.me/llms-full.txt"),
    });

    expect(tools.map((tool) => tool.name)).toEqual(["get_profile", "get_blog"]);
    expect(tools.every((tool) => tool.executionMode === "sequential")).toBe(true);
  });
});
