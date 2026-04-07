"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

interface ArticleActionsProps {
	title: string;
	url: string;
}

export function ArticleActions({ title, url }: ArticleActionsProps) {
	const [copied, setCopied] = useState(false);

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(url);
		} catch {
			const el = document.createElement("textarea");
			el.value = url;
			el.style.cssText = "position:fixed;opacity:0";
			document.body.appendChild(el);
			el.select();
			document.execCommand("copy");
			document.body.removeChild(el);
		}
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
	const claudeUrl = `https://claude.ai/new?q=${encodeURIComponent(`阅读并继续讨论这篇文章：${url}`)}`;

	return (
		<div className="flex items-center gap-1 shrink-0 mt-0.5">
			<button
				type="button"
				onClick={handleCopyLink}
				className={`p-1.5 rounded-md transition-colors duration-150 cursor-pointer ${copied ? "text-green-500" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
			>
				{copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
			</button>
			<a
				href={claudeUrl}
				target="_blank"
				rel="noopener noreferrer"
				className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
			>
				<img
					src="https://cdn.simpleicons.org/claude"
					alt="Claude"
					className="size-3.5 brightness-0 dark:invert"
				/>
			</a>
			<a
				href={twitterUrl}
				target="_blank"
				rel="noopener noreferrer"
				className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
			>
				<img
					src="https://cdn.simpleicons.org/x"
					alt="X (Twitter)"
					className="size-3.5 dark:invert"
				/>
			</a>
		</div>
	);
}
