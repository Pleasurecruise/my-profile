"use client";

// Derived from Taki <https://github.com/canmi21/taki> (AGPL-v3)
import { ArrowUp, Check, Gift, Share2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

function ReadingProgress() {
	const circleRef = useRef<SVGCircleElement>(null);
	const arrowRef = useRef<HTMLSpanElement>(null);
	const radius = 9;
	const circumference = 2 * Math.PI * radius;

	const update = useCallback(() => {
		const el = circleRef.current;
		if (!el) return;

		const scrollable =
			document.documentElement.scrollHeight - window.innerHeight;
		if (scrollable <= 0) {
			el.style.strokeDashoffset = String(circumference);
			const arrow = arrowRef.current;
			if (arrow) {
				arrow.style.setProperty("--arrow-opacity", "0");
				arrow.style.scale = "0.5";
			}
			return;
		}

		const raw = Math.min(1, window.scrollY / scrollable);
		const stepped = Math.round(raw * 100) / 100;
		el.style.strokeDashoffset = String(circumference * (1 - stepped));

		const arrow = arrowRef.current;
		if (arrow) {
			const t = Math.min(1, Math.max(0, (stepped - 0.25) / 0.5));
			arrow.style.setProperty("--arrow-opacity", String(t));
			arrow.style.scale = String(0.5 + t * 0.5);
		}
	}, [circumference]);

	useEffect(() => {
		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => window.removeEventListener("scroll", update);
	}, [update]);

	const scrollToTop = useCallback(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	return (
		<button
			type="button"
			onClick={scrollToTop}
			aria-label="Back to top"
			title="Back to top"
			className="group relative flex cursor-pointer items-center justify-center p-1.5 text-primary opacity-(--opacity-subtle) transition-[color,opacity] duration-140 hover:opacity-100"
		>
			<svg width="24" height="24" viewBox="0 0 24 24" className="-rotate-90">
				<title>Reading progress</title>
				<circle
					cx="12"
					cy="12"
					r={radius}
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					className="text-border"
				/>
				<circle
					ref={circleRef}
					cx="12"
					cy="12"
					r={radius}
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeDasharray={circumference}
					strokeDashoffset={circumference}
					strokeLinecap="round"
					className="text-primary"
				/>
			</svg>
			<span
				ref={arrowRef}
				className="absolute inset-0 flex items-center justify-center text-primary opacity-0 group-hover:opacity-(--arrow-opacity)"
				style={{ "--arrow-opacity": 0, scale: "0.5" } as React.CSSProperties}
			>
				<ArrowUp size={10} strokeWidth={2.25} />
			</span>
		</button>
	);
}

export function ArticleSide({ url }: { url: string }) {
	const [copied, setCopied] = useState(false);

	const handleShare = async () => {
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

	return (
		<aside
			aria-label="Article actions"
			className="hidden xl:fixed xl:top-1/2 xl:right-[max(1.5rem,calc((100vw-45rem)/4-5.5rem))] xl:flex xl:max-h-[calc(100vh-16rem)] xl:w-10 xl:-translate-y-1/2 xl:flex-col xl:items-center xl:gap-1"
		>
			<ReadingProgress />
			<div className="my-1 h-px w-4 bg-border" />
			<button
				type="button"
				onClick={handleShare}
				aria-label={copied ? "Copied" : "Share"}
				title={copied ? "Copied" : "Share"}
				className={`cursor-pointer rounded-full p-1.5 text-primary transition-[color,opacity] duration-140 hover:opacity-100 ${copied ? "text-green-500 opacity-100" : "opacity-(--opacity-subtle)"}`}
			>
				{copied ? (
					<Check size={15} strokeWidth={2.25} />
				) : (
					<Share2 size={15} strokeWidth={2.25} />
				)}
			</button>
			<a
				href="https://github.com/sponsors/Pleasurecruise"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Sponsor"
				title="Sponsor"
				className="cursor-pointer rounded-full p-1.5 text-primary opacity-(--opacity-subtle) transition-[color,opacity] duration-140 hover:opacity-100"
			>
				<Gift size={15} strokeWidth={2.25} />
			</a>
		</aside>
	);
}
