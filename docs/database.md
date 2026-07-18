## Database

The application uses PostgreSQL. Void is configured with `"database": "pg"` in `void.json` and wires Better Auth to the database automatically.

### Local development

Copy `.env.example` to `.env.local` and set a direct PostgreSQL connection:

```dotenv
DATABASE_URL=postgresql://app:password@localhost:5432/mydb
CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE=postgresql://user:password@localhost:5432/database
```

A matching local instance can be started with Docker:

```bash
docker run -d \
  --name my-profile-postgres \
  -e POSTGRES_USER=app \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=mydb \
  -p 5432:5432 \
  --restart always \
  postgres:latest
```

### Production

Production uses the `HYPERDRIVE` binding declared in `wrangler.jsonc`. Local connection strings and database credentials must not be added to that file.

### Schema ownership

Better Auth currently owns the active authentication models:

- `user`
- `session`
- `account`
- `verification`

Void generates its Better Auth integration under `.void/`; that directory is ignored and must not be edited manually.

`server/lib/db.ts` and `server/lib/schema.ts` are retained legacy helpers and are not referenced by the current runtime. Removing the TypeScript definition for `am_i_ok_status` does not drop an existing production table; an explicit database migration is required if that table should be deleted.
