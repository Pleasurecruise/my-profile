export const SITE_URL = "https://you-find.me";
export const SITE_TITLE = "Pleasure1234";

export function escapeXml(value: string): string {
  return (value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
