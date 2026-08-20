import { defineHandler } from "void/handler";
import { escapeXml, SITE_URL } from "@server/lib/site";

export const GET = defineHandler((c) => {
  const lastModified = new Date().toISOString();
  const entries = ["/", "/cv", "/story", "/social", "/chat", "/llms.txt", "/llms-full.txt"]
    .map(
      (pathname) => `  <url>
    <loc>${escapeXml(`${SITE_URL}${pathname}`)}</loc>
    <lastmod>${escapeXml(lastModified)}</lastmod>
  </url>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
  return c.body(xml, 200, {
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "public, max-age=3600, s-maxage=3600",
  });
});
