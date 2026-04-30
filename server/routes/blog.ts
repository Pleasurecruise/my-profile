import { Hono } from "hono";
import { getBlogFileTree, getBlogPost, rebuildBlogPostKv, rebuildBlogTreeKv } from "../lib/blog";

export const blog = new Hono<{ Bindings: Cloudflare.Env }>()
  .get("/tree", async (c) => {
    const tree = await getBlogFileTree(c.env.BLOG_BUCKET, c.env.KV_NAMESPACE);
    return c.json(tree);
  })
  .get("/post/*", async (c) => {
    const url = new URL(c.req.url);
    const slug = decodeURIComponent(url.pathname.replace(/^\/api\/blog\/post\//, ""));
    if (!slug) return c.json({ error: "Missing slug" }, 400);

    const post = await getBlogPost(c.env.BLOG_BUCKET, c.env.KV_NAMESPACE, slug);
    if (!post) return c.json({ error: "Not found" }, 404);

    return c.json(post);
  })
  .post("/cache/rebuild", async (c) => {
    const auth = c.req.header("Authorization");
    if (!auth || auth !== `Bearer ${c.env.AM_I_OK_SECRET}`) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const slug = c.req.query("slug");
    if (slug) {
      const post = await rebuildBlogPostKv(c.env.BLOG_BUCKET, c.env.KV_NAMESPACE, slug);
      if (!post) return c.json({ error: "Not found" }, 404);
      return c.json({ ok: true, slug: post.slug });
    }

    await rebuildBlogTreeKv(c.env.BLOG_BUCKET, c.env.KV_NAMESPACE);
    return c.json({ ok: true });
  });
