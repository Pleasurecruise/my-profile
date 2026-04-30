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
import type { BlogPostData } from "@shared/blog";

const SITE_URL = "https://you-find.me";

export const Route = createFileRoute("/blog/$")({
  loader: async ({ params }): Promise<BlogPostData> => {
    const slug = params["_splat"] ?? "";
    const encodedSlug = slug
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    const res = await fetch(`/api/blog/post/${encodedSlug}`);
    if (!res.ok) throw notFound();
    return res.json() as Promise<BlogPostData>;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { title, excerpt, slug } = loaderData;
    const encodedSlug = slug
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    const pageUrl = `${SITE_URL}/blog/${encodedSlug}`;
    const ogImage = `${SITE_URL}/api/og/blog/${encodedSlug}`;
    return {
      meta: [
        { title: `${title} · Pleasure1234` },
        ...(excerpt ? [{ name: "description", content: excerpt }] : []),
        { property: "og:type", content: "article" },
        { property: "og:url", content: pageUrl },
        { property: "og:title", content: title },
        ...(excerpt ? [{ property: "og:description", content: excerpt }] : []),
        { property: "og:image", content: ogImage },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        ...(excerpt ? [{ name: "twitter:description", content: excerpt }] : []),
        { name: "twitter:image", content: ogImage },
      ],
    };
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
  const encodedSlug = post.slug
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  const postUrl = `${window.location.origin}/blog/${encodedSlug}`;
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
