import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { rehypePrettyCodeOptions } from "./rehype-pretty-code";

export function createMarkdownProcessor() {
	return unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypePrettyCode, rehypePrettyCodeOptions)
		.use(rehypeStringify, { allowDangerousHtml: true });
}
