import { type NextRequest, NextResponse } from "next/server";

const sessions = new Map<string, number>();
const SESSION_TTL_MS = 120_000;

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

export async function GET() {
	pruneExpired();
	return NextResponse.json({ count: getActiveCount() });
}

export async function POST(req: NextRequest) {
	const body = (await req.json().catch(() => ({}))) as {
		sessionId?: string;
	};
	const sessionId = body.sessionId;
	if (sessionId && typeof sessionId === "string" && sessionId.length < 64) {
		sessions.set(sessionId, Date.now());
	}
	pruneExpired();
	return NextResponse.json({ count: getActiveCount() });
}
