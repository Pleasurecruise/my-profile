import { getAllBlogSlugs } from "./blog";
import { escapeXml, SITE_URL } from "./site";

const SITEMAP_KV_KEY = "sitemap-xml";
const SITEMAP_KV_TTL = 3600;

const STATIC_ROUTES = [
  "",
  "/blog",
  "/cv",
  "/story",
  "/gallery",
  "/chat",
  "/feed.xml",
  "/llms.txt",
  "/llms-full.txt",
] as const;

function buildUrlEntry(pathname: string, lastModified: string): string {
  const normalizedPath = pathname || "/";
  return `  <url>
    <loc>${escapeXml(`${SITE_URL}${normalizedPath}`)}</loc>
    <lastmod>${escapeXml(lastModified)}</lastmod>
  </url>`;
}

export async function generateSitemapXml(
  bucket: Cloudflare.Env["BLOG_BUCKET"],
  kv?: KVNamespace,
): Promise<string> {
  if (kv) {
    const cached = await kv.get(SITEMAP_KV_KEY);
    if (cached) return cached;
  }
  const now = new Date().toISOString();
  const blogSlugs = await getAllBlogSlugs(bucket);

  const xml = buildXml(now, blogSlugs);
  if (kv) await kv.put(SITEMAP_KV_KEY, xml, { expirationTtl: SITEMAP_KV_TTL });
  return xml;
}

export async function invalidateSitemapKv(kv: KVNamespace): Promise<void> {
  await kv.delete(SITEMAP_KV_KEY);
}

function buildXml(now: string, blogSlugs: string[]): string {
  const entries = [
    ...STATIC_ROUTES.map((pathname) => buildUrlEntry(pathname, now)),
    ...blogSlugs.map((slug) => {
      const encodedSlug = slug
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");
      return buildUrlEntry(`/blog/${encodedSlug}`, now);
    }),
  ].join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}
