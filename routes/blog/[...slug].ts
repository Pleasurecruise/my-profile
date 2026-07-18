import { defineHandler } from "void/handler";
import { getBlogPostMeta } from "@server/lib/blog";
import { injectOgTags } from "@server/lib/og-inject";
import { SITE_URL } from "@server/lib/site";

export const GET = defineHandler(async (c) => {
  const rawSlug = new URL(c.req.url).pathname.slice("/blog/".length);
  const htmlResponse = await c.env.ASSETS.fetch(c.req.raw);
  if (!rawSlug) return htmlResponse;

  const decodedSlug = rawSlug.split("/").map(decodeURIComponent).join("/");
  const encodedSlug = decodedSlug.split("/").map(encodeURIComponent).join("/");
  const meta = await getBlogPostMeta(c.env.BLOG_BUCKET, c.env.KV_NAMESPACE, decodedSlug);
  if (!meta) return htmlResponse;

  const description = meta.excerpt.length > 160 ? `${meta.excerpt.slice(0, 157)}…` : meta.excerpt;
  return injectOgTags(htmlResponse, {
    title: `${meta.title} · Pleasure1234`,
    description,
    imageUrl: `${SITE_URL}/api/og/blog/${encodedSlug}`,
    pageUrl: `${SITE_URL}/blog/${encodedSlug}`,
    type: "article",
  });
});
