import { Hono } from "hono";

export const gallery = new Hono<{ Bindings: Cloudflare.Env }>()
  .get("/", async (c) => {
    const list = await c.env.BLOG_BUCKET.list({ prefix: "img/" });
    const keys = list.objects.map((obj) => obj.key.slice("img/".length)).filter(Boolean);
    return c.json(keys);
  })
  .get("/img/*", async (c) => {
    const filename = c.req.path.split("/img/").slice(1).join("/img/");
    if (!filename) return c.notFound();
    const obj = await c.env.BLOG_BUCKET.get(`img/${filename}`);
    if (!obj) return c.notFound();
    const headers = new Headers();
    obj.writeHttpMetadata(headers);
    headers.set("cache-control", "public, max-age=31536000, immutable");
    return new Response(obj.body, { headers });
  });
