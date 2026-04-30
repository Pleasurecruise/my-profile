// Derived from Taki <https://github.com/canmi21/taki> (AGPL-v3)

import type { TocEntry } from "@my-profile/ui/markdown";
import type { BlogFileTreeData, BlogPostData } from "@shared/blog";

interface BlogPostKvEntry {
  title: string;
  code: string;
  excerpt: string;
  toc: TocEntry[];
}

export async function writeBlogPostKv(
  kv: KVNamespace,
  slug: string,
  post: BlogPostData,
): Promise<void> {
  const entry: BlogPostKvEntry = {
    title: post.title,
    code: post.code,
    excerpt: post.excerpt,
    toc: post.toc,
  };
  await kv.put(`blog-post:${slug}`, JSON.stringify(entry));
}

export async function readBlogPostKv(kv: KVNamespace, slug: string): Promise<BlogPostData | null> {
  const raw = await kv.get(`blog-post:${slug}`);
  if (!raw) return null;
  const entry = JSON.parse(raw) as BlogPostKvEntry;
  return { slug, title: entry.title, code: entry.code, excerpt: entry.excerpt, toc: entry.toc };
}

export async function deleteBlogPostKv(kv: KVNamespace, slug: string): Promise<void> {
  await kv.delete(`blog-post:${slug}`);
}

export async function writeBlogTreeKv(kv: KVNamespace, tree: BlogFileTreeData): Promise<void> {
  await kv.put("blog-tree", JSON.stringify(tree));
}

export async function readBlogTreeKv(kv: KVNamespace): Promise<BlogFileTreeData | null> {
  const raw = await kv.get("blog-tree");
  if (!raw) return null;
  return JSON.parse(raw) as BlogFileTreeData;
}

export async function deleteBlogTreeKv(kv: KVNamespace): Promise<void> {
  await kv.delete("blog-tree");
}

export async function writeFeedXmlKv(kv: KVNamespace, xml: string): Promise<void> {
  await kv.put("feed-xml", xml);
}

export async function readFeedXmlKv(kv: KVNamespace): Promise<string | null> {
  return kv.get("feed-xml");
}

export async function deleteFeedXmlKv(kv: KVNamespace): Promise<void> {
  await kv.delete("feed-xml");
}
