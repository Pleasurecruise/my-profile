import { BlogContent } from "@my-profile/ui";
import { createFileRoute } from "@tanstack/react-router";
import BlurFade from "@/components/magicui/blur-fade";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { TravelGlobe } from "@/components/shared/travel-globe";
import { MAPBOX_TOKEN, TRAVEL_LOCATIONS } from "@/data/travel";
import { useLocale } from "@/lib/i18n";
import * as storyContent from "@/data/i18n/story";
import type { Locale } from "@/lib/i18n";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

const GLOBE_SPLIT_MARKERS: Record<Locale, string> = {
  zh: "### 性格与爱好",
  en: "### Personality & Hobbies",
  ja: "### 性格と趣味",
};

export const Route = createFileRoute("/story")({
  component: StoryPage,
});

const BLUR_FADE_DELAY = 0.04;

function StoryPage() {
  const { locale } = useLocale();
  const markdown = storyContent[locale]!;
  const splitMarker = GLOBE_SPLIT_MARKERS[locale] ?? GLOBE_SPLIT_MARKERS.en;

  // Extract the first `## heading` from markdown to render as TypingAnimation
  const headingMatch = markdown.match(/^##\s+(.+?)\n/);
  const headingText = headingMatch ? headingMatch[1] : "";
  const markdownWithoutHeading = headingMatch
    ? markdown.slice(headingMatch[0].length).replace(/^\n+/, "")
    : markdown;

  const splitIndex = markdownWithoutHeading.indexOf(splitMarker);
  const beforeMarkdown =
    splitIndex !== -1 ? markdownWithoutHeading.slice(0, splitIndex) : markdownWithoutHeading;
  const afterMarkdown = splitIndex !== -1 ? markdownWithoutHeading.slice(splitIndex) : "";

  return (
    <main className="flex flex-col min-h-dvh">
      <section id="story">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="max-w-2xl mx-auto">
            <TypingAnimation
              delay={BLUR_FADE_DELAY * 1000 + 200}
              duration={50}
              className="text-2xl font-bold tracking-tight mb-6"
            >
              {headingText}
            </TypingAnimation>
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
