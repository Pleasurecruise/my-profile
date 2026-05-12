import { compile as compileMdx } from "@mdx-js/mdx";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import type { Root as MdastRoot, Text } from "mdast";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import type { Plugin } from "unified";
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

const remarkExcerpt: Plugin<[{ segments: string[] }], MdastRoot> = (options) => (tree) => {
  visit(tree, (node) => {
    if (node.type === "yaml" || node.type === "code" || node.type === "html") return;
    if (node.type === "text") options.segments.push((node as Text).value);
  });
};

export async function compileForClient(source: string): Promise<CompileRawResult> {
  const toc: TocEntry[] = [];
  const excerptSegments: string[] = [];

  const highlighter = await getHighlighter();

  const compiled = await compileMdx(source, {
    format: "md",
    outputFormat: "function-body",
    remarkPlugins: [remarkGfm, [remarkExcerpt, { segments: excerptSegments }]],
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

  const excerpt = excerptSegments.join(" ").replace(/\s+/g, " ").trim();

  return { code: String(compiled), toc, excerpt };
}
