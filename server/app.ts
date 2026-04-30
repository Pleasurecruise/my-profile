import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { getAuth } from "./auth";
import { amIOk } from "./routes/am-i-ok";
import { blog } from "./routes/blog";
import { feed } from "./routes/feed";
import { chat } from "./routes/chat";
import { gallery } from "./routes/gallery";
import { og } from "./routes/og";
import { presence } from "./routes/presence";
import { getBlogPostMeta } from "./lib/blog";
import { injectOgTags } from "./lib/og-inject";

const app = new Hono<{ Bindings: Cloudflare.Env }>();

app.use("*", logger());
app.use(
  "/api/*",
  cors({
    origin: (origin) => origin,
    allowHeaders: ["Content-Type", "Authorization", "Cookie"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

// Better Auth — handles /api/auth/*
app.all("/api/auth", (c) => getAuth(c.env).handler(c.req.raw));
app.all("/api/auth/*", (c) => getAuth(c.env).handler(c.req.raw));

// API routes
app
  .route("/api/blog", blog)
  .route("/api/chat", chat)
  .route("/api/am-i-ok", amIOk)
  .route("/api/og", og)
  .route("/api/presence", presence)
  .route("/api/gallery", gallery)
  .route("/feed.xml", feed);

const BASE_URL = "https://you-find.me";

// Inject per-post OG tags server-side so crawlers see them without running JS
app.get("/blog/*", async (c) => {
  const pathname = new URL(c.req.url).pathname;
  const rawSlug = pathname.slice("/blog/".length);

  const htmlResponse = await c.env.ASSETS.fetch(c.req.raw);
  if (!rawSlug) return htmlResponse;

  const decodedSlug = rawSlug.split("/").map(decodeURIComponent).join("/");
  const encodedSlug = decodedSlug.split("/").map(encodeURIComponent).join("/");

  const meta = await getBlogPostMeta(c.env.BLOG_BUCKET, c.env.KV_NAMESPACE, decodedSlug);
  if (!meta) return htmlResponse;

  const description = meta.excerpt.length > 160 ? `${meta.excerpt.slice(0, 157)}…` : meta.excerpt;

  return injectOgTags(htmlResponse, {
    title: `${meta.title} · Pleasure1234`,
    description,
    imageUrl: `${BASE_URL}/api/og/blog/${encodedSlug}`,
    pageUrl: `${BASE_URL}/blog/${encodedSlug}`,
    type: "article",
  });
});

export default app;
