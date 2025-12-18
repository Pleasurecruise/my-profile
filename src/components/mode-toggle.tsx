"use client";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function ModeToggle() {
  return (
    <AnimatedThemeToggler
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "px-2 [&_svg]:h-[1.2rem] [&_svg]:w-[1.2rem] [&_svg]:text-neutral-800 dark:[&_svg]:text-neutral-200"
      )}
    />
  );
}
