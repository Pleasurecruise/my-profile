"use client";

import { useNavigate } from "@tanstack/react-router";
import type { HTMLAttributes } from "react";
import { BorderBeam } from "@/components/magicui/border-beam";
import { File, Folder, Tree } from "@/components/ui/file-tree";
import { cn } from "@/lib/utils";
import type { BlogTreeNode } from "@/types";

type BlogFileTreeProps = {
  rootName: string;
  nodes: BlogTreeNode[];
} & HTMLAttributes<HTMLDivElement>;

function TreeNode({ node }: { node: BlogTreeNode }) {
  const navigate = useNavigate();

  if (node.type === "folder") {
    return (
      <Folder value={node.id} element={node.name}>
        {node.children?.map((child: BlogTreeNode) => (
          <TreeNode key={child.id} node={child} />
        ))}
      </Folder>
    );
  }

  const handleClick = () => {
    void navigate({ to: `/blog/${encodeURIComponent(node.path)}` });
  };

  return (
    <File value={node.id} onClick={handleClick}>
      {node.name}
    </File>
  );
}

export default function BlogFileTree({ rootName, nodes, className, ...props }: BlogFileTreeProps) {
  const rootId = `root-${rootName || "blog"}`;

  if (nodes.length === 0) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)} {...props}>
        暂无可展示的文件。
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden rounded-xl border border-border/80 p-3", className)}
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
      <BorderBeam duration={4} size={80} />
    </div>
  );
}
