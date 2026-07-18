import { z } from "zod";
import { defineHandler } from "void/handler";
import { getActivePresenceCount, pruneExpiredPresence, touchPresence } from "@server/lib/presence";

const presenceBodySchema = z.object({
  sessionId: z.string().max(63).optional(),
});

export const GET = defineHandler((c) => {
  pruneExpiredPresence();
  return c.json({ count: getActivePresenceCount() });
});

export const POST = defineHandler(async (c) => {
  const rawBody = await c.req.json().catch(() => ({}));
  const body = presenceBodySchema.safeParse(rawBody);
  if (body.success && body.data.sessionId) touchPresence(body.data.sessionId);
  pruneExpiredPresence();
  return c.json({ count: getActivePresenceCount() });
});
