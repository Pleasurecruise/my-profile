import { compileForClient } from "@my-profile/ui/markdown";
import type { BlogFileTreeData, BlogPostData, BlogTreeNode } from "@shared/blog";

export type { BlogFileTreeData, BlogPostData, BlogTreeNode };

const BLOG_PREFIX = "blog";

function normalizeRelativePath(p: string) {
  return p.replace(/\\/g, "/").replace(/^\/+/, "").replace(/\/+$/, "");
}

function sortTreeNodes(nodes: BlogTreeNode[]): BlogTreeNode[] {
  return nodes
    .map((n) => ({ ...n, children: n.children ? sortTreeNodes(n.children) : undefined }))
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
    currentChildren.push({ id: `file-${filePath}`, name: fileName, path: filePath, type: "file" });
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

export async function getBlogFileTree(
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
  slug: string,
): Promise<BlogPostData | null> {
  const decodedSlug = decodeURIComponent(slug);
  const key = `${BLOG_PREFIX}/${decodedSlug}`;

  const obj = await bucket.get(key);
  if (!obj) return null;

  const markdown = await obj.text();
  const { code, excerpt, frontmatter, toc } = await compileForClient(markdown);

  const fileName = decodedSlug.split("/").pop() ?? decodedSlug;
  const h1Match = markdown.match(/^#\s+(.+)$/m);
  const title =
    (frontmatter.title as string | undefined) ??
    h1Match?.[1]?.trim() ??
    fileName.replace(/\.md$/, "");

  return { slug, title, code, excerpt, toc, frontmatter };
}
