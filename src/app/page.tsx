import BlurFade from "@/components/magicui/blur-fade";
import { DATA } from "@/data/resume";
import { FRIENDS } from "@/data/links";
import { Icons } from "@/components/icons";
import Link from "next/link";
import Image from "next/image";
import { Newsreader } from "next/font/google";
import { ArrowUpRight } from "lucide-react";

const newsreader = Newsreader({
    subsets: ["latin"],
    style: ["italic"],
    weight: ["400"],
    variable: "--font-newsreader",
});

const BLUR_FADE_DELAY = 0.04;

export default function Page() {
    return (
        <main className="flex flex-col min-h-[100dvh] space-y-10">
            <section id="hero">
                <div className="mx-auto w-full max-w-2xl">
                    <BlurFade delay={BLUR_FADE_DELAY}>
                        <div className="flex items-center gap-4 mb-6">
                            <Image
                                src={DATA.avatarUrl}
                                alt={DATA.name}
                                width={56}
                                height={56}
                                className="rounded-full"
                            />
                            <div className="flex flex-col">
                                <Link
                                    href={DATA.contact.social.GitHub.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[20px] font-medium text-foreground hover:underline"
                                >
                                    @Pleasurecruise
                                </Link>
                                <p className="text-[14px] text-muted-foreground">
                                    Full-stack Developer
                                </p>
                            </div>
                        </div>
                    </BlurFade>
                </div>
            </section>
            <section id="about">
                <BlurFade delay={BLUR_FADE_DELAY * 2}>
                    <div className={`mx-auto w-full max-w-2xl space-y-4 ${newsreader.variable}`}>
                        <p className="text-[15px] leading-relaxed text-muted-foreground">
                            Any shortcomings are kindly overlooked. 🙏
                        </p>
                        <p className="text-[15px] leading-relaxed text-muted-foreground">
                            Passionate computer science student at{" "}
                            <Link
                                href="https://www.nottingham.ac.uk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-0.5 text-foreground hover:text-muted-foreground transition-colors"
                            >
                                UoN
                                <ArrowUpRight className="w-3 h-3" />
                            </Link>
                            {" "}with hands-on experience in{" "}
                            <span className="italic text-foreground" style={{ fontFamily: "var(--font-newsreader)" }}>full-stack</span>
                            {" "}development and{" "}
                            <span className="italic text-foreground" style={{ fontFamily: "var(--font-newsreader)" }}>AI</span>
                            {" "}technologies. Active contributor to open source projects mainly on{" "}
                            <Link
                                href="https://github.com/CherryHQ/cherry-studio"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-0.5 text-foreground hover:text-muted-foreground transition-colors"
                            >
                                Cherry Studio
                                <ArrowUpRight className="w-3 h-3" />
                            </Link>
                            . Building with React, Next.js, and TypeScript.
                        </p>
                        <p className="text-[15px] leading-relaxed text-muted-foreground">
                            Currently I am seeking a job opportunity. Click{" "}
                            <Link
                                href="/cv"
                                className="inline-flex items-center gap-0.5 text-foreground hover:text-muted-foreground transition-colors"
                            >
                                here
                                <ArrowUpRight className="w-3 h-3" />
                            </Link>
                            {" "}to see my cv :3
                        </p>
                    </div>
                </BlurFade>
            </section>
            <section id="photos">
                <BlurFade delay={BLUR_FADE_DELAY * 5}>
                    <div className="space-y-4 mx-auto w-full max-w-2xl">
                        <span className="italic" style={{ fontFamily: "var(--font-newsreader)" }}>
                            gallery
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                            Coming soon... :D
                        </div>
                    </div>
                </BlurFade>
            </section>
            <section id="links">
                <BlurFade delay={BLUR_FADE_DELAY * 4}>
                    <div className="space-y-4 mx-auto w-full max-w-2xl">
                        <span className="italic" style={{ fontFamily: "var(--font-newsreader)" }}>
                            friends
                        </span>
                        <ul className="space-y-3 mt-2">
                            {FRIENDS.map((friend) => (
                                <li key={friend.url}>
                                    <Link
                                        href={friend.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 text-[15px] text-muted-foreground hover:text-foreground transition-colors group"
                                    >
                                        <Image
                                            src={friend.avatar}
                                            alt={friend.name}
                                            width={20}
                                            height={20}
                                            className="rounded-full"
                                        />
                                        <span>{friend.name}</span>
                                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </BlurFade>
            </section>
            <section id="contact">
                <BlurFade delay={BLUR_FADE_DELAY * 5}>
                    <div className="space-y-4 mx-auto w-full max-w-2xl">
                        <span className="italic" style={{ fontFamily: "var(--font-newsreader)" }}>
                            connect
                        </span>
                        <ul className="space-y-3 mt-2">
                            <li>
                                <Link
                                    href={`mailto:${DATA.contact.email}`}
                                    className="flex items-center gap-3 text-[15px] text-muted-foreground hover:text-foreground transition-colors group"
                                >
                                    <Icons.email className="w-5 h-5" />
                                    <span>Email</span>
                                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </li>
                            <li>
                                {/*TODO: replace with a tooltip*/}
                                <Link
                                    href="#"
                                    className="flex items-center gap-3 text-[15px] text-muted-foreground hover:text-foreground transition-colors group"
                                >
                                    <Icons.wechat className="w-5 h-5" />
                                    <span>WeChat</span>
                                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={DATA.contact.social.Instagram.url}
                                    className="flex items-center gap-3 text-[15px] text-muted-foreground hover:text-foreground transition-colors group"
                                >
                                    <Icons.instagram className="w-5 h-5" />
                                    <span>Instagram</span>
                                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </li>
                            {/*TODO: replace with a tooltip*/}
                            <li>
                                <Link
                                    href="#"
                                    className="flex items-center gap-3 text-[15px] text-muted-foreground hover:text-foreground transition-colors group"
                                >
                                    <Icons.discord className="w-5 h-5" />
                                    <span>Discord</span>
                                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </BlurFade>
            </section>
            <footer className="mt-auto pt-16">
                <BlurFade delay={BLUR_FADE_DELAY * 8}>
                    <div className={`mx-auto w-full max-w-2xl ${newsreader.variable}`}>
                        <p className="text-lg text-muted-foreground/30 mb-4">
                            credits for{" "}
                            <span className="italic" style={{ fontFamily: "var(--font-newsreader)" }}>
                                dillionverma portfolio
                            </span>
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8">
                            <Link
                                href="https://github.com/Pleasurecruise/my-profile"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-0.5 text-[14px] text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors"
                            >
                                Source Code
                                <ArrowUpRight className="w-3 h-3" />
                            </Link>
                            <Link
                                href="https://beian.miit.gov.cn"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-0.5 text-[14px] text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors"
                            >
                                ICP No.2023040885-2
                                <ArrowUpRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="flex justify-end">
                            <div className="text-right text-muted-foreground/40">
                                <p className="text-[13px]">𐔌՞. .՞𐦯 ᢉ𐭩.ᐟ🍮</p>
                                <p className="text-[13px] italic" style={{ fontFamily: "var(--font-newsreader)" }}>
                                    a pudding for you
                                </p>
                            </div>
                        </div>
                    </div>
                </BlurFade>
            </footer>
        </main>
    );
}