// Derived from Taki <https://github.com/canmi21/taki> (AGPL-v3)
import { createBundledHighlighter } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

const javascript = () => import("@shikijs/langs/javascript");
const typescript = () => import("@shikijs/langs/typescript");
const shellscript = () => import("@shikijs/langs/bash");

const blogLanguages = {
  bash: shellscript,
  shell: shellscript,
  sh: shellscript,
  shellscript,
  javascript,
  js: javascript,
  typescript,
  ts: typescript,
  jsx: () => import("@shikijs/langs/jsx"),
  tsx: () => import("@shikijs/langs/tsx"),
  css: () => import("@shikijs/langs/css"),
  html: () => import("@shikijs/langs/html"),
  json: () => import("@shikijs/langs/json"),
  jsonc: () => import("@shikijs/langs/jsonc"),
  yaml: () => import("@shikijs/langs/yaml"),
  markdown: () => import("@shikijs/langs/markdown"),
  md: () => import("@shikijs/langs/markdown"),
  dotenv: () => import("@shikijs/langs/dotenv"),
  dockerfile: () => import("@shikijs/langs/dockerfile"),
  go: () => import("@shikijs/langs/go"),
  java: () => import("@shikijs/langs/java"),
  python: () => import("@shikijs/langs/python"),
  sql: () => import("@shikijs/langs/sql"),
} as const;

const blogThemes = {
  "github-light": () => import("@shikijs/themes/github-light"),
  "github-dark": () => import("@shikijs/themes/github-dark"),
} as const;

const createContentHighlighter = createBundledHighlighter({
  langs: blogLanguages,
  themes: blogThemes,
  engine: () => createJavaScriptRegexEngine(),
});

let highlighterPromise: ReturnType<typeof createContentHighlighter> | null = null;

export async function getHighlighter() {
  highlighterPromise ??= createContentHighlighter({
    langs: [],
    themes: ["github-light", "github-dark"],
  });
  return highlighterPromise;
}
