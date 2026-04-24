// Derived from Taki <https://github.com/canmi21/taki> (AGPL-v3)
export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\p{L}\p{N}\s-]/gu, "")
		.replace(/[\s_]+/g, "-")
		.replace(/^-+|-+$/g, "");
}
