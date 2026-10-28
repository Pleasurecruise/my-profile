# my-profile

Personal website — [you-find.me](https://you-find.me)

## Stack

Vite+ · Void · React 19 · TypeScript · TailwindCSS v4 · Hono · TanStack Router · Cloudflare D1 · Better Auth · Cloudflare Workers

## Features

- **Home** — landing page with animated background
- **Social** — multilingual follow policy, social accounts, contact details, and sponsorship
- **Chat** — authenticated Pi Agent chat with typed NDJSON streaming
- **Terminal** — interactive slash-command terminal (`/help` to explore)
- **CV** — resume page with work, projects, and hackathons
- **Story** — multilingual personal story, interactive map, and My Series project introductions
- **Auth** — sign up, login, email verification, password reset (Better Auth + GitHub/Google OAuth)

## Getting Started

Use pnpm 12.6.0, as pinned in `package.json`.

```bash
pnpm install
pnpm dev
```

Create a gitignored `.env` with the local values declared in `env.ts` before running `pnpm dev`.
Void provides a local D1 database during development.

`pnpm dev` runs Vite+ with `voidPlugin()`. Void uses Cloudflare's Vite runtime internally, so application development does not invoke `wrangler dev` directly.

## Environment

This project splits runtime values by source.

- `env.ts` declares and validates application environment variables.
- `.env` contains local secrets. It is ignored by Git.
- Cloudflare resource bindings live under `cloudflare` in `void.config.ts`; `void.lock.json` records
  the resolved resources.
- Non-sensitive configuration (`OPENAI_API_URL`, `OPENAI_MODEL`, `RESEND_FROM`) is a default in
  `env.ts`. Credentials are uploaded to Cloudflare with `void secret put <NAME>`.
- Production builds do not load `.env`; runtime secrets stay in Cloudflare encrypted bindings.

Remote/prod bindings are declared in `void.config.ts`:

| Binding  | Type   | Purpose              |
| -------- | ------ | -------------------- |
| `ASSETS` | Static | Serves the SPA       |
| `DB`     | D1     | Better Auth database |

Configuration defaults in `env.ts` (override locally in `.env`):

| Variable         | Purpose                    |
| ---------------- | -------------------------- |
| `OPENAI_API_URL` | OpenAI-compatible base URL |
| `OPENAI_MODEL`   | Default chat model         |
| `RESEND_FROM`    | Sender address             |

Local `.env` / production secret bindings:

| Variable               | Purpose                      |
| ---------------------- | ---------------------------- |
| `BETTER_AUTH_SECRET`   | Auth secret key              |
| `GITHUB_CLIENT_ID`     | GitHub OAuth client ID       |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret   |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID       |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret   |
| `RESEND_API_KEY`       | Transactional email (Resend) |
| `OPENAI_API_KEY`       | AI chat                      |

## Commands

```bash
pnpm dev          # Local dev via Vite+ and Void
pnpm test         # Isolated Vitest unit tests
pnpm build        # Production build
pnpm deploy       # Build and deploy with Void
pnpm check        # Format, lint, and type checks
pnpm lint         # Lint (vite-plus)
pnpm format       # Format (vite-plus)
```

## Deployment

```bash
pnpm deploy
```

`void deploy` applies pending D1 migrations in `db/migrations/` before the new
version receives traffic. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

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
