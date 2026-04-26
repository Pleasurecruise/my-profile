import { createFileRoute } from "@tanstack/react-router";
import BlogFileTree from "@/components/blog/file-tree";
import BlurFade from "@/components/magicui/blur-fade";
import type { BlogFileTreeData } from "@/types";

export const Route = createFileRoute("/blog/")({
  loader: async (): Promise<BlogFileTreeData> => {
    const res = await fetch("/api/blog/tree");
    if (!res.ok) throw new Error("Failed to load blog tree");
    return res.json() as Promise<BlogFileTreeData>;
  },
  component: BlogPage,
});

const BLUR_FADE_DELAY = 0.04;

function BlogPage() {
  const fileTree = Route.useLoaderData();

  return (
    <section>
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="font-medium text-2xl tracking-tighter">Blog</h1>
        <p className="text-muted-foreground text-sm mt-1 mb-8">
          My thoughts on software development, life, and more.
          <br />
          Sync from my local Obsidian.
        </p>
      </BlurFade>
      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <BlogFileTree rootName={fileTree.rootName} nodes={fileTree.nodes} />
      </BlurFade>
    </section>
  );
}
