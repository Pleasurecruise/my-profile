import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { getAuth } from "./auth";
import { authMiddleware } from "./lib/auth-middleware";
import type { AuthBindings } from "./types/auth";
import type { Bindings } from "./types/bindings";
import { amIOk } from "./routes/am-i-ok";
import { blog } from "./routes/blog";
import { chat } from "./routes/chat";
import { gallery } from "./routes/gallery";
import { presence } from "./routes/presence";
import { story } from "./routes/story";

type AppEnv = AuthBindings & { Bindings: Bindings };

const app = new Hono<AppEnv>();

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
app.use("/api/*", authMiddleware);

// Better Auth — handles /api/auth/*
app.all("/api/auth", (c) => {
  return getAuth(c.env).handler(c.req.raw);
});
app.all("/api/auth/*", (c) => {
  return getAuth(c.env).handler(c.req.raw);
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
