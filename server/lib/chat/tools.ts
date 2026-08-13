import { Type, type AgentTool } from "@my-profile/ai-core";
import { getAllBlogSlugs } from "@server/lib/blog";

const noParameters = Type.Object({});
const getBlogParameters = Type.Object({
  slug: Type.Optional(
    Type.String({
      description: "An exact Markdown slug returned by an earlier get_blog call.",
    }),
  ),
});

export function createChatTools(bindings: {
  assets: Fetcher;
  blogBucket: R2Bucket;
  profileUrl: URL;
}): AgentTool[] {
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

  const getBlog: AgentTool<typeof getBlogParameters> = {
    name: "get_blog",
    label: "Read blog",
    description:
      "List public blog slugs when slug is omitted, or read one post when given an exact listed slug.",
    parameters: getBlogParameters,
    executionMode: "sequential",
    async execute(_toolCallId, { slug }, signal) {
      signal?.throwIfAborted();
      if (!slug) {
        const slugs = await getAllBlogSlugs(bindings.blogBucket);
        signal?.throwIfAborted();
        return {
          content: [{ type: "text", text: JSON.stringify(slugs) }],
          details: { count: slugs.length, slugs },
        };
      }

      const object = await bindings.blogBucket.get(`blog/${decodeURIComponent(slug)}`);
      signal?.throwIfAborted();
      if (!object) throw new Error(`Blog post not found: ${slug}`);
      const markdown = await object.text();
      return {
        content: [{ type: "text", text: markdown }],
        details: { slug },
      };
    },
  };

  return [getProfile, getBlog];
}
