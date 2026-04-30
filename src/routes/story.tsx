import { BlogContent } from "@my-profile/ui";
import { createFileRoute } from "@tanstack/react-router";
import BlurFade from "@/components/magicui/blur-fade";
import { TravelGlobe } from "@/components/shared/travel-globe";
import { MAPBOX_TOKEN, TRAVEL_LOCATIONS } from "@/data/travel";
import { STORY_MARKDOWN } from "@/data/story";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

const GLOBE_SPLIT_MARKER = "### 性格与爱好";

const splitIndex = STORY_MARKDOWN.indexOf(GLOBE_SPLIT_MARKER);
const beforeMarkdown = splitIndex !== -1 ? STORY_MARKDOWN.slice(0, splitIndex) : STORY_MARKDOWN;
const afterMarkdown = splitIndex !== -1 ? STORY_MARKDOWN.slice(splitIndex) : "";

export const Route = createFileRoute("/story")({
  component: StoryPage,
});

const BLUR_FADE_DELAY = 0.04;

function StoryPage() {
  return (
    <main className="flex flex-col min-h-dvh">
      <section id="story">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="max-w-2xl mx-auto">
            <BlogContent className="article">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {beforeMarkdown}
              </ReactMarkdown>
            </BlogContent>
            <TravelGlobe locations={TRAVEL_LOCATIONS} mapboxToken={MAPBOX_TOKEN} />
            {afterMarkdown && (
              <BlogContent className="article">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {afterMarkdown}
                </ReactMarkdown>
              </BlogContent>
            )}
          </div>
        </BlurFade>
      </section>
    </main>
  );
}
