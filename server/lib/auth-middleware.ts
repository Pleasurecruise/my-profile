import { createMiddleware } from "hono/factory";
import { auth } from "../auth";
import type { AuthBindings } from "../types/auth";

export const authMiddleware = createMiddleware<AuthBindings>(async (c, next) => {
  if (c.req.method === "OPTIONS" || c.req.path.startsWith("/api/auth/")) {
    await next();
    return;
  }

  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  c.set("session", session?.session ?? null);
  c.set("user", session?.user ?? null);

  await next();
});
