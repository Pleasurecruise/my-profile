import { Hono } from "hono";
import type { Bindings } from "../types/bindings";
import { getStoryData } from "../lib/story";

export const story = new Hono<{ Bindings: Bindings }>().get("/", async (c) => {
  const data = await getStoryData();
  return c.json({
    ...data,
    mapboxToken: c.env.VITE_MAPBOX_TOKEN?.trim() || null,
  });
});
