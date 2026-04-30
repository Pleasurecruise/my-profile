import type { TocEntry } from "@my-profile/ui/markdown";

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
  toc: TocEntry[];
};
