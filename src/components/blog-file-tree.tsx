"use client";

import type { HTMLAttributes } from "react";
import { useRouter } from "next/navigation";

import type { BlogTreeNode } from "@/server/blog";
import { File, Folder, Tree } from "@/components/ui/file-tree";
import { cn } from "@/lib/utils";

type BlogFileTreeProps = {
  rootName: string;
  nodes: BlogTreeNode[];
} & HTMLAttributes<HTMLDivElement>;

function TreeNode({ node }: { node: BlogTreeNode }) {
  const router = useRouter();

  if (node.type === "folder") {
    return (
      <Folder value={node.id} element={node.name}>
        {node.children?.map((child) => (
          <TreeNode key={child.id} node={child} />
        ))}
      </Folder>
    );
  }

  const handleClick = () => {
    const slug = encodeURIComponent(node.path);
    sessionStorage.setItem("blog:navigate-from-tree", "true");
    router.push(`/blog/${slug}`);
  };

  return (
    <File value={node.id} onClick={handleClick}>
      {node.name}
    </File>
  );
}

export default function BlogFileTree({
  rootName,
  nodes,
  className,
  ...props
}: BlogFileTreeProps) {
  const rootId = `root-${rootName || "blog"}`;

  if (nodes.length === 0) {
    return (
      <div
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      >
        暂无可展示的文件。
      </div>
    );
  }

  return (
    <div
      className={cn("rounded-xl border border-border/80 p-3", className)}
      {...props}
    >
      <div className="[&>div]:!h-auto [&_[data-slot='scroll-area']]:!h-auto [&_[data-slot='scroll-area']]:!overflow-visible [&_[data-slot='scroll-area-viewport']]:!h-auto [&_[data-slot='scroll-area-viewport']]:!overflow-visible [&_[data-slot='scroll-area-scrollbar']]:!hidden">
        <Tree initialExpandedItems={[rootId]}>
          <Folder value={rootId} element={rootName}>
            {nodes.map((node) => (
              <TreeNode key={node.id} node={node} />
            ))}
          </Folder>
        </Tree>
      </div>
    </div>
  );
}
