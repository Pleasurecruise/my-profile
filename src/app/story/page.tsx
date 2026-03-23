import { readFileSync } from "node:fs";
import { join } from "node:path";
import BlurFade from "@/components/magicui/blur-fade";
import { BlogContent } from "@/components/blog-content";
import { markdownToHtml } from "@/server/blog";
import { StoryMap } from "./_components/map";

export const metadata = {
    title: "Story",
    description: "了解我这个人",
};

const BLUR_FADE_DELAY = 0.04;
const MAP_SPLIT_MARKER = "### 选择这个方向的原因";

export default async function StoryPage() {
    const filePath = join(process.cwd(), "content/story.md");
    const markdown = readFileSync(filePath, "utf-8");

    const splitIndex = markdown.indexOf(MAP_SPLIT_MARKER);
    const [before, after] =
        splitIndex !== -1
            ? [markdown.slice(0, splitIndex), markdown.slice(splitIndex)]
            : [markdown, ""];

    const beforeContent = await markdownToHtml(before);
    const afterContent = after ? await markdownToHtml(after) : "";

    return (
        <main className="flex flex-col min-h-[100dvh]">
            <section id="story">
                <BlurFade delay={BLUR_FADE_DELAY}>
                    <div className="prose dark:prose-invert max-w-2xl mx-auto">
                        <BlogContent content={beforeContent} />
                        <StoryMap />
                        {afterContent && <BlogContent content={afterContent} />}
                    </div>
                </BlurFade>
            </section>
        </main>
    );
}