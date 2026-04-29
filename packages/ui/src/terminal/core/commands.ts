import type { TerminalConfig } from "./config";
import type { SelectorItem, SlashCommandResult } from "./types";

const FORTUNES = [
  "There are only 10 types of people:\n  those who understand binary, and those who don't.",
  "99 little bugs in the code...\n99 little bugs.\nTake one down, patch it around...\n127 little bugs in the code.",
  "It works on my machine.\nShip the machine.",
  "Talk is cheap. Show me the code.\n  — Linus Torvalds",
  "Any fool can write code a computer can understand.\nGood programmers write code humans can understand.",
  "The best error message is the one that never shows up.",
  "A user interface is like a joke.\nIf you have to explain it, it's not that good.",
  "First, solve the problem. Then, write the code.\n  — John Johnson",
];

export const TOP_COMMANDS: SelectorItem[] = [
  { label: "/help", value: "/help", desc: "Show all commands" },
  { label: "/skills", value: "/skills", desc: "Tech stack" },
  { label: "/social", value: "/social", desc: "Social links" },
  { label: "/contact", value: "/contact", desc: "Contact info" },
  { label: "/projects", value: "/projects", desc: "List projects" },
  { label: "/links", value: "/links", desc: "Friend links" },
  { label: "/am-i-ok", value: "/am-i-ok", desc: "What am I doing right now" },
  { label: "/dino", value: "/dino", desc: "Play Chrome Dino" },
  { label: "/go", value: "/go ", desc: "Navigate to a page →" },
  { label: "/reload", value: "/reload", desc: "Reload the page" },
];

function getGoDestinations(config: TerminalConfig): SelectorItem[] {
  return Object.keys(config.routes).map((key) => ({
    label: key,
    value: `/go ${key}`,
    desc: key.charAt(0).toUpperCase() + key.slice(1),
  }));
}

export function getSelectorItems(input: string, config: TerminalConfig): SelectorItem[] {
  const lower = input.toLowerCase();
  if (lower === "/go" || lower.startsWith("/go ")) {
    const partial = lower.slice(4);
    return getGoDestinations(config).filter((d) => d.label.startsWith(partial));
  }
  if (lower.startsWith("/")) {
    return TOP_COMMANDS.filter((c) => c.value.startsWith(lower));
  }
  return [];
}

function buildHelpText(config: TerminalConfig): string {
  const routeNames = Object.keys(config.routes).join(" | ");
  return `Available slash commands:
  /help        - Show this help message
  /skills      - Tech stack
  /social      - Social media links
  /contact     - Contact info (email)
  /projects    - List projects
  /links       - Friend links
  /am-i-ok     - What am I doing right now
  /dino        - Play Chrome Dino
  /go <page>   - Navigate  (${routeNames || "..."})
  /reload      - Reload the page`;
}

export function resolveCommand(
  slug: string,
  rest: string,
  config: TerminalConfig,
): SlashCommandResult | null {
  const routes = config.routes;
  const hostname = config.hostname;

  switch (slug) {
    case "help":
      return { kind: "text", text: buildHelpText(config) };

    case "skills":
      return {
        kind: "text",
        text: `Tech Stack:\n  ${config.skills.join("  |  ")}`,
      };

    case "social":
      return {
        kind: "links",
        items: config.social
          .filter((s) => s.url !== "#")
          .map((s) => ({ label: s.name.padEnd(10), url: s.url })),
      };

    case "contact":
      return {
        kind: "links",
        items: [
          { label: "Email     ", url: `mailto:${config.contact.email}` },
          ...(config.contact.telegram
            ? [
                {
                  label: "Telegram  ",
                  url: `https://t.me/${config.contact.telegram.replace(/^@/, "")}`,
                },
              ]
            : []),
          ...(config.contact.wechat
            ? [{ label: "WeChat    ", url: `wechat:${config.contact.wechat}` }]
            : []),
        ],
      };

    case "projects":
      return {
        kind: "text",
        text:
          "Projects:\n" +
          config.projects
            .map((p, i) => `  ${String(i + 1).padStart(2, "0")}. ${p.title}  (${p.dates})`)
            .join("\n"),
      };

    case "links":
      return {
        kind: "links",
        items: config.friends.map((f) => ({
          label: f.name.padEnd(20),
          url: f.url,
        })),
      };

    case "dino":
      return { kind: "dino" };

    case "go": {
      const dest = rest.trim().toLowerCase();
      const path = routes[dest];
      if (path) return { kind: "navigate", path };
      if (!dest) {
        return {
          kind: "text",
          text: `Usage: /go <page>\nAvailable: ${Object.keys(routes).join(" | ")}`,
        };
      }
      return {
        kind: "text",
        text: `go: unknown destination '${dest}'\nAvailable: ${Object.keys(routes).join(" | ")}`,
      };
    }

    case "clear":
      return { kind: "clear" };

    case "reload":
      return { kind: "navigate", path: "__reload__" };

    case "ping": {
      const target = rest.trim() || hostname.split("@")[1] || hostname;
      return {
        kind: "stream",
        items: [
          { text: `PING ${target} (127.0.0.1): 56 data bytes`, delay: 0 },
          {
            text: `64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.042 ms`,
            delay: 1000,
          },
          {
            text: `64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.038 ms`,
            delay: 2000,
          },
          {
            text: `64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.041 ms`,
            delay: 3000,
          },
          { text: `--- ${target} ping statistics ---`, delay: 3800 },
          {
            text: `3 packets transmitted, 3 received, 0% packet loss`,
            delay: 4200,
          },
        ],
      };
    }

    case "sudo": {
      if (!rest.trim()) {
        return {
          kind: "text",
          text: `usage: sudo [-AbEHnPS] [-u user] [command]`,
        };
      }
      return { kind: "sudo", command: rest };
    }

    case "rm": {
      if (rest.includes("-r") || rest.includes("--recursive")) {
        return {
          kind: "stream",
          items: [
            { text: `Scanning filesystem...`, delay: 0 },
            { text: `Found 284,193 files.`, delay: 1000 },
            { text: `Deleting /usr/bin  [████████████] 100%`, delay: 1800 },
            { text: `Deleting /etc      [████████████] 100%`, delay: 2400 },
            { text: `Deleting /home     [█████░░░░░░░]  44%`, delay: 3000 },
            { text: ``, delay: 3600 },
            {
              text: `KERNEL PANIC — not syncing: VFS: Unable to mount root fs`,
              delay: 4200,
            },
            { text: ``, delay: 4800 },
            {
              text: `...jk. Operation cancelled. Your files are safe. Phew.`,
              delay: 5400,
            },
          ],
        };
      }
      return {
        kind: "text",
        text: `rm: missing operand\nTry '/help' for available commands.`,
      };
    }

    case "whoami":
      return {
        kind: "text",
        text: `visitor\nuid=1337(visitor) gid=0(guests) groups=0(guests),42(humans)\n\nYou are a curious visitor exploring this website. Welcome!`,
      };

    case "date": {
      const now = new Date();
      return { kind: "text", text: now.toUTCString().replace("GMT", "UTC") };
    }

    case "uname":
      return {
        kind: "text",
        text:
          `Linux ${hostname.split("@")[1] ?? hostname} 6.6.0-website #1 SMP PREEMPT_DYNAMIC\n` +
          `Next.js 16 / React 19 / TypeScript — running in your browser`,
      };

    case "neofetch": {
      const host = hostname.split("@");
      const user = host[0] ?? "user";
      const site = host[1] ?? hostname;
      return {
        kind: "text",
        text: [
          `        ·:·         ${user}@${site}`,
          `      ·'   '·       ──────────────────────────`,
          `    .'  ╔══╗  '.    OS:       Website OS (Next.js 16)`,
          `   /   ╔╝  ╚╗   \\  Host:     Vercel Edge Network`,
          `  |    ║    ║    |  Kernel:   React 19.0.0`,
          `   \\   ╚╗  ╔╝   /  Shell:    zsh + terminal.tsx`,
          `    '.  ╚══╝  .'   DE:       TailwindCSS v4`,
          `      '·   ·'      WM:       Framer Motion`,
          `        '·'        Terminal: This one right here`,
          `                   CPU:      V8 @ browser speed`,
        ].join("\n"),
      };
    }

    case "hack":
      return {
        kind: "stream",
        items: [
          { text: `Initializing hack sequence...`, delay: 0 },
          { text: `[████░░░░░░░░░░░░░░░░]  20%`, delay: 600 },
          { text: `[████████░░░░░░░░░░░░]  40%`, delay: 1200 },
          { text: `[████████████░░░░░░░░]  60%`, delay: 1800 },
          { text: `[████████████████░░░░]  80%`, delay: 2400 },
          { text: `[████████████████████] 100%`, delay: 3000 },
          { text: ``, delay: 3400 },
          { text: `ACCESS GRANTED`, delay: 3800 },
          { text: ``, delay: 4200 },
          {
            text: `jk — there's nothing to hack here. Try /dino instead.`,
            delay: 4800,
          },
        ],
      };

    case "exit":
    case "quit":
      return {
        kind: "text",
        text: `logout\nThere is no escape. You are already here.\n(Tip: /clear resets the terminal)`,
      };

    case "apt":
    case "apt-get": {
      const sub = rest.trim().toLowerCase();
      const subcmd = sub.split(/\s+/)[0];
      const pkg = sub.split(/\s+/).slice(1).join(" ");

      if (subcmd === "update") {
        return {
          kind: "stream",
          items: [
            {
              text: `Hit:1 https://${hostname.split("@")[1] ?? hostname} stable InRelease`,
              delay: 0,
            },
            {
              text: `Get:2 https://${hostname.split("@")[1] ?? hostname} stable/main Packages [1,337 kB]`,
              delay: 600,
            },
            { text: `Fetched 1,337 kB in 0s (∞ kB/s)`, delay: 1200 },
            { text: `Reading package lists... Done`, delay: 1800 },
            { text: `Building dependency tree... Done`, delay: 2200 },
            { text: `All packages are up to date.`, delay: 2600 },
          ],
        };
      }
      if (subcmd === "upgrade") {
        return {
          kind: "stream",
          items: [
            { text: `Reading package lists... Done`, delay: 0 },
            { text: `Building dependency tree... Done`, delay: 400 },
            { text: `Calculating upgrade... Done`, delay: 800 },
            {
              text: `The following packages will be upgraded:\n  nextjs  react  typescript  tailwindcss`,
              delay: 1200,
            },
            {
              text: `4 upgraded, 0 newly installed, 0 to remove.`,
              delay: 1800,
            },
            { text: `Processing: nextjs (16.1.7) ...`, delay: 2400 },
            { text: `Processing: react (19.1.0) ...`, delay: 2900 },
            { text: `Processing: typescript (5.8.0) ...`, delay: 3400 },
            { text: `Processing: tailwindcss (4.1.0) ...`, delay: 3900 },
            {
              text: `Done. This website is now 10% more awesome.`,
              delay: 4600,
            },
          ],
        };
      }
      if (subcmd === "install") {
        if (!pkg)
          return {
            kind: "text",
            text: `${slug}: 'install' requires at least one package name`,
          };
        return {
          kind: "stream",
          items: [
            { text: `Reading package lists... Done`, delay: 0 },
            { text: `Building dependency tree... Done`, delay: 400 },
            {
              text: `The following NEW packages will be installed:\n  ${pkg}`,
              delay: 800,
            },
            {
              text: `0 upgraded, 1 newly installed, 0 to remove.`,
              delay: 1200,
            },
            { text: `Fetching ${pkg}...`, delay: 1600 },
            { text: `Unpacking ${pkg} ...`, delay: 2200 },
            { text: `Setting up ${pkg} ...`, delay: 2800 },
            {
              text: `Hmm, ${pkg} is already running in your browser.`,
              delay: 3400,
            },
          ],
        };
      }
      if (subcmd === "remove" || subcmd === "purge") {
        const target = sub.split(/\s+/).slice(1).join(" ") || "???";
        return {
          kind: "stream",
          items: [
            { text: `Reading package lists... Done`, delay: 0 },
            {
              text: `The following packages will be REMOVED:\n  ${target}`,
              delay: 500,
            },
            { text: `Removing ${target} ...`, delay: 1200 },
            {
              text: `Error: cannot remove ${target} — it's load-bearing.`,
              delay: 2000,
            },
            {
              text: `This website would cease to exist. Operation aborted.`,
              delay: 2600,
            },
          ],
        };
      }
      if (!subcmd)
        return {
          kind: "text",
          text: `Usage: apt [update | upgrade | install <pkg> | remove <pkg>]`,
        };
      return {
        kind: "text",
        text: `${slug}: invalid operation ${subcmd}\nUsage: apt [update | upgrade | install <pkg> | remove <pkg>]`,
      };
    }

    case "cd": {
      const dest = rest.trim().toLowerCase().replace(/^\//, "");
      const path = routes[dest];
      if (path) return { kind: "navigate", path };
      if (!dest || dest === "~" || dest === "..")
        return { kind: "text", text: `You're already home.` };
      return {
        kind: "text",
        text: `cd: ${rest.trim()}: No such directory\nAvailable: ${Object.keys(routes).join("  ")}`,
      };
    }

    case "reboot":
    case "shutdown":
      return {
        kind: "stream",
        items: [
          {
            text: `Broadcast message from root@${hostname.split("@")[1] ?? hostname}`,
            delay: 0,
          },
          { text: `The system will reboot NOW!`, delay: 600 },
          { text: `[ OK ] Stopped Next.js app router.`, delay: 1200 },
          { text: `[ OK ] Stopped React renderer.`, delay: 1700 },
          { text: `[ OK ] Unmounting virtual filesystem...`, delay: 2200 },
          { text: `[ OK ] Reached target Power-Off.`, delay: 2800 },
          { text: ``, delay: 3400 },
          { text: `...just kidding. Everything is still here.`, delay: 4000 },
        ],
      };

    case "node":
      return rest.trim() === "-v" || rest.trim() === "--version"
        ? { kind: "text", text: `v22.14.0` }
        : { kind: "text", text: `Try: node -v` };

    case "npm":
      return rest.trim() === "-v" || rest.trim() === "--version"
        ? { kind: "text", text: `10.9.2` }
        : { kind: "text", text: `Try: npm -v` };

    case "pnpm":
      return rest.trim() === "-v" || rest.trim() === "--version"
        ? { kind: "text", text: `10.6.5` }
        : { kind: "text", text: `Try: pnpm -v` };

    case "yarn":
      return rest.trim() === "-v" || rest.trim() === "--version"
        ? { kind: "text", text: `4.7.0` }
        : { kind: "text", text: `Try: yarn -v` };

    case "pip":
    case "pip3":
      return rest.trim() === "-v" || rest.trim() === "--version" || rest.trim() === "-V"
        ? {
            kind: "text",
            text: `pip 25.0.1 from /usr/lib/python3.13/site-packages/pip (python 3.13)`,
          }
        : { kind: "text", text: `Try: pip --version` };

    case "bun":
      return rest.trim() === "-v" || rest.trim() === "--version"
        ? { kind: "text", text: `1.2.4` }
        : { kind: "text", text: `Try: bun -v` };

    case "python":
    case "python3":
      return rest.trim() === "-v" || rest.trim() === "--version" || rest.trim() === "-V"
        ? { kind: "text", text: `Python 3.13.2` }
        : { kind: "text", text: `Try: python --version` };

    case "rustc":
    case "cargo":
      return rest.trim() === "-v" || rest.trim() === "--version" || rest.trim() === "-V"
        ? { kind: "text", text: `${slug} 1.85.0 (4d91de4e4 2025-02-17)` }
        : { kind: "text", text: `Try: ${slug} --version` };

    case "rustup": {
      const flag = rest.trim();
      if (flag === "-v" || flag === "--version")
        return { kind: "text", text: `rustup 1.28.1 (2024-12-19)` };
      if (flag === "show")
        return {
          kind: "text",
          text: `Default host: x86_64-unknown-browser\nstable-x86_64-unknown-browser (default)\nrustc 1.85.0 (4d91de4e4 2025-02-17)`,
        };
      return { kind: "text", text: `Try: rustup --version` };
    }

    case "ls": {
      const flag = rest.trim().toLowerCase();
      if (flag === "-la" || flag === "-al" || flag === "-a" || flag === "-l") {
        const dirs = Object.keys(routes);
        return {
          kind: "text",
          text: [
            ...dirs.map((d) => `drwxr-xr-x  visitor  visitors   ${d}/`),
            `-rw-r--r--  visitor  visitors   package.json`,
            `-rw-r--r--  visitor  visitors   README.md`,
          ].join("\n"),
        };
      }
      return {
        kind: "text",
        text: `${Object.keys(routes)
          .map((d) => `${d}/`)
          .join("  ")}  package.json  README.md`,
      };
    }

    case "pwd":
      return { kind: "text", text: `/home/visitor/website` };

    case "echo":
      return { kind: "text", text: rest.trim() };

    case "cat": {
      const file = rest.trim().toLowerCase();
      if (file === "readme.md" || file === "readme") {
        return {
          kind: "text",
          text: `# ${hostname}\n\nA personal website built with Next.js, TypeScript,\nTailwindCSS, and a sprinkle of chaos.\n\nTry /help for available commands.`,
        };
      }
      if (file === "package.json") {
        return {
          kind: "text",
          text: `{\n  "name": "website",\n  "version": "0.1.0",\n  "scripts": {\n    "dev": "next dev --turbopack",\n    "build": "next build"\n  }\n}`,
        };
      }
      if (!file) return { kind: "text", text: `cat: missing file operand` };
      return {
        kind: "text",
        text: `cat: ${rest.trim()}: No such file or directory`,
      };
    }

    case "git": {
      const sub = rest.trim().toLowerCase();
      if (sub === "status") {
        return {
          kind: "text",
          text: `On branch main\nYour branch is up to date with 'origin/main'.\n\nnothing to commit, working tree clean`,
        };
      }
      if (sub === "log" || sub === "log --oneline") {
        return {
          kind: "text",
          text: [
            `5067e91 fix: upgrade Tailwind to v4; update deps and lockfile`,
            `891e13f feat: switch to pnpm and update mapbox patch`,
            `6b9365c fix: resolve eslint errors and update dependencies`,
            `f472d9f feat: add LeedsHack 2026 assets and data`,
            `cd0dcd0 fix: bump next.js to 16.1.6 and refresh lockfile`,
          ].join("\n"),
        };
      }
      if (sub === "pull" || sub === "pull origin main") {
        return {
          kind: "stream",
          items: [
            { text: `remote: Enumerating objects: 5, done.`, delay: 0 },
            { text: `remote: Counting objects: 100% (5/5), done.`, delay: 500 },
            { text: `Unpacking objects: 100% (5/5), done.`, delay: 1000 },
            { text: `From github.com:${hostname}`, delay: 1400 },
            { text: `   5067e91..HEAD  main -> origin/main`, delay: 1700 },
            { text: `Already up to date.`, delay: 2100 },
          ],
        };
      }
      if (sub === "push" || sub === "push origin main") {
        return {
          kind: "stream",
          items: [
            { text: `Enumerating objects: 3, done.`, delay: 0 },
            { text: `Counting objects: 100% (3/3), done.`, delay: 500 },
            {
              text: `Writing objects: 100% (3/3), 1.33 KiB | 1.33 MiB/s`,
              delay: 1000,
            },
            { text: `To github.com:${hostname}.git`, delay: 1600 },
            { text: `   5067e91..HEAD  main -> main`, delay: 1900 },
          ],
        };
      }
      if (!sub)
        return {
          kind: "text",
          text: `usage: git [status | log | pull | push]`,
        };
      return {
        kind: "text",
        text: `git: '${sub}' is not a git command. Try 'git status'.`,
      };
    }

    case "curl": {
      const url = (rest.trim() || (hostname.split("@")[1] ?? hostname)).replace(/^https?:\/\//, "");
      return {
        kind: "stream",
        items: [
          { text: `  % Total    % Received  Xferd  Average  Speed`, delay: 0 },
          {
            text: `100  1337  100  1337    0     0   ∞MB/s   0:00:00`,
            delay: 600,
          },
          { text: ``, delay: 800 },
          { text: `<!DOCTYPE html>`, delay: 1000 },
          { text: `<html lang="en">`, delay: 1100 },
          { text: `  <head><title>${url}</title></head>`, delay: 1200 },
          { text: `  <body><!-- hi there 👋 --></body>`, delay: 1300 },
          { text: `</html>`, delay: 1400 },
        ],
      };
    }

    case "wget": {
      const url = rest.trim() || `https://${hostname.split("@")[1] ?? hostname}`;
      const host = url.replace(/^https?:\/\//, "").split("/")[0] ?? hostname;
      const file =
        url
          .split("/")
          .pop()
          ?.replace(/[?#].*/, "") || "index.html";
      const date = new Date().toISOString().replace("T", " ").slice(0, 19);
      return {
        kind: "stream",
        items: [
          { text: `--${date}--  ${url}`, delay: 0 },
          { text: `Resolving ${host}... 76.76.21.21`, delay: 400 },
          {
            text: `Connecting to ${host}|76.76.21.21|:443... connected.`,
            delay: 900,
          },
          {
            text: `HTTP request sent, awaiting response... 200 OK`,
            delay: 1400,
          },
          { text: `Length: 1337 (1.3K) [text/html]`, delay: 1700 },
          { text: `Saving to: '${file}'`, delay: 1900 },
          { text: ``, delay: 2100 },
          {
            text: `${file.padEnd(20)} 100%[===================>]   1.3K  --.-KB/s    in 0s`,
            delay: 2400,
          },
          { text: ``, delay: 2700 },
          {
            text: `${date} (∞ MB/s) - '${file}' saved [1337/1337]`,
            delay: 2900,
          },
        ],
      };
    }

    case "am-i-ok":
      return {
        kind: "fetch",
        url: config.amIOkUrl ?? "/api/am-i-ok",
        format: (data) => {
          if (!data || typeof data !== "object") return "No status available.";
          const d = data as {
            apps?: string[];
            appName?: string;
            deviceName?: string;
            updatedAt?: string;
          };
          const apps = d.apps ?? (d.appName ? [d.appName] : []);
          const device = d.deviceName ?? "unknown";
          const updatedAt = d.updatedAt ? new Date(d.updatedAt) : null;
          const diffSec = updatedAt ? Math.floor((Date.now() - updatedAt.getTime()) / 1000) : null;
          const online = diffSec !== null && diffSec < 300;
          const ago =
            diffSec === null
              ? "unknown"
              : diffSec < 60
                ? `${diffSec}s ago`
                : diffSec < 3600
                  ? `${Math.floor(diffSec / 60)}m ago`
                  : `${Math.floor(diffSec / 3600)}h ago`;
          const statusDot = online ? "● online" : "○ offline";
          const appsLine =
            apps.length === 0 ? "—" : apps.length === 1 ? apps[0] : `${apps[0]}  |  ${apps[1]}`;
          return [statusDot, `apps   : ${appsLine}`, `device : ${device}`, `updated: ${ago}`].join(
            "\n",
          );
        },
      };

    case "fortune":
      return {
        kind: "text",
        text: FORTUNES[Math.floor(Math.random() * FORTUNES.length)] ?? "Fortune unavailable.",
      };

    case "vim":
      return {
        kind: "text",
        text:
          `Vim opened. Now you can never leave.\n\n` +
          `  ~\n  ~\n  ~\n  ~\n\n` +
          `Type :q! to quit... just kidding, that won't work here.\n` +
          `/clear to escape.`,
      };

    case "yes":
      return {
        kind: "text",
        text: `${Array(16).fill("y").join("\n")}\n... (^C to stop — just kidding, use /clear)`,
      };

    default:
      return null;
  }
}
