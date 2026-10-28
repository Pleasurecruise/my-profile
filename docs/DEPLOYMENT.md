# Deployment

The application builds with Void/Vite+ and deploys as the `my-profile` Cloudflare Worker.

## Runtime Resources

| Binding  | Type   | Purpose              |
| -------- | ------ | -------------------- |
| `ASSETS` | Assets | Built React SPA      |
| `DB`     | D1     | Better Auth database |

The `cloudflare` section of `void.config.ts` is the source of truth for resource bindings;
`void.lock.json` records the resolved resources and is committed. `env.ts` is the source of truth
for application environment validation: non-sensitive configuration has a default there, and
credentials are stored as remote secrets.

## Chat Configuration

| Variable         | Storage           | Purpose                             |
| ---------------- | ----------------- | ----------------------------------- |
| `OPENAI_API_URL` | `env.ts` default  | OpenAI-compatible provider base URL |
| `OPENAI_MODEL`   | `env.ts` default  | Provider model identifier           |
| `OPENAI_API_KEY` | Cloudflare secret | Provider credential used by Pi AI   |

Pi Agent does not change the provider configuration contract. Local values belong in the
gitignored `.env`; production credentials are uploaded with `void secret put <NAME>`.

Void CLI selects the deployment platform from local `.void/project.json`, not the `target` in
`void.config.ts`, so run `void connect --platform cloudflare` once per checkout before `void secret put`.
Use `void env check --remote` to verify required secret names.

## Commands

```bash
pnpm dev      # local Void/Vite runtime
pnpm test     # isolated unit tests without the Void/Cloudflare dev plugin
pnpm check    # codegen, lint, formatting checks, and TypeScript
pnpm build    # production build
pnpm deploy   # build and deploy with `void deploy --platform cloudflare`
```

## Database Migrations

Better Auth tables are versioned in `db/migrations/` and stored in the `my-profile` D1 database.
`void deploy` checks the Drizzle schema for drift, saves a D1 restore point, and applies pending
migrations before traffic moves. After a schema change, run `void db generate`, review the
migration, and commit it before deploying.

The `main` branch still deploys through Vercel with Neon PostgreSQL; this branch does not share
that database.

## Worker Size

The Cloudflare free-plan compressed Worker limit is 3 MiB. `pnpm build` does not report the upload
size; Cloudflare rejects an over-limit upload during `pnpm deploy`, before traffic moves, and Void
keeps the previous deployment active. Keep provider
imports narrow: `ai-core` imports the OpenAI-completions adapter directly rather than a full provider
catalog. Syntax-highlighting languages also remain explicitly allow-listed.

## Operational Notes

- Production builds use the isolated `.void/build-env`; `.env` is not bundled.
- Static assets, the SPA shell, sitemap, and LLM profile files are served directly by Cloudflare
  Assets. Worker-first routing is limited to `/api/*` and Void's internal routes.
- The chat route is stateless and has no storage migration.
- Aborted browser requests propagate to Pi and the upstream provider.
- `nodejs_compat` is enabled in `void.config.ts` for Worker dependencies that require Node compatibility.
