"use client";

import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import type { Plugin } from "unified";
import { rehypeToc } from "./rehype-toc";
import type { TocEntry } from "./rehype-toc";
import { remarkExtractDirectives } from "./remark-directives";
import type { ComponentEntry } from "./remark-directives";

export interface PreviewResult {
	html: string;
	toc: TocEntry[];
	components: ComponentEntry[];
}

/**
 * Browser-safe markdown compiler without Shiki.
 * Code blocks render as plain <pre><code> without syntax highlighting.
 * Suitable for live-preview editors or client-only environments.
 */
export async function compilePreview(source: string): Promise<PreviewResult> {
	const toc: TocEntry[] = [];
	const components: ComponentEntry[] = [];

	const html = await unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkFrontmatter, ["yaml"])
		.use(remarkDirective as Plugin)
		.use(remarkExtractDirectives, { components })
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeToc, { toc })
		.use(rehypeStringify, { allowDangerousHtml: true })
		.process(source);

	return { html: String(html), toc, components };
}
