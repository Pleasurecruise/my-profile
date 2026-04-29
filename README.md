# my-profile

Personal website — [you-find.me](https://you-find.me)

## Stack

Vite · React 19 · TypeScript · TailwindCSS v4 · Hono · TanStack Router · Drizzle ORM · PostgreSQL · Better Auth · Cloudflare Workers

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

## Getting Started

```bash
pnpm install
cp .dev.vars.example .dev.vars   # fill in Cloudflare secrets for local dev
pnpm dev
```

> Local dev runs via `wrangler dev` (powered by `@cloudflare/vite-plugin`).  
> `pnpm dev` runs `vp dev`; `pnpm dev:wrangler` runs `wrangler dev --remote`. Both read `wrangler.toml`, and `.dev.vars` is injected as `c.env` bindings automatically.

## Environment

This project splits runtime values by source.

- Non-sensitive runtime defaults live in `wrangler.toml` under `[vars]`: `BETTER_AUTH_URL`, `OPENAI_API_URL`, `OPENAI_MODEL`, `RESEND_FROM`, `VITE_MAPBOX_TOKEN`
- Local secrets and local overrides live in `.dev.vars`: `BETTER_AUTH_URL`, `AM_I_OK_SECRET`, `BETTER_AUTH_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY`, `NOTION_TOKEN`, `OPENAI_API_KEY`
- Cloudflare binding types are declared in `server/types/cloudflare-env.d.ts`

Remote/prod bindings are declared in `wrangler.toml`:

| Binding       | Type       | Purpose                     |
| ------------- | ---------- | --------------------------- |
| `ASSETS`      | Static     | Serves the SPA              |
| `BLOG_BUCKET` | R2         | Blog Markdown files         |
| `HYPERDRIVE`  | Hyperdrive | PostgreSQL connection proxy |

Runtime env values:

| Variable            | Purpose                      |
| ------------------- | ---------------------------- |
| `BETTER_AUTH_URL`   | Auth base URL                |
| `OPENAI_API_URL`    | Custom OpenAI-compatible URL |
| `OPENAI_MODEL`      | Default chat model           |
| `RESEND_FROM`       | Sender address               |
| `VITE_MAPBOX_TOKEN` | Map token returned to client |

Worker secrets:

| Variable             | Purpose               |
| -------------------- | --------------------- |
| `AM_I_OK_SECRET`     | Status push API token |
| `BETTER_AUTH_SECRET` | Auth secret key       |

Local `.dev.vars` / production secret bindings:

| Variable               | Purpose                      |
| ---------------------- | ---------------------------- |
| `GITHUB_CLIENT_ID`     | GitHub OAuth client ID       |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret   |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID       |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret   |
| `RESEND_API_KEY`       | Transactional email (Resend) |
| `OPENAI_API_KEY`       | AI chat                      |
| `NOTION_TOKEN`         | Gallery photos from Notion   |

Required secrets declared in `wrangler.toml`:

- `AM_I_OK_SECRET`
- `BETTER_AUTH_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `RESEND_API_KEY`
- `NOTION_TOKEN`
- `OPENAI_API_KEY`

## Commands

```bash
pnpm dev          # Local dev via vite-plus + Cloudflare plugin
pnpm dev:wrangler # Remote Workers dev
pnpm build        # Client build + wrangler dry-run deploy
pnpm check        # Type check (vp check && tsgo --noEmit)
pnpm lint         # Lint (vite-plus)
pnpm format       # Format (vite-plus)
```

## Deployment

```bash
pnpm build
wrangler deploy
```

Production runtime values are split by binding type:

```bash
# Non-sensitive runtime values are declared in wrangler.toml [vars]
# Resource bindings (ASSETS / BLOG_BUCKET / HYPERDRIVE) are declared in wrangler.toml
# Local secret values live in .dev.vars
# Production secrets can be added with `wrangler secret put <NAME>`
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
