import { getAllBlogSlugs, getBlogPost } from "@/server/blog";
import { DATA } from "@/data/resume";

export const revalidate = 86400; // 24 hours

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export async function GET() {
  const siteUrl = DATA.url;
  const siteName = DATA.name;
  const siteDescription = DATA.description;

  const slugs = await getAllBlogSlugs();

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const post = await getBlogPost(slug);
      return post;
    })
  );

  const validPosts = posts.filter((post) => post !== null);

  const rssItems = validPosts
    .map((post) => {
      const link = `${siteUrl}/blog/${encodeURIComponent(post.slug)}`;
      const description = stripHtml(post.content).slice(0, 200) + "...";

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(description)}</description>
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}'s Blog</title>
    <link>${escapeXml(siteUrl)}/blog</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>zh-CN</language>
    <atom:link href="${escapeXml(siteUrl)}/feed.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
