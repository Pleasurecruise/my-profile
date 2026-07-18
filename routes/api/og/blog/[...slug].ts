import { defineHandler } from "void/handler";
import { getBlogPostMeta } from "@server/lib/blog";
import { generateOgImageResponse } from "@server/lib/og";

export const GET = defineHandler(async (c) => {
  const slug = c.req.path.replace(/^\/api\/og\/blog\//, "");
  if (!slug) return c.json({ error: "Missing slug" }, 400);

  const meta = await getBlogPostMeta(c.env.BLOG_BUCKET, c.env.KV_NAMESPACE, slug);
  if (!meta) return c.json({ error: "Not found" }, 404);

  return generateOgImageResponse({
    type: "blog",
    title: meta.title,
    description: meta.excerpt.length > 100 ? `${meta.excerpt.slice(0, 100)}…` : meta.excerpt,
  });
});
