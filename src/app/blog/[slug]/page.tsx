import { getAllBlogSlugs, getBlogPost } from "@/server/blog";
import { DATA } from "@/data/resume";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import BlurFade from "@/components/magicui/blur-fade";

const BLUR_FADE_DELAY = 0.04;

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug: encodeURIComponent(slug) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  if (!slug) {
    notFound();
  }

  const post = await getBlogPost(slug);
  if (!post) {
    return undefined;
  }

  return {
    title: post.title,
    openGraph: {
      title: post.title,
      type: "article",
      url: `${DATA.url}/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
    },
  };
}

export default async function Blog({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) {
    notFound();
  }

  const post = await getBlogPost(slug);
  if (!post) {
    notFound();
  }

  return (
    <section id="blog">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            url: `${DATA.url}/blog/${post.slug}`,
            author: {
              "@type": "Person",
              name: DATA.name,
            },
          }),
        }}
      />
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="flex items-center gap-2 max-w-[650px]">
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="size-5" />
          </Link>
          <h1 className="title font-medium text-2xl tracking-tighter">
            {post.title}
          </h1>
        </div>
      </BlurFade>
      <BlurFade delay={BLUR_FADE_DELAY}>
        <article
          className="prose dark:prose-invert mt-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </BlurFade>
    </section>
  );
}
