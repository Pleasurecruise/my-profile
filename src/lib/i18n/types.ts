export type Locale = "zh" | "en" | "ja";
export const SUPPORTED_LOCALES: Locale[] = ["zh", "en", "ja"];
export const DEFAULT_LOCALE: Locale = "en";

const LOCALE_LABELS: Record<Locale, string> = {
  zh: "中文",
  en: "English",
  ja: "日本語",
};

export function getLocaleLabel(locale: Locale): string {
  return LOCALE_LABELS[locale];
}
