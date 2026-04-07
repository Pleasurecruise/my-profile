"use client";

import { useState } from "react";

export function CopyButton({ code }: { code: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(code);
		} catch {
			const el = document.createElement("textarea");
			el.value = code;
			el.style.position = "fixed";
			el.style.opacity = "0";
			document.body.appendChild(el);
			el.select();
			document.execCommand("copy");
			document.body.removeChild(el);
		}
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<button
			type="button"
			onClick={handleCopy}
			aria-label={copied ? "已复制" : "复制代码"}
			className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-[11px] px-2 py-0.5 rounded border border-zinc-300 dark:border-zinc-600 bg-white/80 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-500 cursor-pointer select-none"
		>
			{copied ? "已复制" : "复制"}
		</button>
	);
}
