"use client";

import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type SuggestionsProps = HTMLAttributes<HTMLDivElement>;

export const Suggestions = ({ className, children, ...props }: SuggestionsProps) => (
  <div className={cn("flex flex-wrap gap-2", className)} {...props}>
    {children}
  </div>
);

export type SuggestionProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  suggestion: string;
};

export const Suggestion = ({ className, suggestion, ...props }: SuggestionProps) => (
  <button
    type="button"
    className={cn(
      "cursor-pointer whitespace-nowrap rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
      className,
    )}
    {...props}
  >
    {suggestion}
  </button>
);
