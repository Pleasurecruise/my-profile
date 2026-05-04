import { Hono } from "hono";
import { z } from "zod";

const sessions = new Map<string, number>();
const SESSION_TTL_MS = 180_000;
const PresenceBodySchema = z.object({
  sessionId: z.string().max(63).optional(),
});

function getActiveCount(): number {
  const now = Date.now();
  let count = 0;
  for (const lastSeen of sessions.values()) {
    if (now - lastSeen < SESSION_TTL_MS) count++;
  }
  return Math.max(1, count);
}

function pruneExpired(): void {
  const now = Date.now();
  for (const [id, lastSeen] of sessions) {
    if (now - lastSeen >= SESSION_TTL_MS) sessions.delete(id);
  }
}

export const presence = new Hono()
  .get("/", (c) => {
    pruneExpired();
    return c.json({ count: getActiveCount() });
  })
  .post("/", async (c) => {
    const rawBody = await c.req.json().catch(() => ({}));
    const body = PresenceBodySchema.safeParse(rawBody);
    const sessionId = body.success ? body.data.sessionId : undefined;
    if (sessionId) {
      sessions.set(sessionId, Date.now());
    }
    pruneExpired();
    return c.json({ count: getActiveCount() });
  });
