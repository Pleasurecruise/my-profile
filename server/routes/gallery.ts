import { Hono } from "hono";
import { getGalleryPhotos } from "../lib/notion-gallery";
import type { Bindings } from "../types/bindings";

export const gallery = new Hono<{ Bindings: Bindings }>().get("/", async (c) => {
  const photos = await getGalleryPhotos(c.env.NOTION_TOKEN);
  return c.json(photos);
});
