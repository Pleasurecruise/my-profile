import { Hono } from "hono";
import { getGalleryPhotos } from "../lib/notion-gallery";

export const gallery = new Hono().get("/", async (c) => {
  const photos = await getGalleryPhotos();
  return c.json(photos);
});
