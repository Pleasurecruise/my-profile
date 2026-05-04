"use client";

import { useEffect, useRef, useState } from "react";

const POLL_INTERVAL_MS = 5 * 60_000;
const HEARTBEAT_INTERVAL_MS = 60_000;
const SESSION_STORAGE_KEY = "presence-session-id";

function getSessionId(): string {
  if (typeof sessionStorage === "undefined") return crypto.randomUUID();
  let id = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_STORAGE_KEY, id);
  }
  return id;
}

export function PresenceCount() {
  const [count, setCount] = useState(1);
  const sessionId = useRef<string>("");

  useEffect(() => {
    sessionId.current = getSessionId();

    const heartbeat = () => {
      fetch("/api/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionId.current }),
        keepalive: true,
      }).catch(() => {});
    };

    const fetchCount = () => {
      fetch("/api/presence")
        .then((res) => res.json() as Promise<{ count: number }>)
        .then(({ count: n }) => setCount(n))
        .catch(() => {});
    };

    heartbeat();
    fetchCount();

    const heartbeatTimer = setInterval(heartbeat, HEARTBEAT_INTERVAL_MS);
    const pollTimer = setInterval(fetchCount, POLL_INTERVAL_MS);

    return () => {
      clearInterval(heartbeatTimer);
      clearInterval(pollTimer);
    };
  }, []);

  return (
    <p className="text-xs text-muted-foreground/50">
      <span className="tabular-nums">{count}</span> people browsing right now :)
    </p>
  );
}
