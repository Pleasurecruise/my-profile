import { defineHandler } from "void/handler";
import { getBlogFileTree } from "@server/lib/blog";

export const GET = defineHandler(async (c) => {
  const tree = await getBlogFileTree(c.env.BLOG_BUCKET, c.env.KV_NAMESPACE);
  return c.json(tree);
});
