import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import prisma from "@/server/prisma";

const bodySchema = z.object({
	app: z.string().optional(),
	apps: z.array(z.string()).optional(),
	device: z.string().optional(),
});

export async function POST(req: NextRequest) {
	const auth = req.headers.get("Authorization");
	if (auth !== `Bearer ${env.AM_I_OK_SECRET}`) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const parsed = bodySchema.safeParse(await req.json());
	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Invalid request body" },
			{ status: 400 },
		);
	}

	const body = parsed.data;
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
