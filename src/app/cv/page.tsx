import BlurFade from "@/components/magicui/blur-fade";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATA } from "@/data/resume";
import Link from "next/link";
import Markdown from "react-markdown";
import { TranslatesCard } from "@/components/translates-card";
import WorkSection from "./_components/work-section";
import ProjectsSection from "./_components/projects-section";
import HackathonsSection from "./_components/hackathons-section";
import ContactSection from "./_components/contact-section";
import { ArrowUpRight } from "lucide-react";

const BLUR_FADE_DELAY = 0.04;

export default function Page() {
    return (
        <main className="flex flex-col min-h-[100dvh] space-y-10">
            <section id="hero">
                <div className="mx-auto w-full max-w-2xl space-y-8">
                    <div className="gap-2 flex justify-between">
                        <div className="flex-col flex flex-1 space-y-1.5">
                            <BlurFade delay={BLUR_FADE_DELAY}>
                                <TypingAnimation
                                    delay={BLUR_FADE_DELAY * 1000 + 200}
                                    duration={50}
                                    className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                                >
                                    {`Hi, I'm ${DATA.name.split(" ")[0]} 👋`}
                                </TypingAnimation>
                            </BlurFade>
                            <BlurFade delay={BLUR_FADE_DELAY * 2}>
                                <TypingAnimation
                                    delay={BLUR_FADE_DELAY * 2000 + 400}
                                    duration={30}
                                    className="max-w-[600px] md:text-xl leading-snug"
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
                <div className="flex min-h-0 flex-col gap-y-4">
                    <BlurFade delay={BLUR_FADE_DELAY * 3}>
                        <h2 className="text-xl font-bold">About</h2>
                    </BlurFade>
                    <BlurFade delay={BLUR_FADE_DELAY * 4}>
                        <div className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
                            <Markdown>{DATA.summary}</Markdown>
                        </div>
                    </BlurFade>
                </div>
            </section>

            <section id="work">
                <div className="flex min-h-0 flex-col gap-y-6">
                    <BlurFade delay={BLUR_FADE_DELAY * 5}>
                        <h2 className="text-xl font-bold">Work Experience</h2>
                    </BlurFade>
                    <BlurFade delay={BLUR_FADE_DELAY * 6}>
                        <WorkSection />
                    </BlurFade>
                </div>
            </section>

            <section id="education">
                <div className="flex min-h-0 flex-col gap-y-6">
                    <BlurFade delay={BLUR_FADE_DELAY * 7}>
                        <h2 className="text-xl font-bold">Education</h2>
                    </BlurFade>
                    <div className="flex flex-col gap-8">
                        {DATA.education.map((education, index) => (
                            <BlurFade
                                key={education.school}
                                delay={BLUR_FADE_DELAY * 8 + index * 0.05}
                            >
                                <Link
                                    href={education.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-x-3 justify-between group"
                                >
                                    <div className="flex items-center gap-x-3 flex-1 min-w-0">
                                        {education.logoUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={education.logoUrl}
                                                alt={education.school}
                                                className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border overflow-hidden object-contain flex-none"
                                            />
                                        ) : (
                                            <div className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border bg-muted flex-none" />
                                        )}
                                        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                                            <div className="font-semibold leading-none flex items-center gap-2">
                                                {education.school}
                                                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" aria-hidden />
                                            </div>
                                            <div className="font-sans text-sm text-muted-foreground">
                                                {education.degree}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs tabular-nums text-muted-foreground text-right flex-none">
                                        {education.start} - {education.end}
                                    </div>
                                </Link>
                            </BlurFade>
                        ))}
                    </div>
                </div>
            </section>

            <section id="skills">
                <div className="flex min-h-0 flex-col gap-y-4">
                    <BlurFade delay={BLUR_FADE_DELAY * 9}>
                        <h2 className="text-xl font-bold">Skills</h2>
                    </BlurFade>
                    <div className="flex flex-wrap gap-2">
                        {DATA.skills.map((skill, id) => (
                            <BlurFade key={skill.name} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                                <div className="border bg-background border-border ring-2 ring-border/20 rounded-xl h-8 w-fit px-4 flex items-center gap-2">
                                    {skill.icon && <skill.icon className="size-4 rounded overflow-hidden object-contain" />}
                                    <span className="text-foreground text-sm font-medium">{skill.name}</span>
                                </div>
                            </BlurFade>
                        ))}
                    </div>
                </div>
            </section>

            <BlurFade delay={BLUR_FADE_DELAY * 11}>
                <ProjectsSection />
            </BlurFade>

            <BlurFade delay={BLUR_FADE_DELAY * 13}>
                <HackathonsSection />
            </BlurFade>

            <section id="contributions">
                <div className="flex min-h-0 flex-col gap-y-6">
                    <BlurFade delay={BLUR_FADE_DELAY * 13}>
                        <h2 className="text-xl font-bold">Open Source Contributions</h2>
                    </BlurFade>
                    <div className="flex flex-col gap-8">
                        {DATA.contributions.map((contribution, index) => (
                            <BlurFade
                                key={contribution.title + contribution.dates}
                                delay={BLUR_FADE_DELAY * 14 + index * 0.05}
                            >
                                <Link
                                    href={contribution.links[0].href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-x-3 justify-between group"
                                >
                                    <div className="flex items-center gap-x-3 flex-1 min-w-0">
                                        {contribution.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={contribution.image}
                                                alt={contribution.title}
                                                className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border overflow-hidden object-contain flex-none"
                                            />
                                        ) : (
                                            <div className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border bg-muted flex-none" />
                                        )}
                                        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                                            <div className="font-semibold leading-none flex items-center gap-2">
                                                {contribution.title}
                                                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" aria-hidden />
                                            </div>
                                            <div className="font-sans text-sm text-muted-foreground line-clamp-1">
                                                {contribution.description}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs tabular-nums text-muted-foreground text-right flex-none">
                                        {contribution.dates}
                                    </div>
                                </Link>
                            </BlurFade>
                        ))}
                    </div>
                </div>
            </section>

            <section id="translates">
                <div className="space-y-12 w-full py-12">
                    <BlurFade delay={BLUR_FADE_DELAY * 13}>
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                                    Documentation Translates
                                </div>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                                    I contribute to CN translation
                                </h2>
                                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    While learning different technology stacks, I browsed the official documentation and completed the missing Chinese translations, such as those for MDN, Flutter, React etc.
                                </p>
                            </div>
                        </div>
                    </BlurFade>
                    <BlurFade delay={BLUR_FADE_DELAY * 14}>
                        <ul className="mb-4 ml-4 divide-y divide-dashed border-l">
                            {DATA.translates.map((project, id) => (
                                <BlurFade
                                    key={project.title + project.dates}
                                    delay={BLUR_FADE_DELAY * 15 + id * 0.05}
                                >
                                    <TranslatesCard
                                        title={project.title}
                                        description={project.description}
                                        dates={project.dates}
                                        image={project.image}
                                        links={project.links}
                                    />
                                </BlurFade>
                            ))}
                        </ul>
                    </BlurFade>
                </div>
            </section>

            <section id="contact">
                <BlurFade delay={BLUR_FADE_DELAY * 16}>
                    <ContactSection />
                </BlurFade>
            </section>
        </main>
    );
}