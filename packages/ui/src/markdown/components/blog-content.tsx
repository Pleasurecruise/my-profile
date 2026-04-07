"use client";

import { useEffect, useRef } from "react";

interface BlogContentProps {
	content: string;
	className?: string;
}

export function BlogContent({ content, className }: BlogContentProps) {
	const ref = useRef<HTMLElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		// Wrap tables in scrollable container
		for (const table of el.querySelectorAll<HTMLTableElement>("table")) {
			if (table.parentElement?.classList.contains("table-wrapper")) continue;
			const wrapper = document.createElement("div");
			wrapper.className = "overflow-x-auto scrollbar-hide";
			table.parentNode?.insertBefore(wrapper, table);
			wrapper.appendChild(table);
		}
	}, [content]);

	return (
		<article
			ref={ref}
			className={className}
			dangerouslySetInnerHTML={{ __html: content }}
		/>
	);
}
