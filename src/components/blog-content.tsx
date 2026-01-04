"use client";

import { useMemo } from "react";
import parse, { HTMLReactParserOptions, Element, DOMNode, domToReact } from "html-react-parser";
import { Terminal, AnimatedSpan } from "@/components/magicui/terminal";

interface BlogContentProps {
  content: string;
  className?: string;
}

function CodeBlockWrapper({ code }: { code: string }) {
  const lines = code.split("\n");

  return (
      <Terminal sequence={false}>
        {lines.map((line, index) => (
          <AnimatedSpan key={index}>
            {line || "\u00A0"}
          </AnimatedSpan>
        ))}
      </Terminal>
  );
}

function getTextContent(node: DOMNode | Element["children"][number]): string {
  if (node.type === "text") {
    return (node as unknown as { data: string }).data || "";
  }
  if (node.type === "tag" && "children" in node) {
    return (node as Element).children.map((child) => getTextContent(child)).join("");
  }
  return "";
}

export function BlogContent({ content, className }: BlogContentProps) {
  const parsedContent = useMemo(() => {
    const options: HTMLReactParserOptions = {
      replace: (domNode) => {
        if (domNode.type === "tag") {
          const element = domNode as Element;

          if (element.name === "pre") {
            const codeChild = element.children.find(
              (child): child is Element =>
                child.type === "tag" && (child as Element).name === "code"
            );

            if (codeChild) {
              const code = getTextContent(codeChild);
              return <CodeBlockWrapper code={code} />;
            }
          }

          if (element.name === "table") {
            return (
              <div className="overflow-x-auto scrollbar-hide">
                <table>{domToReact(element.children as DOMNode[], options)}</table>
              </div>
            );
          }
        }
        return undefined;
      },
    };

    return parse(content, options);
  }, [content]);

  return (
    <article className={className}>
      {parsedContent}
    </article>
  );
}
