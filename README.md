# my-profile

Personal website — [you-find.me](https://you-find.me)

## Stack

Vite+ · Void · React 19 · TypeScript · TailwindCSS v4 · Hono · TanStack Router · PostgreSQL · Better Auth · Cloudflare Workers

## Features

- **Home** — landing page with animated background
- **Social** — multilingual follow policy, social accounts, contact details, and sponsorship
- **Chat** — authenticated Pi Agent chat with typed NDJSON streaming
- **Terminal** — interactive slash-command terminal (`/help` to explore)
- **CV** — resume page with work, projects, and hackathons
- **Story** — personal story page with interactive map
- **Auth** — sign up, login, email verification, password reset (Better Auth + GitHub/Google OAuth)

## Getting Started

```bash
pnpm install
pnpm dev
```

Create a gitignored `.env` with the local values declared in `env.ts` (including `DATABASE_URL`
for the local PostgreSQL instance) before running `pnpm dev`.

`pnpm dev` runs Vite+ with `voidPlugin()`. Void uses Cloudflare's Vite runtime internally, so application development does not invoke `wrangler dev` directly.

## Environment

This project splits runtime values by source.

- `env.ts` declares and validates application environment variables.
- `.env` contains local values, including `DATABASE_URL` and local secrets. It is ignored by Git.
- `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE=postgresql://user:password@localhost:5432/database` lets Wrangler emulate the production `HYPERDRIVE` binding locally without duplicating the connection string.
- Cloudflare resource bindings live in `wrangler.json`.
- Every server-side value (including non-sensitive configuration) is uploaded to Cloudflare with
  `wrangler secret put` (or `void secret put`).
- Production builds do not load `.env`; runtime secrets stay in Cloudflare encrypted bindings.

Remote/prod bindings are declared in `wrangler.json`:

| Binding      | Type       | Purpose                     |
| ------------ | ---------- | --------------------------- |
| `ASSETS`     | Static     | Serves the SPA              |
| `HYPERDRIVE` | Hyperdrive | PostgreSQL connection proxy |

Runtime env values (all stored as Cloudflare secrets):

| Variable         | Purpose                      |
| ---------------- | ---------------------------- |
| `OPENAI_API_URL` | Custom OpenAI-compatible URL |
| `OPENAI_MODEL`   | Default chat model           |
| `RESEND_FROM`    | Sender address               |

Worker secrets:

| Variable             | Purpose                    |
| -------------------- | -------------------------- |
| `BETTER_AUTH_SECRET` | Auth secret key            |
| `OPENAI_API_URL`     | OpenAI-compatible base URL |
| `OPENAI_MODEL`       | Default chat model         |
| `RESEND_FROM`        | Sender address             |

Local `.env` / production secret bindings:

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
- `OPENAI_API_URL`
- `OPENAI_MODEL`
- `RESEND_FROM`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `RESEND_API_KEY`
- `OPENAI_API_KEY`

## Commands

```bash
pnpm dev          # Local dev via Vite+ and Void
pnpm test         # Isolated Vitest unit tests
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
# Resource bindings are declared in wrangler.json
# Local values live in the gitignored .env file
# Every server-side value is uploaded with `wrangler secret put <NAME>`
```

## Workspace

The repo is a pnpm workspace. Pi Agent runtime code lives in `packages/ai-core`; shared UI components live in `packages/ui`:

```
packages/ui/src/
├── components/      # CherryBlossom, HelloSignature
├── footer/          # PresenceCount, SiteAge
├── terminal/        # Interactive terminal (logic + components)
```

Shared TypeScript types (consumed by both `src/` and `server/`) live in `types/`, aliased as `@shared/`.

The platform-neutral Pi runtime lives in `packages/ai-core`. Maintainer documentation is collected in
`docs/ARCHITECTURE.md`, `docs/DEPLOYMENT.md`, `docs/DESIGN.md`, `docs/STYLEGUIDE.md`,
`docs/TECH.md`, and `docs/DATABASE.md`.

## License

[AGPL-v3](LICENSE)

This project contains code derived from [Taki](https://github.com/canmi21/taki) (AGPL-v3).
