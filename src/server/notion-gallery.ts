import "server-only";
import { NotionAPI } from "notion-client";
import type { Block, NotionMapBox } from "notion-types";
import { unstable_cache } from "next/cache";

const notion = new NotionAPI();

const PAGE_ID = "3351dc310951806a8c74e77e316b94f7";

export interface GalleryPhoto {
	id: string;
	img: string;
	title: string;
	ratio: number; // height / width
}

// NotionMapBox<T> is either { role, value: T } or { role, value: { role, value: T } } (API v3)
function unwrapBlock(box: NotionMapBox<Block>): Block {
	const inner = box.value;
	if ("type" in inner) return inner;
	return inner.value;
}

async function fetchGalleryPhotos(): Promise<GalleryPhoto[]> {
	const recordMap = await notion.getPage(PAGE_ID, {
		fetchCollections: true,
		signFileUrls: false,
	});

	const blocks = recordMap.block ?? {};

	// Map content block ID → parent page title
	const contentToTitle: Record<string, string> = {};
	for (const box of Object.values(blocks)) {
		const v = unwrapBlock(box);
		if (v.type === "page") {
			const title: string = v.properties?.title?.[0]?.[0] ?? "";
			for (const childId of v.content ?? []) {
				contentToTitle[childId] = title;
			}
		}
	}

	// Collect the first image block per parent page
	const seenPages = new Set<string>();
	const imageEntries: Array<{
		blockId: string;
		title: string;
		attachmentUrl: string;
		ratio: number;
	}> = [];

	for (const [id, box] of Object.entries(blocks)) {
		const v = unwrapBlock(box);
		if (v.type !== "image") continue;

		const title = contentToTitle[id];
		if (!title || seenPages.has(title)) continue;

		const source: string = v.properties?.source?.[0]?.[0] ?? "";
		const ratio = (v.format as { block_aspect_ratio?: number } | undefined)
			?.block_aspect_ratio;
		if (!source.startsWith("attachment:") || !ratio) continue;

		seenPages.add(title);
		imageEntries.push({ blockId: id, title, attachmentUrl: source, ratio });
	}

	if (!imageEntries.length) return [];

	const { signedUrls } = await notion.getSignedFileUrls(
		imageEntries.map((e) => ({
			url: e.attachmentUrl,
			permissionRecord: { table: "block" as const, id: e.blockId },
		})),
	);

	return imageEntries
		.map((e, i) => ({
			id: e.blockId,
			img: signedUrls[i] ?? "",
			title: e.title,
			ratio: e.ratio,
		}))
		.filter((p) => p.img);
}

// Revalidate every hour — Notion signed URLs last ~24 hours
export const getGalleryPhotos = unstable_cache(
	fetchGalleryPhotos,
	["gallery-photos"],
	{
		revalidate: 3600,
	},
);
