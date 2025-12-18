import { getAliOssClient } from "@/server/ali-oss";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";

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

export type BlogPost = {
  slug: string;
  title: string;
  content: string;
};

function normalizeRelativeTreePath(relativePath: string) {
  return relativePath
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
}

function sortTreeNodes(nodes: BlogTreeNode[]): BlogTreeNode[] {
  return nodes
    .map((node) => ({
      ...node,
      children: node.children ? sortTreeNodes(node.children) : undefined,
    }))
    .sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === "folder" ? -1 : 1;
    });
}

function buildTreeNodes(paths: string[]) {
  const rootNodes: BlogTreeNode[] = [];
  const folderMap = new Map<string, BlogTreeNode>();
  const seenFiles = new Set<string>();

  for (const rawPath of paths) {
    const normalizedPath = normalizeRelativeTreePath(rawPath);
    if (!normalizedPath) {
      continue;
    }
    const segments = normalizedPath.split("/").filter(Boolean);
    if (segments.length === 0) {
      continue;
    }
    const fileName = segments.pop();
    if (!fileName) {
      continue;
    }

    let currentPath = "";
    let currentChildren = rootNodes;

    for (const segment of segments) {
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      let folderNode = folderMap.get(currentPath);
      if (!folderNode) {
        folderNode = {
          id: `folder-${currentPath}`,
          name: segment,
          path: currentPath,
          type: "folder",
          children: [],
        };
        folderMap.set(currentPath, folderNode);
        currentChildren.push(folderNode);
      }
      currentChildren = folderNode.children ?? (folderNode.children = []);
    }

    const filePath = currentPath ? `${currentPath}/${fileName}` : fileName;
    if (seenFiles.has(filePath)) {
      continue;
    }
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

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypePrettyCode, {
      theme: "github-dark",
      keepBackground: true,
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return String(result);
}

function extractTitleFromMarkdown(markdown: string, fileName: string): string {
  const h1Match = markdown.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }
  return fileName.replace(/\.md$/, "");
}

async function listBlogFilePaths() {
  const client = getAliOssClient();
  const prefix = `${process.env.ALI_OSS_BLOG_PREFIX}/`;
  const filePaths: string[] = [];
  let nextMarker: string | undefined;

  do {
    const result = await client.list({
      prefix,
      "max-keys": 1000,
      marker: nextMarker,
    }, {});

    for (const obj of result.objects ?? []) {
      if (!obj.name) {
        continue;
      }
      let relativePath = obj.name;
      if (relativePath.startsWith(prefix)) {
        relativePath = relativePath.slice(prefix.length);
      }
      if (!relativePath || relativePath.endsWith("/")) {
        continue;
      }
      filePaths.push(relativePath);
    }

    nextMarker = result.isTruncated ? result.nextMarker : undefined;
  } while (nextMarker);

  return filePaths;
}

export async function getBlogFileTree(): Promise<BlogFileTreeData> {
  const paths = await listBlogFilePaths();
  return {
    rootName: process.env.ALI_OSS_BLOG_PREFIX!,
    nodes: buildTreeNodes(paths),
  };
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const client = getAliOssClient();
  const prefix = process.env.ALI_OSS_BLOG_PREFIX!;
  const decodedSlug = decodeURIComponent(slug);
  const objectKey = `${prefix}/${decodedSlug}`;

  try {
    const result = await client.get(objectKey);
    const markdown =
      result.content instanceof Buffer
        ? result.content.toString("utf-8")
        : String(result.content);

    const fileName = decodedSlug.split("/").pop() || decodedSlug;
    const title = extractTitleFromMarkdown(markdown, fileName);
    const content = await markdownToHtml(markdown);

    return {
      slug,
      title,
      content,
    };
  } catch (error) {
    console.error(`Failed to fetch blog post: ${objectKey}`, error);
    return null;
  }
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const paths = await listBlogFilePaths();
  return paths.filter((path) => path.endsWith(".md"));
}
