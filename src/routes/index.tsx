import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { ImagesBadge } from "@/components/aceternityui/images-badge";
import { Tooltip } from "@/components/aceternityui/tooltip-card";
import { HelloSignature, PresenceCount, SiteAge } from "@my-profile/ui";
import { Icons } from "@/components/shared/icons";
import BlurFade from "@/components/magicui/blur-fade";
import { DiaTextReveal } from "@/components/magicui/dia-text-reveal";
import { Highlighter } from "@/components/magicui/highlighter";
import { FRIENDS, MY_SERIES } from "@/data/links";
import { DATA } from "@/data/resume";
import { useLocale, T } from "@/lib/i18n";
import * as homeStrings from "@/data/i18n/home";

const SITE_URL = "https://you-find.me";
const SITE_TITLE = "Pleasure1234";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: SITE_TITLE },
      {
        name: "description",
        content: "Full-stack Developer · Any shortcomings are kindly overlooked. 🙏",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:title", content: SITE_TITLE },
      {
        property: "og:description",
        content: "Full-stack Developer · Any shortcomings are kindly overlooked. 🙏",
      },
      { property: "og:image", content: `${SITE_URL}/api/og/home` },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: `${SITE_TITLE} — personal website` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      {
        name: "twitter:description",
        content: "Full-stack Developer · Any shortcomings are kindly overlooked. 🙏",
      },
      { name: "twitter:image", content: `${SITE_URL}/api/og/home` },
      { name: "twitter:image:alt", content: `${SITE_TITLE} — personal website` },
    ],
  }),
  component: HomePage,
});

const BLUR_FADE_DELAY = 0.04;

function HomePage() {
  const { locale } = useLocale();
  const t = homeStrings[locale];
  const siteUrl = window.location.origin.replace(/^https?:\/\//, "");

  /* ---- shared inline nodes used in interpolated paragraphs ---- */
  const universityLink = (
    <Highlighter action="underline">
      <a
        href="https://www.nottingham.ac.uk"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-0.5 text-foreground hover:text-muted-foreground transition-colors"
      >
        UoN
        <ArrowUpRight className="w-3 h-3" />
      </a>
    </Highlighter>
  );
  const italicFullstack = (
    <span className="italic" style={{ fontFamily: "var(--font-newsreader)" }}>
      full-stack
    </span>
  );
  const italicAI = (
    <span className="italic" style={{ fontFamily: "var(--font-newsreader)" }}>
      AI
    </span>
  );
  const cherryStudioLink = (
    <Highlighter action="underline">
      <a
        href="https://github.com/CherryHQ/cherry-studio"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-0.5 text-foreground hover:text-muted-foreground transition-colors"
      >
        Cherry Studio
        <ArrowUpRight className="w-3 h-3" />
      </a>
    </Highlighter>
  );
  const italicHackathon = (
    <span className="italic" style={{ fontFamily: "var(--font-newsreader)" }}>
      hackathon
    </span>
  );
  const hereLink = (
    <Highlighter action="underline">
      <Link
        to="/cv"
        className="inline-flex items-center gap-0.5 text-foreground hover:text-muted-foreground transition-colors"
      >
        {t.about.here}
        <ArrowUpRight className="w-3 h-3" />
      </Link>
    </Highlighter>
  );
  const githubLink = (
    <a
      href="https://github.com/Pleasurecruise/my-profile/pulls"
      target="_blank"
      rel="noopener noreferrer"
      className="text-foreground hover:underline"
    >
      GitHub
    </a>
  );
  const magicuiLink = (
    <a
      href="https://github.com/magicuidesign/portfolio"
      target="_blank"
      className="italic hover:underline"
      style={{ fontFamily: "var(--font-newsreader)" }}
    >
      magicuidesign portfolio
    </a>
  );

  return (
    <main className="flex flex-col min-h-dvh">
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl">
          <BlurFade delay={BLUR_FADE_DELAY}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <img
                  src={DATA.avatarUrl}
                  alt={DATA.name}
                  width={56}
                  height={56}
                  className="rounded-full transition-transform duration-700 ease-in-out hover:rotate-[360deg]"
                />
                <div className="flex flex-col">
                  <a
                    href={DATA.contact.social.GitHub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[20px] font-medium text-foreground"
                  >
                    <DiaTextReveal text="@Pleasure1234" duration={1.2} delay={0.3} />
                  </a>
                  <p className="text-[14px] text-foreground">{t.hero.role}</p>
                </div>
              </div>
              <div className="text-muted-foreground/40">
                <HelloSignature />
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      <section id="about" className="mt-6">
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <div className="mx-auto w-full max-w-2xl space-y-4">
            <p className="text-[15px] leading-relaxed text-foreground">{t.about.p1}</p>
            <p className="text-[15px] leading-relaxed text-foreground">
              <T
                text={t.about.p2}
                vars={{
                  university: universityLink,
                  fullstack: italicFullstack,
                  ai: italicAI,
                  CherryStudio: cherryStudioLink,
                }}
              />
            </p>
            <p className="text-[15px] leading-relaxed text-foreground">
              <T text={t.about.p3} vars={{ hackathon: italicHackathon }} />
            </p>
            <p className="text-[15px] leading-relaxed text-foreground">
              <T text={t.about.p4} vars={{ here: hereLink }} />
            </p>
          </div>
        </BlurFade>
      </section>

      <section id="my-series" className="mt-10">
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <div className="mx-auto w-full max-w-2xl mb-5">
            <h2
              className="text-lg font-semibold text-foreground italic"
              style={{ fontFamily: "var(--font-newsreader)" }}
            >
              {t.series.heading}
            </h2>
          </div>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <div className="mx-auto w-full max-w-2xl">
            <div className="grid gap-x-8 gap-y-0 border-t border-border pt-5 lg:grid-cols-2">
              {(() => {
                const mid = Math.ceil(MY_SERIES.length / 2);
                return [MY_SERIES.slice(0, mid), MY_SERIES.slice(mid)];
              })().map((group, gi) => (
                <div key={gi} className={gi > 0 ? "border-t border-border lg:border-0" : ""}>
                  <ul className="divide-y divide-border">
                    {group.map((series) => (
                      <li key={series.url} className="py-3 text-sm leading-relaxed">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="inline-flex text-sm leading-none">{series.emoji}</span>
                          {series.name === "my-memos" || series.name === "my-moment" ? (
                            <Highlighter action="highlight">
                              <a
                                href={series.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-foreground hover:text-muted-foreground transition-colors inline-flex items-center gap-1"
                              >
                                {series.name}
                                <ArrowUpRight className="w-3 h-3" />
                              </a>
                            </Highlighter>
                          ) : (
                            <a
                              href={series.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-foreground hover:text-muted-foreground transition-colors inline-flex items-center gap-1"
                            >
                              {series.name}
                              <ArrowUpRight className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        {series.description && (
                          <p className="mt-1 text-xs text-muted-foreground/60">
                            {series.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </BlurFade>
      </section>

      <section id="friends-connect" className="mt-10">
        <BlurFade delay={BLUR_FADE_DELAY * 4.5}>
          <div className="mx-auto w-full max-w-2xl mb-5">
            <ImagesBadge text={t.friends.badge} images={FRIENDS.slice(0, 3).map((f) => f.avatar)} />
          </div>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 5}>
          <div className="mx-auto w-full max-w-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 border-t border-border pt-5">
              {/* Friends — left 2 columns */}
              <div className="lg:col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground/60 mb-3">
                  {t.friends.heading}
                </h3>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {FRIENDS.map((friend) => (
                    <li key={friend.url}>
                      <a
                        href={friend.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 text-[14px] text-muted-foreground hover:text-foreground transition-colors group py-0.5"
                      >
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          width={18}
                          height={18}
                          className="rounded-full shrink-0"
                        />
                        <span className="truncate">{friend.name}</span>
                        <ArrowUpRight className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connect — right 2 columns */}
              <div className="lg:col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground/60 mb-3">
                  {t.connect.heading}
                </h3>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  <li>
                    <a
                      href={`mailto:${DATA.contact.email}`}
                      className="flex items-center gap-2.5 text-[14px] text-muted-foreground hover:text-foreground transition-colors group py-0.5"
                    >
                      <Icons.email className="size-4 shrink-0" />
                      <span>{t.connect.email}</span>
                      <ArrowUpRight className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                  <li>
                    <Tooltip
                      content={
                        <div className="flex items-center justify-center">
                          <div className="h-50 w-50 overflow-hidden rounded-lg">
                            <img
                              src="/profile/wechat.png"
                              alt="WeChat QR Code"
                              width={200}
                              height={200}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                        </div>
                      }
                    >
                      <a
                        href="#"
                        className="flex items-center gap-2.5 text-[14px] text-muted-foreground hover:text-foreground transition-colors group py-0.5"
                      >
                        <Icons.wechat className="size-4 shrink-0" />
                        <span>{t.connect.wechat}</span>
                        <ArrowUpRight className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </Tooltip>
                  </li>
                  <li>
                    <a
                      href={DATA.contact.social.Instagram.url}
                      className="flex items-center gap-2.5 text-[14px] text-muted-foreground hover:text-foreground transition-colors group py-0.5"
                    >
                      <Icons.instagram className="size-4 shrink-0" />
                      <span>{t.connect.instagram}</span>
                      <ArrowUpRight className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                  <li>
                    <Tooltip
                      containerClassName="[&>div.pointer-events-none]:min-w-[10rem] [&>div.pointer-events-none>div]:p-2 [&>div.pointer-events-none>div]:text-xs"
                      content="Add me on Discord: pleasure9876"
                    >
                      <a
                        href="#"
                        className="flex items-center gap-2.5 text-[14px] text-muted-foreground hover:text-foreground transition-colors group py-0.5"
                      >
                        <Icons.discord className="size-4 shrink-0" />
                        <span>{t.connect.discord}</span>
                        <ArrowUpRight className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </Tooltip>
                  </li>
                  {Object.entries(DATA.contact.social)
                    .filter(([, social]) => social.navbar)
                    .map(([name, social]) => (
                      <li key={name}>
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 text-[14px] text-muted-foreground hover:text-foreground transition-colors group py-0.5"
                        >
                          <social.icon className="size-4 shrink-0" />
                          <span className="truncate">{name}</span>
                          <ArrowUpRight className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </BlurFade>
      </section>

      <section id="friend-link" className="mt-10">
        <BlurFade delay={BLUR_FADE_DELAY * 7}>
          <div className="space-y-4 mx-auto w-full max-w-2xl">
            <span
              className="italic block font-semibold text-lg"
              style={{ fontFamily: "var(--font-newsreader)" }}
            >
              {t.addLink.heading}
            </span>
            <p className="text-[15px] text-muted-foreground">
              {t.addLink.p1} <br />
              <T text={t.addLink.p2} vars={{ github: githubLink }} />
            </p>
            <ul className="space-y-1 text-[15px] text-muted-foreground ml-0.5">
              <li>
                <span className="text-foreground">{t.addLink.name}</span>: Pleasure1234
              </li>
              <li>
                <span className="text-foreground">{t.addLink.url}</span>: {siteUrl}
              </li>
              <li>
                <span className="text-foreground">{t.addLink.avatar}</span>: {siteUrl}
                /profile/me.png
              </li>
              <li>
                <span className="text-foreground">{t.addLink.description}</span>:{" "}
                {t.addLink.descValue}
              </li>
            </ul>
          </div>
        </BlurFade>
      </section>

      <footer className="mt-4 pt-4">
        <BlurFade delay={BLUR_FADE_DELAY * 9}>
          <div className="mx-auto w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <p className="text-lg text-muted-foreground/30">
                <T text={t.footer.inspiredBy} vars={{ magicuidesign: magicuiLink }} />
              </p>
              <div className="flex flex-col items-end gap-1">
                <SiteAge />
                <PresenceCount />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8">
              <a
                href="https://github.com/Pleasurecruise/my-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-[14px] text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors"
              >
                {t.footer.sourceCode} <ArrowUpRight className="w-3 h-3" />
              </a>
              <a
                href="https://beian.miit.gov.cn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-[14px] text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors"
              >
                ICP No.2023040885-2 <ArrowUpRight className="w-3 h-3" />
              </a>
              <a
                href="https://icp.gov.moe/?keyword=20240608"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-[14px] text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors"
              >
                萌 ICP No.20240608 <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </BlurFade>
      </footer>
    </main>
  );
}
