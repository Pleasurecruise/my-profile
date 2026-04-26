import { BlogContent } from "@my-profile/ui";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { run } from "@mdx-js/mdx";
import * as jsxRuntime from "react/jsx-runtime";
import { use, useMemo } from "react";
import BlurFade from "@/components/magicui/blur-fade";
import { ArticleActions } from "@/components/blog/article-actions";
import { ArticleHeader } from "@/components/blog/article-header";
import { ArticleSide } from "@/components/blog/article-side";
import { Toc } from "@/components/blog/toc";
import type { BlogPostData } from "@/types";
import { DATA } from "@/data/resume";

export const Route = createFileRoute("/blog/$")({
  loader: async ({ params }): Promise<BlogPostData> => {
    const slug = params["_splat"] ?? "";
    const res = await fetch(`/api/blog/post/${encodeURIComponent(slug)}`);
    if (!res.ok) throw notFound();
    return res.json() as Promise<BlogPostData>;
  },
  component: BlogPostPage,
  notFoundComponent: () => <div className="text-muted-foreground text-sm">Post not found.</div>,
});

const BLUR_FADE_DELAY = 0.04;

function useMdxContent(code: string) {
  const contentPromise = useMemo(
    () => run(code, { ...jsxRuntime }).then(({ default: C }) => C),
    [code],
  );
  return use(contentPromise);
}

function BlogPostPage() {
  const post = Route.useLoaderData();
  const postUrl = `${DATA.url}/blog/${post.slug}`;
  const Content = useMdxContent(post.code);

  return (
    <section id="blog">
      <Toc entries={post.toc} />
      <ArticleSide url={postUrl} />
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="flex items-start gap-2 max-w-[650px]">
          <Link
            to="/blog"
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-1"
          >
            <ChevronLeft className="size-5" />
          </Link>
          <ArticleHeader title={post.title} text={post.excerpt} />
          <ArticleActions title={post.title} url={postUrl} />
        </div>
      </BlurFade>
      <BlurFade delay={BLUR_FADE_DELAY}>
        <BlogContent className="article mt-8">
          <Content />
        </BlogContent>
      </BlurFade>
    </section>
  );
}
