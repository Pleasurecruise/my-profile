import { compileForClient, type Frontmatter } from "@my-profile/ui/markdown";
import { env } from "./env";
import { getAliOssClient } from "./ali-oss";

export type BlogTreeNode = {
  id: string;
  name: string;
  path: string;
  type: "folder" | "file";
  children?: BlogTreeNode[];
};

export type BlogFileTreeData = {
  rootName: string;
  nodes: BlogTreeNode[];
};

export type BlogPostData = {
  slug: string;
  title: string;
  code: string;
  excerpt: string;
  toc: Array<{ id: string; text: string; depth: number }>;
  frontmatter: Frontmatter;
};

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

async function listBlogFilePaths(): Promise<string[]> {
  const client = getAliOssClient();
  const prefix = `${env.ALI_OSS_BLOG_PREFIX}/`;
  const filePaths: string[] = [];
  let nextMarker: string | undefined;

  do {
    const result = await client.list({ prefix, "max-keys": 1000, marker: nextMarker }, {});
    for (const obj of result.objects ?? []) {
      if (!obj.name) continue;
      let rel = obj.name;
      if (rel.startsWith(prefix)) rel = rel.slice(prefix.length);
      if (!rel || rel.endsWith("/")) continue;
      filePaths.push(rel);
    }
    nextMarker = result.isTruncated ? result.nextMarker : undefined;
  } while (nextMarker);

  return filePaths;
}

export async function getBlogFileTree(): Promise<BlogFileTreeData> {
  const paths = await listBlogFilePaths();
  return { rootName: env.ALI_OSS_BLOG_PREFIX, nodes: buildTreeNodes(paths) };
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const paths = await listBlogFilePaths();
  return paths.filter((p) => p.endsWith(".md"));
}

export async function getBlogPost(slug: string): Promise<BlogPostData | null> {
  const client = getAliOssClient();
  const decodedSlug = decodeURIComponent(slug);
  const objectKey = `${env.ALI_OSS_BLOG_PREFIX}/${decodedSlug}`;

  try {
    const result = await client.get(objectKey);
    const markdown =
      result.content instanceof Buffer ? result.content.toString("utf-8") : String(result.content);

    const { code, excerpt, frontmatter, toc } = await compileForClient(markdown);

    const fileName = decodedSlug.split("/").pop() ?? decodedSlug;
    const h1Match = markdown.match(/^#\s+(.+)$/m);
    const title =
      (frontmatter.title as string | undefined) ??
      h1Match?.[1]?.trim() ??
      fileName.replace(/\.md$/, "");

    return { slug, title, code, excerpt, toc, frontmatter };
  } catch {
    return null;
  }
}
