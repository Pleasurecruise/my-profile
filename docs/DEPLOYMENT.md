# Deployment

The application builds with Void/Vite+ and deploys as the `my-profile` Cloudflare Worker.

## Runtime Resources

| Binding      | Type       | Purpose                          |
| ------------ | ---------- | -------------------------------- |
| `ASSETS`     | Assets     | Built React SPA                  |
| `HYPERDRIVE` | Hyperdrive | Production PostgreSQL connection |

`wrangler.json` is the source of truth for resource bindings and non-sensitive production values.
`env.ts` is the source of truth for application environment validation.

## Chat Configuration

| Variable         | Storage           | Purpose                             |
| ---------------- | ----------------- | ----------------------------------- |
| `OPENAI_API_URL` | `wrangler.json`   | OpenAI-compatible provider base URL |
| `OPENAI_MODEL`   | `wrangler.json`   | Provider model identifier           |
| `OPENAI_API_KEY` | Cloudflare secret | Provider credential used by Pi AI   |

Pi Agent does not change the provider configuration contract. Local values belong in `.env.local`;
production secrets are uploaded with `wrangler secret put`.

## Commands

```bash
pnpm dev      # local Void/Vite runtime
pnpm test     # isolated unit tests without the Void/Cloudflare dev plugin
pnpm check    # codegen, lint, formatting checks, and TypeScript
pnpm build    # production build plus Wrangler dry run
pnpm deploy   # production build and deploy
```

## Worker Size

The Cloudflare free-plan compressed Worker limit is 3 MiB. `pnpm build` includes a Wrangler dry run,
so every dependency change must be checked against its reported gzip upload size. Keep provider
imports narrow: `ai-core` imports the OpenAI-completions adapter directly rather than a full provider
catalog. Syntax-highlighting languages also remain explicitly allow-listed.

## Operational Notes

- Production builds use the isolated `.void/build-env`; `.env.local` is not bundled.
- Static assets, the SPA shell, sitemap, and LLM profile files are served directly by Cloudflare
  Assets. Worker-first routing is limited to `/api/*` and Void's internal routes.
- The chat route is stateless and has no storage migration.
- Aborted browser requests propagate to Pi and the upstream provider.
- `nodejs_compat` is enabled in `void.json` for Worker dependencies that require Node compatibility.
- Do not deploy until `pnpm build` reports an upload within the active Cloudflare plan limit.
