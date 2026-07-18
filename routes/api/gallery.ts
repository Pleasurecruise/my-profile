import { defineHandler } from "void/handler";

export const GET = defineHandler(async (c) => {
  const list = await c.env.BLOG_BUCKET.list({ prefix: "img/", delimiter: "/" });
  const keys = list.objects.map((obj) => obj.key.slice("img/".length)).filter(Boolean);
  return c.json(keys);
});
