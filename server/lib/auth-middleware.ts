import { createMiddleware } from "hono/factory";
import { getAuth } from "../auth";
import type { AuthEnv } from "../types/auth";

export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  if (
    c.req.method === "OPTIONS" ||
    c.req.path === "/api/auth" ||
    c.req.path.startsWith("/api/auth/")
  ) {
    await next();
    return;
  }

  const auth = await getAuth(c.env);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  c.set("session", session?.session ?? null);
  c.set("user", session?.user ?? null);

  await next();
});
