# my-profile

Personal website — [you-find.me](https://you-find.me)

## Stack

Vite+ · Void · React 19 · TypeScript · TailwindCSS v4 · Hono · TanStack Router · PostgreSQL · Better Auth · Cloudflare Workers

## Features

- **Home** — landing page with animated background
- **Blog** — Markdown stored in Cloudflare R2, compiled server-side with Shiki syntax highlighting and TOC generation
- **Chat** — authenticated AI assistant with OpenAI-compatible streaming
- **Gallery** — photo gallery sourced from Cloudflare R2, masonry layout
- **Terminal** — interactive slash-command terminal (`/help` to explore)
- **CV** — resume page with work, projects, and hackathons
- **Story** — personal story page with interactive map
- **Auth** — sign up, login, email verification, password reset (Better Auth + GitHub/Google OAuth)

## Getting Started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

`pnpm dev` runs Vite+ with `voidPlugin()`. Void uses Cloudflare's Vite runtime internally, so application development does not invoke `wrangler dev` directly.

## Environment

This project splits runtime values by source.

- `env.ts` declares and validates application environment variables.
- `.env.local` contains local values, including `DATABASE_URL` and local secrets. It is ignored by Git.
- `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE=postgresql://user:password@localhost:5432/database` lets Wrangler emulate the production `HYPERDRIVE` binding locally without duplicating the connection string.
- Non-sensitive production defaults and Cloudflare resource bindings live in `wrangler.jsonc`.
- Production secrets are uploaded to Cloudflare with `wrangler secret put`.
- Production builds do not load `.env.local`; runtime secrets stay in Cloudflare encrypted bindings.

Remote/prod bindings are declared in `wrangler.jsonc`:

| Binding        | Type       | Purpose                       |
| -------------- | ---------- | ----------------------------- |
| `ASSETS`       | Static     | Serves the SPA                |
| `BLOG_BUCKET`  | R2         | Blog Markdown files           |
| `HYPERDRIVE`   | Hyperdrive | PostgreSQL connection proxy   |
| `KV_NAMESPACE` | KV         | Blog, feed, and sitemap cache |

Runtime env values:

| Variable         | Purpose                      |
| ---------------- | ---------------------------- |
| `OPENAI_API_URL` | Custom OpenAI-compatible URL |
| `OPENAI_MODEL`   | Default chat model           |
| `RESEND_FROM`    | Sender address               |

Worker secrets:

| Variable             | Purpose         |
| -------------------- | --------------- |
| `BETTER_AUTH_SECRET` | Auth secret key |

Local `.env.local` / production secret bindings:

| Variable               | Purpose                      |
| ---------------------- | ---------------------------- |
| `GITHUB_CLIENT_ID`     | GitHub OAuth client ID       |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret   |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID       |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret   |
| `RESEND_API_KEY`       | Transactional email (Resend) |
| `OPENAI_API_KEY`       | AI chat                      |

Required production secrets:

- `BETTER_AUTH_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `RESEND_API_KEY`
- `OPENAI_API_KEY`

## Commands

```bash
pnpm dev          # Local dev via Vite+ and Void
pnpm build        # Client build + wrangler dry-run deploy
pnpm deploy       # Build and deploy with Wrangler
pnpm check        # Format, lint, and type checks
pnpm lint         # Lint (vite-plus)
pnpm format       # Format (vite-plus)
```

## Deployment

```bash
pnpm deploy
```

Production runtime values are split by binding type:

```bash
# Non-sensitive runtime values and resource bindings are declared in wrangler.jsonc
# Local values live in .env.local
# Production secrets can be added with `wrangler secret put <NAME>`
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
