import { NextRequest, NextResponse } from "next/server";

interface Status {
  apps: string[];
  deviceName: string;
  updatedAt: string;
}

let currentStatus: Status | null = null;

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

  // Support both legacy `app` (single) and new `apps` (array)
  const apps = body.apps ?? (body.app ? [body.app] : []);

  currentStatus = {
    apps: apps.slice(0, 2),
    deviceName: body.device ?? "MacBook",
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json(currentStatus);
}