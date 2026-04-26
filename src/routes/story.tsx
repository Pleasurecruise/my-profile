import { BlogContent } from "@my-profile/ui";
import { createFileRoute } from "@tanstack/react-router";
import { run } from "@mdx-js/mdx";
import * as jsxRuntime from "react/jsx-runtime";
import { use, useMemo } from "react";
import BlurFade from "@/components/magicui/blur-fade";
import { TravelGlobe } from "@/components/shared/travel-globe";
import { TRAVEL_LOCATIONS } from "@/data/travel";
import type { StoryData } from "@/types";

export const Route = createFileRoute("/story")({
  loader: async (): Promise<StoryData> => {
    const res = await fetch("/api/story");
    if (!res.ok) throw new Error("Failed to load story");
    return res.json() as Promise<StoryData>;
  },
  component: StoryPage,
});

const BLUR_FADE_DELAY = 0.04;

function useMdxContent(code: string) {
  const promise = useMemo(() => run(code, { ...jsxRuntime }).then(({ default: C }) => C), [code]);
  return use(promise);
}

function StoryPage() {
  const { beforeCode, afterCode } = Route.useLoaderData();
  const Before = useMdxContent(beforeCode);
  const After = afterCode ? useMdxContent(afterCode) : null;

  return (
    <main className="flex flex-col min-h-dvh">
      <section id="story">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="max-w-2xl mx-auto">
            <BlogContent className="article">
              <Before />
            </BlogContent>
            <TravelGlobe locations={TRAVEL_LOCATIONS} />
            {After && (
              <BlogContent className="article">
                <After />
              </BlogContent>
            )}
          </div>
        </BlurFade>
      </section>
    </main>
  );
}
