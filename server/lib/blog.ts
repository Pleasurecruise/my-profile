import { compileForClient } from "@my-profile/ui/markdown";
import type { BlogFileTreeData, BlogPostData, BlogTreeNode } from "@shared/blog";
import {
  writeBlogPostKv,
  readBlogPostKv,
  writeBlogTreeKv,
  readBlogTreeKv,
  deleteFeedXmlKv,
} from "./blog-kv";

export type { BlogFileTreeData, BlogPostData, BlogTreeNode };

const BLOG_PREFIX = "blog";

function normalizeRelativePath(p: string) {
  return p.replace(/\\/g, "/").replace(/^\/+/, "").replace(/\/+$/, "");
}

function sortTreeNodes(nodes: BlogTreeNode[]): BlogTreeNode[] {
  return nodes
    .map((n) => ({
      ...n,
      children: n.children ? sortTreeNodes(n.children) : undefined,
    }))
    .sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === "folder" ? -1 : 1;
    });
}

function buildTreeNodes(paths: string[]): BlogTreeNode[] {
  const rootNodes: BlogTreeNode[] = [];
  const folderMap = new Map<string, BlogTreeNode>();
  const seenFiles = new Set<string>();

  for (const rawPath of paths) {
    const normalized = normalizeRelativePath(rawPath);
    if (!normalized) continue;
    const segments = normalized.split("/").filter(Boolean);
    if (!segments.length) continue;
    const fileName = segments.pop();
    if (!fileName) continue;

    let currentPath = "";
    let currentChildren = rootNodes;

    for (const segment of segments) {
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      let folder = folderMap.get(currentPath);
      if (!folder) {
        folder = {
          id: `folder-${currentPath}`,
          name: segment,
          path: currentPath,
          type: "folder",
          children: [],
        };
        folderMap.set(currentPath, folder);
        currentChildren.push(folder);
      }
      folder.children ??= [];
      currentChildren = folder.children;
    }

    const filePath = currentPath ? `${currentPath}/${fileName}` : fileName;
    if (seenFiles.has(filePath)) continue;
    seenFiles.add(filePath);
    currentChildren.push({
      id: `file-${filePath}`,
      name: fileName,
      path: filePath,
      type: "file",
    });
  }

  return sortTreeNodes(rootNodes);
}

async function listBlogFilePaths(bucket: Cloudflare.Env["BLOG_BUCKET"]): Promise<string[]> {
  const prefix = `${BLOG_PREFIX}/`;
  const filePaths = [];
  let cursor: string | undefined;

  do {
    const result = await bucket.list({ prefix, limit: 1000, cursor });
    for (const obj of result.objects) {
      let rel = obj.key;
      if (rel.startsWith(prefix)) rel = rel.slice(prefix.length);
      if (!rel || rel.endsWith("/")) continue;
      filePaths.push(rel);
    }
    cursor = result.truncated ? result.cursor : undefined;
  } while (cursor);

  return filePaths;
}

async function fetchPostFromR2(
  bucket: Cloudflare.Env["BLOG_BUCKET"],
  slug: string,
): Promise<BlogPostData | null> {
  const decodedSlug = decodeURIComponent(slug);
  const obj = await bucket.get(`${BLOG_PREFIX}/${decodedSlug}`);
  if (!obj) return null;

  const markdown = await obj.text();
  const { code, excerpt, toc } = await compileForClient(markdown);
  const fileName = decodedSlug.split("/").pop() ?? decodedSlug;
  const h1Match = markdown.match(/^#\s+(.+)$/m);
  const title = h1Match?.[1]?.trim() ?? fileName.replace(/\.md$/, "");

  return { slug: decodedSlug, title, code, excerpt, toc };
}

async function fetchFileTreeFromR2(
  bucket: Cloudflare.Env["BLOG_BUCKET"],
): Promise<BlogFileTreeData> {
  const paths = await listBlogFilePaths(bucket);
  return { rootName: BLOG_PREFIX, nodes: buildTreeNodes(paths) };
}

export async function getAllBlogSlugs(bucket: Cloudflare.Env["BLOG_BUCKET"]): Promise<string[]> {
  const paths = await listBlogFilePaths(bucket);
  return paths.filter((p) => p.endsWith(".md"));
}

export async function getBlogPost(
  bucket: Cloudflare.Env["BLOG_BUCKET"],
  kv: KVNamespace,
  slug: string,
): Promise<BlogPostData | null> {
  const cached = await readBlogPostKv(kv, slug);
  if (cached) return cached;

  const post = await fetchPostFromR2(bucket, slug);
  if (!post) return null;

  await writeBlogPostKv(kv, slug, post);
  return post;
}

export async function getBlogFileTree(
  bucket: Cloudflare.Env["BLOG_BUCKET"],
  kv: KVNamespace,
): Promise<BlogFileTreeData> {
  const cached = await readBlogTreeKv(kv);
  if (cached) return cached;

  const tree = await fetchFileTreeFromR2(bucket);
  await writeBlogTreeKv(kv, tree);
  return tree;
}

export async function rebuildBlogPostKv(
  bucket: Cloudflare.Env["BLOG_BUCKET"],
  kv: KVNamespace,
  slug: string,
): Promise<BlogPostData | null> {
  const post = await fetchPostFromR2(bucket, slug);
  if (!post) return null;
  await Promise.all([writeBlogPostKv(kv, slug, post), deleteFeedXmlKv(kv)]);
  return post;
}

export async function rebuildBlogTreeKv(
  bucket: Cloudflare.Env["BLOG_BUCKET"],
  kv: KVNamespace,
): Promise<BlogFileTreeData> {
  const tree = await fetchFileTreeFromR2(bucket);
  await Promise.all([writeBlogTreeKv(kv, tree), deleteFeedXmlKv(kv)]);
  return tree;
}
