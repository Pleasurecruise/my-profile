import { defineHandler } from "void/handler";
import { getBlogPost } from "@server/lib/blog";

export const GET = defineHandler(async (c) => {
  const slug = decodeURIComponent(new URL(c.req.url).pathname.replace(/^\/api\/blog\/post\//, ""));
  if (!slug) return c.json({ error: "Missing slug" }, 400);

  const post = await getBlogPost(c.env.BLOG_BUCKET, c.env.KV_NAMESPACE, slug);
  if (!post) return c.json({ error: "Not found" }, 404);

  return c.json(post);
});
