import { Hono } from "hono";
import { getBlogFileTree, getBlogPost } from "../lib/blog";

export const blog = new Hono()
  .get("/tree", async (c) => {
    const tree = await getBlogFileTree();
    return c.json(tree);
  })
  .get("/post/*", async (c) => {
    const url = new URL(c.req.url);
    const slug = decodeURIComponent(url.pathname.replace(/^\/api\/blog\/post\//, ""));
    if (!slug) return c.json({ error: "Missing slug" }, 400);

    const post = await getBlogPost(slug);
    if (!post) return c.json({ error: "Not found" }, 404);

    return c.json(post);
  });
