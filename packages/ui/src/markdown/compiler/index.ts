import { compile as compileMdx, run } from "@mdx-js/mdx";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import type { Root as MdastRoot, Text } from "mdast";
import { createElement, type ReactElement } from "react";
import * as jsxRuntime from "react/jsx-runtime";
import rehypeRaw from "rehype-raw";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import type { Plugin } from "unified";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { parse as parseYaml } from "yaml";
import { rehypeTables } from "./rehype-tables";
import type { TocEntry } from "./rehype-toc";
import { rehypeToc } from "./rehype-toc";
import { getHighlighter } from "./shiki";

export type { TocEntry };

export interface Frontmatter {
	title: string;
	description?: string;
	category?: string;
	tags?: string[];
	created_at?: string;
	updated_at?: string;
	published?: boolean;
}

export interface CompileResult {
	frontmatter: Frontmatter;
	content: ReactElement;
	toc: TocEntry[];
	excerpt: string;
}

const remarkExtractFrontmatter: Plugin<
	[{ store: { raw?: string } }],
	MdastRoot
> = (options) => (tree) => {
	for (const [index, node] of tree.children.entries()) {
		if (node.type === "yaml") {
			options.store.raw = (node as { value: string }).value;
			tree.children.splice(index, 1);
			return;
		}
	}
};

export async function compile(source: string): Promise<CompileResult> {
	const fmStore: { raw?: string } = {};
	const toc: TocEntry[] = [];
	const excerptTree = unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkFrontmatter, ["yaml"])
		.parse(source) as MdastRoot;
	const excerptSegments: string[] = [];

	visit(excerptTree, (node) => {
		if (node.type === "yaml" || node.type === "code" || node.type === "html") {
			return;
		}

		if (node.type === "text") {
			excerptSegments.push((node as Text).value);
		}
	});

	const excerpt = excerptSegments.join(" ").replace(/\s+/g, " ").trim();
	const highlighter = await getHighlighter();

	const compiled = await compileMdx(source, {
		format: "md",
		outputFormat: "function-body",
		remarkPlugins: [
			remarkGfm,
			[remarkFrontmatter, ["yaml"]],
			[remarkExtractFrontmatter, { store: fmStore }],
		],
		remarkRehypeOptions: {
			allowDangerousHtml: true,
		},
		rehypePlugins: [
			rehypeRaw,
			() =>
				rehypeShikiFromHighlighter(highlighter, {
					themes: { light: "github-light", dark: "github-dark" },
					lazy: true,
					defaultLanguage: "text",
					fallbackLanguage: "text",
					transformers: [
						{
							pre(node) {
								const lang = this.options.lang ?? "";
								if (lang && lang !== "text") {
									node.properties["data-language"] = lang;
								}
							},
						},
					],
				}),
			[rehypeToc, { toc }],
			rehypeTables,
		],
	});

	const executed = await run(String(compiled), {
		...jsxRuntime,
	});

	const frontmatter: Frontmatter = fmStore.raw
		? (parseYaml(fmStore.raw) as Frontmatter)
		: { title: "" };
	const Content = executed.default;

	return {
		frontmatter,
		content: createElement(Content),
		toc,
		excerpt,
	};
}
