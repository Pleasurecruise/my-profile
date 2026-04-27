import { Client, isFullDatabase, isFullPage } from "@notionhq/client";
import type { GalleryPhoto } from "@shared/gallery";
import type {
  NotionImageBlock,
  NotionNumberProp,
  NotionProp,
  NotionTitleProp,
} from "../types/notion";

export type { GalleryPhoto };

const DATABASE_ID = "3351dc310951806a8c74e77e316b94f7";
const CACHE_TTL_MS = 50 * 60 * 1000;

let cache: { photos: GalleryPhoto[]; expiresAt: number } | null = null;

function extractTitle(properties: Record<string, NotionProp>): string {
  for (const prop of Object.values(properties)) {
    if (prop.type !== "title") continue;
    const { title } = prop as NotionTitleProp;
    return title
      .map((t) => t.plain_text)
      .join("")
      .trim();
  }
  return "";
}

function extractRatio(properties: Record<string, NotionProp>): number {
  for (const prop of Object.values(properties)) {
    if (prop.type !== "number") continue;
    const { number } = prop as NotionNumberProp;
    if (number !== null && number > 0) return number;
  }
  return 1;
}

async function extractFirstImageUrl(notion: Client, pageId: string): Promise<string> {
  const { results } = await notion.blocks.children.list({
    block_id: pageId,
    page_size: 50,
  });
  for (const block of results) {
    if ((block as { type: string }).type !== "image") continue;
    const { image } = block as unknown as NotionImageBlock;
    if (image.type === "file" && image.file) return image.file.url;
    if (image.type === "external" && image.external) return image.external.url;
  }
  return "";
}

async function resolveGalleryDataSourceId(notion: Client, databaseId: string): Promise<string> {
  const database = await notion.databases.retrieve({ database_id: databaseId });

  if (!isFullDatabase(database)) {
    throw new Error(`Notion database ${databaseId} did not return a full database object`);
  }

  const [dataSource] = database.data_sources;
  if (!dataSource) {
    throw new Error(`Notion database ${databaseId} does not expose any data sources`);
  }

  return dataSource.id;
}

async function fetchGalleryPhotos(notion: Client): Promise<GalleryPhoto[]> {
  const dataSourceId = await resolveGalleryDataSourceId(notion, DATABASE_ID);
  const { results } = await notion.dataSources.query({
    data_source_id: dataSourceId,
  });

  const photos = await Promise.all(
    results.filter(isFullPage).map(async (page) => {
      const img = await extractFirstImageUrl(notion, page.id);
      if (!img) return null;
      const props = page.properties as Record<string, NotionProp>;
      return {
        id: page.id,
        img,
        title: extractTitle(props),
        ratio: extractRatio(props),
      };
    }),
  );

  return photos.filter((p): p is GalleryPhoto => p !== null);
}

export async function getGalleryPhotos(notionToken: string): Promise<GalleryPhoto[]> {
  if (cache && Date.now() < cache.expiresAt) return cache.photos;
  const notion = new Client({ auth: notionToken });
  const photos = await fetchGalleryPhotos(notion);
  cache = { photos, expiresAt: Date.now() + CACHE_TTL_MS };
  return photos;
}
