import { readFileSync } from "node:fs";
import { join } from "node:path";
import { BlogContent, markdownToHtml } from "@my-profile/ui";
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

	const [beforeContent, afterContent] = await Promise.all([
		markdownToHtml(before),
		after ? markdownToHtml(after) : Promise.resolve(""),
	]);

	return (
		<main className="flex flex-col min-h-[100dvh]">
			<section id="story">
				<BlurFade delay={BLUR_FADE_DELAY}>
					<div className="max-w-2xl mx-auto">
						<BlogContent content={beforeContent} className="article" />
						<TravelGlobe locations={TRAVEL_LOCATIONS} />
						{afterContent && (
							<BlogContent content={afterContent} className="article" />
						)}
					</div>
				</BlurFade>
			</section>
		</main>
	);
}
