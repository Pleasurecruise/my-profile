export { LocaleProvider, useLocale } from "./context";
export { SUPPORTED_LOCALES, DEFAULT_LOCALE, getLocaleLabel } from "./types";
export type { Locale } from "./types";

/**
 * Replace `{key}` placeholders in a translation string with plain string values.
 *
 * @example
 *   interpolate("Hello {name}", { name: "World" }) // => "Hello World"
 */
export function interpolate(text: string, vars: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
}

/**
 * Replace `{key}` placeholders in a translation string with React nodes.
 *
 * @example
 *   <T text="Hello {name}" vars={{ name: <strong>World</strong> }} />
 */
export function T({ text, vars }: { text: string; vars: Record<string, React.ReactNode> }) {
  const regex = /\{(\w+)\}/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(vars[match[1] as string] ?? `{${match[1]}}`);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}
