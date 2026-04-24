// Derived from Taki <https://github.com/canmi21/taki> (AGPL-v3)
import { createBundledHighlighter } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { bundledLanguages } from "shiki/langs";
import { bundledThemes } from "shiki/themes";

const createContentHighlighter = createBundledHighlighter({
	langs: bundledLanguages,
	themes: bundledThemes,
	engine: () => createJavaScriptRegexEngine(),
});

let highlighterPromise: ReturnType<typeof createContentHighlighter> | null =
	null;

export async function getHighlighter() {
	highlighterPromise ??= createContentHighlighter({
		langs: [],
		themes: ["github-light", "github-dark"],
	});
	return highlighterPromise;
}
