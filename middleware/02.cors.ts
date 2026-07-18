import { cors } from "hono/cors";
import { defineMiddleware } from "void/handler";

const apiCors = cors({
  origin: (origin) => origin,
  allowHeaders: ["Content-Type", "Authorization", "Cookie"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});

export default defineMiddleware((c, next) => {
  if (!c.req.path.startsWith("/api/")) return next();
  return apiCors(c, next);
});
