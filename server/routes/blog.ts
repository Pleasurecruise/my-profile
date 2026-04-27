import { Hono } from "hono";
import type { Bindings } from "../types/bindings";
import { getBlogFileTree, getBlogPost } from "../lib/blog";

export const blog = new Hono<{ Bindings: Bindings }>()
  .get("/tree", async (c) => {
    const tree = await getBlogFileTree(c.env.BLOG_BUCKET);
    return c.json(tree);
  })
  .get("/post/*", async (c) => {
    const url = new URL(c.req.url);
    const slug = decodeURIComponent(url.pathname.replace(/^\/api\/blog\/post\//, ""));
    if (!slug) return c.json({ error: "Missing slug" }, 400);

    const post = await getBlogPost(c.env.BLOG_BUCKET, slug);
    if (!post) return c.json({ error: "Not found" }, 404);

    return c.json(post);
  });
