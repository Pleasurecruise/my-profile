import { Hono } from "hono";
import { generateSitemapXml } from "../lib/sitemap";

export const sitemap = new Hono<{ Bindings: Cloudflare.Env }>().get("/", async (c) => {
  const xml = await generateSitemapXml(c.env.BLOG_BUCKET, c.env.KV_NAMESPACE);
  return c.body(xml, 200, {
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "public, max-age=3600, s-maxage=3600",
  });
});
