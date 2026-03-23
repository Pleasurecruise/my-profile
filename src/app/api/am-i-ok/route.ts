import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/server/prisma";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("Authorization");
  if (auth !== `Bearer ${process.env.AM_I_OK_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    app?: string;
    apps?: string[];
    device?: string;
  };

  const apps = body.apps ?? (body.app ? [body.app] : []);

  await prisma.amIOkStatus.upsert({
    where: { id: 1 },
    update: {
      apps: apps.slice(0, 2),
      deviceName: body.device ?? "MacBook",
    },
    create: {
      id: 1,
      apps: apps.slice(0, 2),
      deviceName: body.device ?? "MacBook",
    },
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const status = await prisma.amIOkStatus.findUnique({ where: { id: 1 } });
  return NextResponse.json(status);
}