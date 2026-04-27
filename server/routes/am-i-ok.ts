import { Hono } from "hono";
import { z } from "zod";
import { getPrisma } from "../lib/prisma";
import type { Bindings } from "../types/bindings";

const bodySchema = z.object({
  app: z.string().optional(),
  apps: z.array(z.string()).optional(),
  device: z.string().optional(),
});

export const amIOk = new Hono<{ Bindings: Bindings }>()
  .get("/", async (c) => {
    const prisma = getPrisma(c.env.HYPERDRIVE.connectionString);
    const status = await prisma.amIOkStatus.findUnique({ where: { id: 1 } });
    return c.json(status);
  })
  .post("/", async (c) => {
    const authHeader = c.req.header("Authorization");
    if (authHeader !== `Bearer ${c.env.AM_I_OK_SECRET}`) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const parsed = bodySchema.safeParse(await c.req.json());
    if (!parsed.success) return c.json({ error: "Invalid body" }, 400);

    const { app, apps, device } = parsed.data;
    const appList = apps ?? (app ? [app] : []);

    const prisma = getPrisma(c.env.HYPERDRIVE.connectionString);
    await prisma.amIOkStatus.upsert({
      where: { id: 1 },
      update: { apps: appList.slice(0, 2), deviceName: device ?? "MacBook" },
      create: {
        id: 1,
        apps: appList.slice(0, 2),
        deviceName: device ?? "MacBook",
        updatedAt: new Date(),
      },
    });

    return c.json({ ok: true });
  });
