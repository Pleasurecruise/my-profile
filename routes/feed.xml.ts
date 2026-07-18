import { defineHandler } from "void/handler";
import { readFeedXmlKv, writeFeedXmlKv } from "@server/lib/blog-kv";
import { generateFeedXml } from "@server/lib/feed";

export const GET = defineHandler(async (c) => {
  const cached = await readFeedXmlKv(c.env.KV_NAMESPACE);
  if (cached) {
    return c.body(cached, 200, { "Content-Type": "application/atom+xml; charset=utf-8" });
  }

  const xml = await generateFeedXml(c.env.BLOG_BUCKET, c.env.KV_NAMESPACE);
  await writeFeedXmlKv(c.env.KV_NAMESPACE, xml);
  return c.body(xml, 200, { "Content-Type": "application/atom+xml; charset=utf-8" });
});
