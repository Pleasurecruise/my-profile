import { Hono } from "hono";
import { generateFeedXml } from "../lib/feed";
import { readFeedXmlKv, writeFeedXmlKv } from "../lib/blog-kv";

export const feed = new Hono<{ Bindings: Cloudflare.Env }>().get("/", async (c) => {
  const cached = await readFeedXmlKv(c.env.KV_NAMESPACE);
  if (cached) {
    return c.body(cached, 200, { "Content-Type": "application/atom+xml; charset=utf-8" });
  }

  const xml = await generateFeedXml(c.env.BLOG_BUCKET, c.env.KV_NAMESPACE);
  await writeFeedXmlKv(c.env.KV_NAMESPACE, xml);

  return c.body(xml, 200, { "Content-Type": "application/atom+xml; charset=utf-8" });
});
