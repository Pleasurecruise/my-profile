import { requireAuth } from "void/auth";
import { defineHandler } from "void/handler";
import { rebuildBlogPostKv, rebuildBlogTreeKv } from "@server/lib/blog";
import { invalidateSitemapKv } from "@server/lib/sitemap";

export const POST = defineHandler(async (c) => {
  requireAuth(c);

  const slug = c.req.query("slug");
  if (slug) {
    const post = await rebuildBlogPostKv(c.env.BLOG_BUCKET, c.env.KV_NAMESPACE, slug);
    if (!post) return c.json({ error: "Not found" }, 404);
    return c.json({ ok: true, slug: post.slug });
  }

  await Promise.all([
    rebuildBlogTreeKv(c.env.BLOG_BUCKET, c.env.KV_NAMESPACE),
    invalidateSitemapKv(c.env.KV_NAMESPACE),
  ]);
  return c.json({ ok: true });
});
