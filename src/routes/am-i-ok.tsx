import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import BlurFade from "@/components/magicui/blur-fade";
import type { AmIOkStatus } from "@/types";

export const Route = createFileRoute("/am-i-ok")({
  component: AmIOkPage,
});

const APP_ICONS: Record<string, string> = {
  "visual studio code": "https://cdn.simpleicons.org/visualstudiocode",
  code: "https://cdn.simpleicons.org/visualstudiocode",
  cursor: "https://cdn.simpleicons.org/cursor",
  intellij: "https://cdn.simpleicons.org/intellijidea",
  webstorm: "https://cdn.simpleicons.org/webstorm",
  pycharm: "https://cdn.simpleicons.org/pycharm",
  goland: "https://cdn.simpleicons.org/goland",
  clion: "https://cdn.simpleicons.org/clion",
  datagrip: "https://cdn.simpleicons.org/datagrip",
  rider: "https://cdn.simpleicons.org/rider",
  rubymine: "https://cdn.simpleicons.org/rubymine",
  phpstorm: "https://cdn.simpleicons.org/phpstorm",
  safari: "https://cdn.simpleicons.org/safari",
  chrome: "https://cdn.simpleicons.org/googlechrome",
  "google chrome": "https://cdn.simpleicons.org/googlechrome",
  firefox: "https://cdn.simpleicons.org/firefoxbrowser",
  arc: "https://arc.net/favicon.ico",
  terminal: "https://www.google.com/s2/favicons?domain=iterm2.com&sz=64",
  iterm2: "https://iterm2.com/favicon.ico",
  warp: "https://cdn.simpleicons.org/warp",
  spotify: "https://cdn.simpleicons.org/spotify",
  music: "https://cdn.simpleicons.org/applemusic",
  figma: "https://cdn.simpleicons.org/figma",
  slack: "https://cdn.simpleicons.org/slack",
  discord: "https://cdn.simpleicons.org/discord",
  wechat: "https://cdn.simpleicons.org/wechat",
  telegram: "https://cdn.simpleicons.org/telegram",
  lark: "https://www.larksuite.com/favicon.ico",
  feishu: "https://www.feishu.cn/favicon.ico",
  zoom: "https://cdn.simpleicons.org/zoom",
  outlook: "https://cdn.simpleicons.org/microsoftoutlook",
  mail: "https://www.google.com/s2/favicons?domain=mail.apple.com&sz=64",
  claude: "https://cdn.simpleicons.org/anthropic",
  "cherry studio": "https://cherry-ai.com/favicon.ico",
  lobe: "https://lobehub.com/favicon.ico",
  codex: "https://cdn.simpleicons.org/openai",
  chatgpt: "https://cdn.simpleicons.org/openai",
  obsidian: "https://cdn.simpleicons.org/obsidian",
  notion: "https://cdn.simpleicons.org/notion",
  notes: "https://www.google.com/s2/favicons?domain=apple.com&sz=64",
  bilibili: "https://cdn.simpleicons.org/bilibili",
  youtube: "https://cdn.simpleicons.org/youtube",
  finder: "https://www.google.com/s2/favicons?domain=apple.com&sz=64",
};

const INVERT_IN_DARK = new Set([
  "visual studio code",
  "code",
  "cursor",
  "intellij",
  "webstorm",
  "pycharm",
  "goland",
  "clion",
  "datagrip",
  "rider",
  "rubymine",
  "phpstorm",
  "notion",
  "claude",
  "codex",
  "chatgpt",
  "warp",
  "zoom",
]);

function getAppIcon(appName: string): { url: string; invert: boolean } | null {
  const lower = appName.toLowerCase();
  for (const [key, url] of Object.entries(APP_ICONS)) {
    if (lower.includes(key)) return { url, invert: INVERT_IN_DARK.has(key) };
  }
  return null;
}

function isOnline(updatedAt: string): boolean {
  return Date.now() - new Date(updatedAt).getTime() < 5 * 60 * 1000;
}

function timeAgo(updatedAt: string): string {
  const diff = Math.floor((Date.now() - new Date(updatedAt).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function AmIOkPage() {
  const [status, setStatus] = useState<AmIOkStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/am-i-ok");
      const data = (await res.json()) as AmIOkStatus | null;
      setStatus(data);
    } catch {
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchStatus();
    const interval = setInterval(() => void fetchStatus(), 30_000);
    return () => clearInterval(interval);
  }, []);

  const online = status ? isOnline(status.updatedAt) : false;
  const apps = status?.apps ?? [];

  return (
    <main className="flex flex-col space-y-6">
      <BlurFade delay={0}>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Am I OK?</h1>
          <p className="text-muted-foreground text-sm">
            What I&apos;m currently doing, updated in real-time.
          </p>
        </div>
      </BlurFade>

      <BlurFade delay={0.04}>
        {loading ? (
          <div className="rounded-xl border p-6 h-36 animate-pulse bg-muted/30" />
        ) : !status || !online ? (
          <div className="rounded-xl border p-6 text-muted-foreground text-sm">No status yet.</div>
        ) : (
          <div className="rounded-xl border p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">Online</span>
            </div>
            <div className="flex items-center gap-4">
              {apps.map((appName, i) => {
                const icon = getAppIcon(appName);
                return (
                  <div key={appName} className="flex items-center gap-3">
                    {i > 0 && <div className="h-8 w-px bg-border" />}
                    {icon ? (
                      <img
                        src={icon.url}
                        alt={appName}
                        className={`size-9 rounded-lg object-contain${icon.invert ? " dark:invert" : ""}`}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-3xl">🖥️</span>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {i === 0 ? "Currently using" : "Also open"}
                      </p>
                      <p className="text-lg font-semibold leading-tight">{appName}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              on {status.deviceName} · {timeAgo(status.updatedAt)}
            </p>
          </div>
        )}
      </BlurFade>
    </main>
  );
}
