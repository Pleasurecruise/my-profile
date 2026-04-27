import { Hono } from "hono";
import { getSecret } from "../lib/runtime-config";
import { getGalleryPhotos } from "../lib/notion-gallery";
import type { Bindings } from "../types/bindings";

export const gallery = new Hono<{ Bindings: Bindings }>().get("/", async (c) => {
  const notionToken = await getSecret(c.env.NOTION_TOKEN, "NOTION_TOKEN");
  const photos = await getGalleryPhotos(notionToken);
  return c.json(photos);
});
