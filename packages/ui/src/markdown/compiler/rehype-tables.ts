import type { Element, Root } from "hast";
import type { Plugin } from "unified";
import { SKIP, visit } from "unist-util-visit";

function createTableWrapper(table: Element): Element {
	return {
		type: "element",
		tagName: "div",
		properties: {
			className: ["overflow-x-auto", "scrollbar-hide"],
		},
		children: [table],
	};
}

export const rehypeTables: Plugin<[], Root> = () => (tree) => {
	visit(tree, "element", (node, index, parent) => {
		if (!parent || index === undefined || node.tagName !== "table") {
			return;
		}

		parent.children[index] = createTableWrapper(node);
		return SKIP;
	});
};
