import { Hono } from "hono";
import { getStoryData } from "../lib/story";

export const story = new Hono().get("/", async (c) => {
  const data = await getStoryData();
  return c.json(data);
});
