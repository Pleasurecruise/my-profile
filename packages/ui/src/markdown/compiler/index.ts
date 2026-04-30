import { compile as compileMdx } from "@mdx-js/mdx";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import type { Root as MdastRoot, Text } from "mdast";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { rehypeTables } from "./rehype-tables";
import type { TocEntry } from "./rehype-toc";
import { rehypeToc } from "./rehype-toc";
import { getHighlighter } from "./shiki";

export type { TocEntry };

export interface CompileRawResult {
  code: string;
  toc: TocEntry[];
  excerpt: string;
}

export async function compileForClient(source: string): Promise<CompileRawResult> {
  const toc: TocEntry[] = [];

  const excerptTree = unified().use(remarkParse).use(remarkGfm).parse(source) as MdastRoot;

  const excerptSegments: string[] = [];
  visit(excerptTree, (node) => {
    if (node.type === "yaml" || node.type === "code" || node.type === "html") return;
    if (node.type === "text") excerptSegments.push((node as Text).value);
  });
  const excerpt = excerptSegments.join(" ").replace(/\s+/g, " ").trim();

  const highlighter = await getHighlighter();

  const compiled = await compileMdx(source, {
    format: "md",
    outputFormat: "function-body",
    remarkPlugins: [remarkGfm],
    remarkRehypeOptions: { allowDangerousHtml: true },
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
                if (lang && lang !== "text") node.properties["data-language"] = lang;
              },
            },
          ],
        }),
      [rehypeToc, { toc }],
      rehypeTables,
    ],
  });

  return { code: String(compiled), toc, excerpt };
}
