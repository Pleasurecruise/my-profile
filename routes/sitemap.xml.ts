import { defineHandler } from "void/handler";
import { generateSitemapXml } from "@server/lib/sitemap";

export const GET = defineHandler(async (c) => {
  const xml = await generateSitemapXml(c.env.BLOG_BUCKET, c.env.KV_NAMESPACE);
  return c.body(xml, 200, {
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "public, max-age=3600, s-maxage=3600",
  });
});
