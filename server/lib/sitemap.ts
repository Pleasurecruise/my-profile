import { getAllBlogSlugs } from "./blog";
import { escapeXml, SITE_URL } from "./site";

const STATIC_ROUTES = [
  "",
  "/blog",
  "/cv",
  "/story",
  "/gallery",
  "/chat",
  "/am-i-ok",
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

export async function generateSitemapXml(bucket: Cloudflare.Env["BLOG_BUCKET"]): Promise<string> {
  const now = new Date().toISOString();
  const blogSlugs = await getAllBlogSlugs(bucket);

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
