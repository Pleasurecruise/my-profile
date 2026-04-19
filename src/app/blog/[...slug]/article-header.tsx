import { Clock, Eye, Type } from "lucide-react";

const CJK_READING_SPEED = 350;
const LATIN_READING_SPEED = 200;

function analyzeContent(source: string): { cjk: number; latin: number } {
	const text = source.trim();
	if (!text) return { cjk: 0, latin: 0 };

	const cjk = Array.from(
		text.matchAll(
			/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu,
		),
	).length;
	const latin =
		text
			.replaceAll(
				/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu,
				" ",
			)
			.match(/[A-Za-z0-9]+(?:[''-][A-Za-z0-9]+)*/g)?.length ?? 0;

	return { cjk, latin };
}

function formatCount(count: number): string {
	if (count < 1000) return String(count);
	const compact = count / 1000;
	if (Number.isInteger(compact)) return `${compact}K`;
	if (count < 10000) return `${compact.toFixed(2).replace(/\.?0+$/, "")}K`;
	return `${compact.toFixed(1).replace(/\.0$/, "")}K`;
}

function formatReadingTime(cjk: number, latin: number): string {
	const minutes = Math.ceil(
		cjk / CJK_READING_SPEED + latin / LATIN_READING_SPEED,
	);
	return `${minutes} min`;
}

const DOT = <span className="opacity-30">·</span>;

export function ArticleHeader({
	title,
	text,
	readers,
}: {
	title: string;
	text?: string;
	readers?: number;
}) {
	const stats = text ? analyzeContent(text) : null;
	const total = stats ? stats.cjk + stats.latin : 0;
	const contentCount = total > 0 ? formatCount(total) : undefined;
	const readingTime =
		stats && total > 0 ? formatReadingTime(stats.cjk, stats.latin) : undefined;

	return (
		<header className="flex-1 min-w-0">
			<h1 className="title font-medium text-2xl tracking-tighter">{title}</h1>
			<div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[0.8125rem] leading-none text-muted-foreground">
				{contentCount && (
					<>
						<span className="inline-flex items-center gap-1">
							<Type className="size-[0.8rem]" strokeWidth={1.8} />
							<span>{contentCount}</span>
						</span>
						{DOT}
					</>
				)}
				{readingTime && (
					<span className="inline-flex items-center gap-1">
						<Clock className="size-[0.8rem]" strokeWidth={1.8} />
						<span>{readingTime}</span>
					</span>
				)}
				{readers != null && readers > 0 && (
					<>
						{DOT}
						<span className="inline-flex items-center gap-1">
							<Eye className="size-[0.8rem]" strokeWidth={1.8} />
							<span>{readers}</span>
						</span>
					</>
				)}
			</div>
		</header>
	);
}
