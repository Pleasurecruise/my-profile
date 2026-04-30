import type { BlogPostMeta } from "@shared/blog";
import { getAllBlogSlugs } from "./blog";
import { readBlogPostKv } from "./blog-kv";

const BLOG_PREFIX = "blog";
const SITE_URL = "https://you-find.me";
const SITE_TITLE = "Pleasure1234's Blog";
const FEED_LIMIT = 20;

function escapeXml(str: string): string {
  return (str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function extractExcerpt(markdown: string): string {
  const lines = markdown.split("\n");
  const text: string[] = [];
  let inCode = false;

  for (const line of lines) {
    if (line.startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    if (/^#{1,6}\s/.test(line)) continue;
    const trimmed = line.trim();
    if (!trimmed || /^[!<>|-]/.test(trimmed)) continue;
    const cleaned = trimmed
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_`~]/g, "")
      .trim();
    if (cleaned) text.push(cleaned);
    if (text.length >= 5) break;
  }

  return text.join(" ").replace(/\s+/g, " ").trim().slice(0, 500);
}

async function fetchPostMeta(
  bucket: Cloudflare.Env["BLOG_BUCKET"],
  kv: KVNamespace,
  slug: string,
): Promise<BlogPostMeta | null> {
  const cached = await readBlogPostKv(kv, slug);
  if (cached) return { slug: cached.slug, title: cached.title, excerpt: cached.excerpt };

  const decodedSlug = decodeURIComponent(slug);
  const obj = await bucket.get(`${BLOG_PREFIX}/${decodedSlug}`);
  if (!obj) return null;

  const markdown = await obj.text();
  const fileName = decodedSlug.split("/").pop() ?? decodedSlug;
  const h1Match = markdown.match(/^#\s+(.+)$/m);
  const title = h1Match?.[1]?.trim() ?? fileName.replace(/\.md$/, "");

  return { slug: decodedSlug, title, excerpt: extractExcerpt(markdown) };
}

export function buildFeedXml(posts: BlogPostMeta[]): string {
  const updated = new Date().toISOString();

  const entries = posts
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

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${escapeXml(SITE_URL)}</id>
  <title>${escapeXml(SITE_TITLE)}</title>
  <updated>${escapeXml(updated)}</updated>
  <link href="${escapeXml(SITE_URL)}" rel="alternate"/>
  <link href="${escapeXml(`${SITE_URL}/feed.xml`)}" rel="self"/>
${entries}
</feed>`;
}

export async function generateFeedXml(
  bucket: Cloudflare.Env["BLOG_BUCKET"],
  kv: KVNamespace,
): Promise<string> {
  const slugs = await getAllBlogSlugs(bucket);
  const posts = (
    await Promise.all(slugs.slice(0, FEED_LIMIT).map((slug) => fetchPostMeta(bucket, kv, slug)))
  ).filter((p) => p !== null);

  return buildFeedXml(posts);
}
