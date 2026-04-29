import { Hono } from "hono";
import { getStoryData } from "../lib/story";

export const story = new Hono<{ Bindings: Cloudflare.Env }>().get("/", async (c) => {
  const data = await getStoryData();
  const mapboxToken = c.env.VITE_MAPBOX_TOKEN;
  return c.json({
    ...data,
    mapboxToken,
  });
});
