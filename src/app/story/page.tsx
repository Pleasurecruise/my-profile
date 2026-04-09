import { readFileSync } from "node:fs";
import { join } from "node:path";
import { BlogContent, compile } from "@my-profile/ui";
import BlurFade from "@/components/magicui/blur-fade";
import { TravelGlobe } from "@/components/travel-globe";
import { TRAVEL_LOCATIONS } from "@/data/travel";

export const metadata = {
	title: "Story",
	description: "了解我这个人",
};

const BLUR_FADE_DELAY = 0.04;
const GLOBE_SPLIT_MARKER = "### 性格与爱好";

export default async function StoryPage() {
	const filePath = join(process.cwd(), "content/story.md");
	const markdown = readFileSync(filePath, "utf-8");

	const globeIndex = markdown.indexOf(GLOBE_SPLIT_MARKER);
	const [before, after] =
		globeIndex !== -1
			? [markdown.slice(0, globeIndex), markdown.slice(globeIndex)]
			: [markdown, ""];

	const [beforeResult, afterResult] = await Promise.all([
		compile(before),
		after ? compile(after) : Promise.resolve(null),
	]);

	return (
		<main className="flex flex-col min-h-[100dvh]">
			<section id="story">
				<BlurFade delay={BLUR_FADE_DELAY}>
					<div className="max-w-2xl mx-auto">
						<BlogContent className="article">
							{beforeResult.content}
						</BlogContent>
						<TravelGlobe locations={TRAVEL_LOCATIONS} />
						{afterResult ? (
							<BlogContent className="article">
								{afterResult.content}
							</BlogContent>
						) : null}
					</div>
				</BlurFade>
			</section>
		</main>
	);
}
