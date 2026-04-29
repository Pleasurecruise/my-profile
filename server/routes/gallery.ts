import { Hono } from "hono";
import { getGalleryPhotos } from "../lib/notion-gallery";

export const gallery = new Hono<{ Bindings: Cloudflare.Env }>().get("/", async (c) => {
  const notionToken = c.env.NOTION_TOKEN;
  const photos = await getGalleryPhotos(notionToken);
  return c.json(photos);
});
