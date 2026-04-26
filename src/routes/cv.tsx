import { createFileRoute } from "@tanstack/react-router";
import Markdown from "react-markdown";
import BlurFade from "@/components/magicui/blur-fade";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { TranslatesCard } from "@/components/cv/translates-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATA } from "@/data/resume";
import ContactSection from "@/components/cv/contact-section";
import HackathonsSection from "@/components/cv/hackathons-section";
import ProjectsSection from "@/components/cv/projects-section";
import WorkSection from "@/components/cv/work-section";

export const Route = createFileRoute("/cv")({
  component: CvPage,
});

const BLUR_FADE_DELAY = 0.04;

function CvPage() {
  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10">
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          l
          <div className="gap-2 flex justify-between">
            <div className="flex-col flex flex-1 space-y-1.5">
              <BlurFade delay={BLUR_FADE_DELAY}>
                <TypingAnimation
                  delay={BLUR_FADE_DELAY * 1000 + 200}
                  duration={50}
                  className="text-3xl font-bold tracking-tighter sm:text-3xl xl:text-5xl/none"
                >
                  {`Hi, I'm ${DATA.name.split(" ")[0]} 👋`}
                </TypingAnimation>
              </BlurFade>
              <BlurFade delay={BLUR_FADE_DELAY * 2}>
                <TypingAnimation
                  delay={BLUR_FADE_DELAY * 2000 + 400}
                  duration={30}
                  className="max-w-[600px] text-md md:text-xl leading-snug"
                >
                  {DATA.description}
                </TypingAnimation>
              </BlurFade>
            </div>
            <BlurFade delay={BLUR_FADE_DELAY}>
              <Avatar className="size-28 border">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>

      <section id="about">
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <h2 className="text-xl font-bold">About</h2>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <div className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
            <Markdown>{DATA.summary}</Markdown>
          </div>
        </BlurFade>
      </section>

      <BlurFade delay={BLUR_FADE_DELAY * 5}>
        <ul>
          {DATA.translates.map((item) => (
            <TranslatesCard key={item.title} {...item} />
          ))}
        </ul>
      </BlurFade>

      <WorkSection />
      <ProjectsSection />
      <HackathonsSection />
      <ContactSection />
    </main>
  );
}
