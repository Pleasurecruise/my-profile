# Technology Stack

This document describes the architecture currently used by the repository.

## Overview

The project is a pnpm workspace containing:

- a React 19 SPA built with Vite+
- TanStack Router file-based client routes
- Void file-based Hono routes running on Cloudflare Workers
- Better Auth backed by PostgreSQL
- Cloudflare Hyperdrive and static assets
- `@my-profile/ui` and a platform-neutral `@my-profile/ai-core` package

## Core runtime

| Technology                       | Role                                                        |
| -------------------------------- | ----------------------------------------------------------- |
| Vite+                            | Development, build, lint, formatting, and checks            |
| Void + Hono                      | Worker routing, auth, environment, and Cloudflare packaging |
| React + TanStack Router          | Browser SPA and file-based routes                           |
| Tailwind CSS                     | CSS-first styling with the existing project design tokens   |
| Better Auth + PostgreSQL         | Authentication and persistence through Hyperdrive           |
| Cloudflare Assets                | Static client files                                         |
| Pi Agent                         | Agent loop, tool execution, events, and cancellation        |
| OpenAI-compatible model endpoint | Model transport selected by environment variables           |
| Vitest                           | Isolated unit tests                                         |

Exact versions are recorded in `package.json` and each workspace package manifest. Pi Agent packages
are pinned to the same exact version in `packages/ai-core/package.json`.

## Build and routing

`vite.config.ts` installs Void, TanStack Router code generation, React, and Tailwind. Production
creates `dist/client/` for static assets and `dist/ssr/` for the Cloudflare Worker. Void scans the
root `routes/` directory; exported handler names supply HTTP methods, and catch-all segments use
`[...name].ts`.

All application Worker handlers live under `/api`. This lets Cloudflare serve matching static assets
and the SPA fallback without invoking the Worker. The sitemap is a static file under `public/`.

Generated files in `.void/`, `dist/`, and `src/routeTree.gen.ts` are not edited manually.

## AI chat

The authenticated browser route posts a validated transcript to `/api/chat/stream`. The Worker
creates a stateless Pi Agent and returns typed newline-delimited JSON events. Pi is the only owner of
the model/tool loop and receives request cancellation through an abort signal.

The Worker exposes one read-only application tool: reading the published profile from the static
asset binding.

The browser keeps conversation state in memory. Refreshing or leaving the route discards it. Neither
the Worker nor the database persists chat transcripts.

## Code boundaries

- `src/` contains browser-only state and UI.
- `routes/` and `server/` contain Worker-only transport and application integrations.
- `types/` contains only contracts consumed by both browser and Worker.
- `packages/ai-core` contains Pi construction and provider adaptation without Cloudflare or UI code.
- `packages/ui` contains reusable visual, footer, and terminal components.

## Environment strategy

`env.ts` validates runtime values. Local values belong in `.env.local`; non-sensitive production
configuration and bindings belong in `wrangler.json`; secrets are stored as Cloudflare secrets.
Application code reads environment values through Void or Hono context, not `process.env`.

The AI runtime uses `OPENAI_API_URL`, `OPENAI_MODEL`, and `OPENAI_API_KEY`. Its profile tool uses the
`ASSETS` binding.

## Commands

```bash
pnpm dev       # Local Void/Vite+ development server
pnpm test      # Isolated Vitest unit tests
pnpm build     # Production build and Wrangler dry-run
pnpm deploy    # Production build and Cloudflare deployment
pnpm check     # Codegen, formatting, lint, and TypeScript checks
pnpm lint      # Codegen and lint
pnpm format    # Formatting
```
