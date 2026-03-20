"use client";

import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { useTheme } from "next-themes";

export default function ContactSection() {
  const { resolvedTheme } = useTheme();
  const gridColor = resolvedTheme === "dark" ? "rgb(255,255,255)" : "rgb(0,0,0)";

  return (
    <div className="border rounded-xl p-10 relative">
      <div className="absolute -top-4 border bg-primary z-10 rounded-xl px-4 py-1 left-1/2 -translate-x-1/2">
        <span className="text-background text-sm font-medium">Contact</span>
      </div>
      <FlickeringGrid
        className="absolute inset-0 w-full h-full rounded-xl overflow-hidden"
        squareSize={2}
        gridGap={2}
        color={gridColor}
        maxOpacity={0.2}
        style={{
          maskImage: "linear-gradient(to bottom, black 30%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, black 30%, transparent)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Get in Touch
        </h2>
        <p className="mx-auto max-w-lg text-muted-foreground text-balance">
          Want to chat? Just email me or shoot me a dm with a direct question on WeChat and I&apos;ll respond whenever I can.
        </p>
      </div>
    </div>
  );
}