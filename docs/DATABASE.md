# Database

The application uses Cloudflare D1. `void.config.ts` declares the `DB` binding with
`migrations_dir: "./db/migrations"`; Void wires Better Auth to it automatically. Omitting
`database` selects D1.

## Local development

Void provides a local D1 database during `pnpm dev`. Apply committed migrations locally with
`void db migrate`.

## Production

`void deploy` provisions the `my-profile` D1 database, records it in `void.lock.json`, saves a
restore point, and applies pending migrations before activating the new Worker.

## Schema ownership

Better Auth currently owns the active authentication models:

- `user`
- `session`
- `account`
- `verification`

Void generates its Better Auth integration under `.void/`; that directory is ignored and must not
be edited manually. The matching SQL lives in `db/migrations/`. After a schema change, run
`void db generate`, review the migration, and commit it.
