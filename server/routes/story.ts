import { Hono } from "hono";
import { getConfig } from "../lib/runtime-config";
import type { Bindings } from "../types/bindings";
import { getStoryData } from "../lib/story";

export const story = new Hono<{ Bindings: Bindings }>().get("/", async (c) => {
  const data = await getStoryData();
  const mapboxToken = await getConfig(c.env, "VITE_MAPBOX_TOKEN");
  return c.json({
    ...data,
    mapboxToken,
  });
});
