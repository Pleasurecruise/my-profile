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

export default app;
