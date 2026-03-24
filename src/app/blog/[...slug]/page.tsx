import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogContent } from "@/components/blog-content";
import BlurFade from "@/components/magicui/blur-fade";
import { DATA } from "@/data/resume";
import { getAllBlogSlugs, getBlogPost } from "@/server/blog";

export const revalidate = 604800;
export const dynamicParams = true;

const BLUR_FADE_DELAY = 0.04;

export async function generateStaticParams() {
	const slugs = await getAllBlogSlugs();
	return slugs.map((slug) => ({ slug: slug.split("/") }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string[] }>;
}): Promise<Metadata | undefined> {
	const { slug } = await params;
	if (!slug) {
		notFound();
	}

	const slugPath = slug.join("/");
	const post = await getBlogPost(slugPath);
	if (!post) {
		return undefined;
	}

	return {
		title: post.title,
		description: `Read "${post.title}" on ${DATA.name}'s blog`,
		openGraph: {
			title: post.title,
			description: `Read "${post.title}" on ${DATA.name}'s blog`,
			type: "article",
			url: `${DATA.url}/blog/${post.slug}`,
			images: [
				`${DATA.url}/og?title=${encodeURIComponent(post.title)}&tag=Blog`,
			],
		},
		twitter: {
			card: "summary_large_image",
			title: post.title,
			description: `Read "${post.title}" on ${DATA.name}'s blog`,
			creator: "@Pleasure9876",
			images: [
				`${DATA.url}/og?title=${encodeURIComponent(post.title)}&tag=Blog`,
			],
		},
	};
}

export default async function Blog({
	params,
}: {
	params: Promise<{ slug: string[] }>;
}) {
	const { slug } = await params;
	if (!slug) {
		notFound();
	}

	const slugPath = slug.join("/");
	const post = await getBlogPost(slugPath);
	if (!post) {
		notFound();
	}

	return (
		<section id="blog">
			<script type="application/ld+json" suppressHydrationWarning>
				{JSON.stringify({
					"@context": "https://schema.org",
					"@type": "BlogPosting",
					headline: post.title,
					url: `${DATA.url}/blog/${post.slug}`,
					author: {
						"@type": "Person",
						name: DATA.name,
					},
				})}
			</script>
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
				<BlogContent
					content={post.content}
					className="prose dark:prose-invert mt-8"
				/>
			</BlurFade>
		</section>
	);
}
