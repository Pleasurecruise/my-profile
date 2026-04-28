import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { getAuth } from "./auth";
import { authMiddleware } from "./lib/auth-middleware";
import type { AuthEnv } from "./types/auth";
import { amIOk } from "./routes/am-i-ok";
import { blog } from "./routes/blog";
import { chat } from "./routes/chat";
import { gallery } from "./routes/gallery";
import { presence } from "./routes/presence";
import { story } from "./routes/story";

const app = new Hono<AuthEnv>();

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
app.use("/api/chat/*", authMiddleware);

// Better Auth — handles /api/auth/*
app.all("/api/auth", async (c) => {
  const auth = await getAuth(c.env);
  return auth.handler(c.req.raw);
});
app.all("/api/auth/*", async (c) => {
  const auth = await getAuth(c.env);
  return auth.handler(c.req.raw);
});

// API routes
app
  .route("/api/blog", blog)
  .route("/api/chat", chat)
  .route("/api/am-i-ok", amIOk)
  .route("/api/presence", presence)
  .route("/api/gallery", gallery)
  .route("/api/story", story);

export default app;
