import { Hono } from "hono";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../lib/db";
import { amIOkStatus } from "../lib/schema";

const bodySchema = z.object({
  app: z.string().optional(),
  apps: z.array(z.string()).optional(),
  device: z.string().optional(),
});

export const amIOk = new Hono<{ Bindings: Cloudflare.Env }>()
  .get("/", async (c) => {
    const db = getDb(c.env.HYPERDRIVE.connectionString);
    const status = await db.query.amIOkStatus.findFirst({
      where: eq(amIOkStatus.id, 1),
    });
    return c.json(status);
  })
  .post("/", async (c) => {
    const authHeader = c.req.header("Authorization");
    const amIOkSecret = c.env.AM_I_OK_SECRET;
    if (authHeader !== `Bearer ${amIOkSecret}`) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const parsed = bodySchema.safeParse(await c.req.json());
    if (!parsed.success) return c.json({ error: "Invalid body" }, 400);

    const { app, apps, device } = parsed.data;
    const appList = apps ?? (app ? [app] : []);
    const db = getDb(c.env.HYPERDRIVE.connectionString);
    const values = {
      id: 1,
      apps: appList.slice(0, 2),
      deviceName: device ?? "MacBook",
      updatedAt: new Date(),
    };

    await db
      .insert(amIOkStatus)
      .values(values)
      .onConflictDoUpdate({
        target: amIOkStatus.id,
        set: {
          apps: values.apps,
          deviceName: values.deviceName,
          updatedAt: sql`now()`,
        },
      })
      .execute();

    return c.json({ ok: true });
  });
