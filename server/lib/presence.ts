const sessions = new Map<string, number>();
const SESSION_TTL_MS = 180_000;

export function touchPresence(sessionId: string): void {
  sessions.set(sessionId, Date.now());
}

export function getActivePresenceCount(): number {
  const now = Date.now();
  let count = 0;
  for (const lastSeen of sessions.values()) {
    if (now - lastSeen < SESSION_TTL_MS) count++;
  }
  return Math.max(1, count);
}

export function pruneExpiredPresence(): void {
  const now = Date.now();
  for (const [id, lastSeen] of sessions) {
    if (now - lastSeen >= SESSION_TTL_MS) sessions.delete(id);
  }
}
