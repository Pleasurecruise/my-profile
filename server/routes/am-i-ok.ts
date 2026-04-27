import { Hono } from "hono";
import { sql } from "kysely";
import { z } from "zod";
import { getDb } from "../lib/db";
import { getConfig } from "../lib/runtime-config";
import type { Bindings } from "../types/bindings";

const bodySchema = z.object({
  app: z.string().optional(),
  apps: z.array(z.string()).optional(),
  device: z.string().optional(),
});

export const amIOk = new Hono<{ Bindings: Bindings }>()
  .get("/", async (c) => {
    const db = getDb(c.env.HYPERDRIVE.connectionString);
    const status = await db
      .selectFrom("am_i_ok_status")
      .selectAll()
      .where("id", "=", 1)
      .executeTakeFirst();
    return c.json(status);
  })
  .post("/", async (c) => {
    const authHeader = c.req.header("Authorization");
    const amIOkSecret = await getConfig(c.env, "AM_I_OK_SECRET");
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
      .insertInto("am_i_ok_status")
      .values(values)
      .onConflict((oc) =>
        oc.column("id").doUpdateSet({
          apps: values.apps,
          deviceName: values.deviceName,
          updatedAt: sql<Date>`now()`,
        }),
      )
      .execute();

    return c.json({ ok: true });
  });
