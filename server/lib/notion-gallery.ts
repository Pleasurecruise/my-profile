import { NotionAPI } from "notion-client";
import type { Block, NotionMapBox } from "notion-types";

const notion = new NotionAPI();
const PAGE_ID = "3351dc310951806a8c74e77e316b94f7";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export interface GalleryPhoto {
  id: string;
  img: string;
  title: string;
  ratio: number;
}

let cache: { photos: GalleryPhoto[]; expiresAt: number } | null = null;

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
    const ratio = (v.format as { block_aspect_ratio?: number } | undefined)?.block_aspect_ratio;
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
    .map((e, i) => ({ id: e.blockId, img: signedUrls[i] ?? "", title: e.title, ratio: e.ratio }))
    .filter((p) => p.img);
}

export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  if (cache && Date.now() < cache.expiresAt) return cache.photos;
  const photos = await fetchGalleryPhotos();
  cache = { photos, expiresAt: Date.now() + CACHE_TTL_MS };
  return photos;
}
