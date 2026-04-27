# my-profile

Personal website — [yiming1234.cn](https://yiming1234.cn)

## Stack

Vite · React 19 · TypeScript · TailwindCSS v4 · Hono · TanStack Router · Kysely · PostgreSQL · Better Auth · Cloudflare Workers

## Features

- **Home** — landing page with animated background
- **Blog** — Markdown stored in Cloudflare R2, compiled server-side with Shiki syntax highlighting and TOC generation
- **Chat** — AI assistant powered by OpenAI via Vercel AI SDK (streaming)
- **Gallery** — photo gallery sourced from Notion, masonry layout
- **Terminal** — interactive slash-command terminal (`/help` to explore)
- **Am I OK** — real-time activity status pushed from macOS every 30s
- **CV** — resume page with work, projects, and hackathons
- **Story** — personal story page with interactive map
- **Auth** — sign up, login, email verification, password reset (Better Auth + GitHub/Google OAuth)
- **llms.txt** — LLM-friendly site summary at `/llms.txt`

## Getting Started

```bash
pnpm install
cp .dev.vars.example .dev.vars   # fill in Cloudflare secrets for local dev
pnpm dev
```

> Local dev runs via `wrangler dev` (powered by `@cloudflare/vite-plugin`).  
> Secrets in `.dev.vars` are injected as `c.env` bindings automatically.

## Environment

All secrets are managed as Cloudflare Workers bindings. For local dev, put them in `.dev.vars` (gitignored). For production, use `wrangler secret put <NAME>`.

Platform bindings are declared in `wrangler.toml`:

| Binding       | Type       | Purpose                     |
| ------------- | ---------- | --------------------------- |
| `ASSETS`      | Static     | Serves the SPA              |
| `BLOG_BUCKET` | R2         | Blog Markdown files         |
| `HYPERDRIVE`  | Hyperdrive | PostgreSQL connection proxy |

Key secrets (`.dev.vars` / `wrangler secret put`):

| Variable                  | Purpose                      |
| ------------------------- | ---------------------------- |
| `BETTER_AUTH_SECRET`      | Auth secret key              |
| `BETTER_AUTH_URL`         | Auth base URL                |
| `GITHUB_CLIENT_ID/SECRET` | GitHub OAuth                 |
| `GOOGLE_CLIENT_ID/SECRET` | Google OAuth                 |
| `RESEND_API_KEY`          | Transactional email (Resend) |
| `RESEND_FROM`             | Sender address               |
| `OPENAI_API_KEY`          | AI chat                      |
| `NOTION_TOKEN`            | Gallery photos from Notion   |
| `AM_I_OK_SECRET`          | Status push API token        |

## Commands

```bash
pnpm dev          # Cloudflare Workers dev (wrangler + Vite)
pnpm build        # Production build
pnpm check        # Type check (vp check && tsgo --noEmit)
pnpm lint         # Lint (vite-plus)
pnpm format       # Format (vite-plus)
```

## Deployment

```bash
pnpm build
wrangler deploy
```

Production secrets are set per-variable:

```bash
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put RESEND_API_KEY
# ...
```

## Am I OK Agent

`scripts/am-i-ok-agent.sh` runs as a macOS LaunchAgent, POSTing current app activity every 30s:

```bash
cp scripts/cn.yiming1234.am-i-ok.plist ~/Library/LaunchAgents/
# Edit the plist: set script path, AM_I_OK_SECRET, BETTER_AUTH_URL
launchctl load ~/Library/LaunchAgents/cn.yiming1234.am-i-ok.plist
```

## Workspace

The repo is a pnpm workspace. Shared UI components live in `packages/ui`:

```
packages/ui/src/
├── components/      # CherryBlossom, HelloSignature
├── footer/          # PresenceCount, SiteAge
├── terminal/        # Interactive terminal (logic + components)
└── markdown/        # Blog compiler (Shiki, TOC) + BlogContent component
```

Shared TypeScript types (consumed by both `src/` and `server/`) live in `types/`, aliased as `@shared/`.

## License

[AGPL-v3](LICENSE)

This project contains code derived from [Taki](https://github.com/canmi21/taki) (AGPL-v3).
