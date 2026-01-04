import BlogFileTree from "@/components/blog-file-tree";
import BlurFade from "@/components/magicui/blur-fade";
import { getBlogFileTree } from "@/server/blog";

export const metadata = {
  title: "Blog",
  description: "My thoughts on software development, life, and more.",
};

export const revalidate = 604800;

const BLUR_FADE_DELAY = 0.04;

export default async function BlogPage() {
  const fileTree = await getBlogFileTree();

  return (
    <section>
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="font-medium text-2xl mb-8 tracking-tighter">Blog</h1>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <BlogFileTree rootName={fileTree.rootName} nodes={fileTree.nodes} />
      </BlurFade>
    </section>
  );
}
