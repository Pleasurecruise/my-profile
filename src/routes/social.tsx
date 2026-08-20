import { createFileRoute } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import BlurFade from "@/components/magicui/blur-fade";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import * as socialContent from "@/data/i18n/social";
import { useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/social")({
  component: SocialPage,
});

const BLUR_FADE_DELAY = 0.04;

function SocialPage() {
  const { locale } = useLocale();
  const markdown = socialContent[locale];
  const headingMatch = markdown.match(/^##\s+(.+?)\n/);
  const headingText = headingMatch?.[1] ?? "";
  const body = headingMatch ? markdown.slice(headingMatch[0].length).replace(/^\n+/, "") : markdown;

  return (
    <main className="flex min-h-dvh flex-col">
      <section id="social">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="mx-auto max-w-2xl">
            <TypingAnimation
              delay={BLUR_FADE_DELAY * 1000 + 200}
              duration={50}
              className="mb-6 text-2xl font-bold tracking-tight"
              text={headingText}
            />
            <article className="article story-article">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
            </article>
          </div>
        </BlurFade>
      </section>
    </main>
  );
}
