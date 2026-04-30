import { Hono } from "hono";
import { getBlogPost } from "../lib/blog";
import { generateOgImageResponse } from "../lib/og";

export const og = new Hono<{ Bindings: Cloudflare.Env }>()
  .get("/home", (_c) => generateOgImageResponse({ type: "home" }))
  .get("/blog/*", async (c) => {
    const slug = c.req.path.replace(/^\/api\/og\/blog\//, "");
    if (!slug) return c.json({ error: "Missing slug" }, 400);

    const post = await getBlogPost(c.env.BLOG_BUCKET, c.env.KV_NAMESPACE, slug);
    if (!post) return c.json({ error: "Not found" }, 404);

    return generateOgImageResponse({
      type: "blog",
      title: post.title,
      description: post.excerpt.length > 100 ? post.excerpt.slice(0, 100) + "…" : post.excerpt,
    });
  });
