import { Hono } from "hono";
import { getAllBlogSlugs, getBlogPost } from "../lib/blog";
import { readFeedXmlKv, writeFeedXmlKv } from "../lib/blog-kv";

const SITE_URL = "https://you-find.me";
const SITE_TITLE = "Pleasure1234's Blog";
const FEED_LIMIT = 20;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const feed = new Hono<{ Bindings: Cloudflare.Env }>().get("/", async (c) => {
  const cached = await readFeedXmlKv(c.env.KV_NAMESPACE);
  if (cached) {
    return c.body(cached, 200, { "Content-Type": "application/atom+xml; charset=utf-8" });
  }

  const slugs = await getAllBlogSlugs(c.env.BLOG_BUCKET);
  const posts = (
    await Promise.all(
      slugs
        .slice(0, FEED_LIMIT)
        .map((slug) => getBlogPost(c.env.BLOG_BUCKET, c.env.KV_NAMESPACE, slug)),
    )
  ).filter((p) => p !== null);

  const updated = new Date().toISOString();

  const entriesXml = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`;
      return `  <entry>
    <id>${escapeXml(url)}</id>
    <title>${escapeXml(post.title)}</title>
    <link href="${escapeXml(url)}" rel="alternate"/>
    <updated>${escapeXml(updated)}</updated>
    ${post.excerpt ? `<summary>${escapeXml(post.excerpt)}</summary>` : ""}
  </entry>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${escapeXml(SITE_URL)}</id>
  <title>${escapeXml(SITE_TITLE)}</title>
  <updated>${escapeXml(updated)}</updated>
  <link href="${escapeXml(SITE_URL)}" rel="alternate"/>
  <link href="${escapeXml(`${SITE_URL}/feed.xml`)}" rel="self"/>
${entriesXml}
</feed>`;

  await writeFeedXmlKv(c.env.KV_NAMESPACE, xml);

  return c.body(xml, 200, { "Content-Type": "application/atom+xml; charset=utf-8" });
});
