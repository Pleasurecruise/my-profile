import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { parse as parseYaml } from "yaml";
import type { Root as MdastRoot } from "mdast";
import type { Plugin } from "unified";
import { getHighlighter } from "./shiki";
import { rehypeToc } from "./rehype-toc";
import type { TocEntry } from "./rehype-toc";
import { remarkExtractDirectives } from "./remark-directives";
import type { ComponentEntry } from "./remark-directives";

export type { TocEntry, ComponentEntry };

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
	html: string;
	toc: TocEntry[];
	components: ComponentEntry[];
}

// Remark plugin: extract raw YAML frontmatter into a store object
const remarkExtractFrontmatter: Plugin<
	[{ store: { raw?: string } }],
	MdastRoot
> = (options) => (tree) => {
	for (const node of tree.children) {
		if (node.type === "yaml") {
			options.store.raw = (node as { value: string }).value;
			return;
		}
	}
};

export async function compile(source: string): Promise<CompileResult> {
	const fmStore: { raw?: string } = {};
	const toc: TocEntry[] = [];
	const components: ComponentEntry[] = [];
	const highlighter = await getHighlighter();

	const html = await unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkFrontmatter, ["yaml"])
		.use(remarkExtractFrontmatter, { store: fmStore })
		.use(remarkDirective as Plugin)
		.use(remarkExtractDirectives, { components })
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeToc, { toc })
		.use(() =>
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
		)
		.use(rehypeStringify, { allowDangerousHtml: true })
		.process(source);

	const frontmatter: Frontmatter = fmStore.raw
		? (parseYaml(fmStore.raw) as Frontmatter)
		: { title: "" };

	return {
		frontmatter,
		html: String(html),
		toc,
		components,
	};
}

/** Backward-compat wrapper — returns only the HTML string. */
export async function markdownToHtml(markdown: string): Promise<string> {
	const { html } = await compile(markdown);
	return html;
}
