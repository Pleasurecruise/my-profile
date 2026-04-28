## Local database

The local Workers config currently points Hyperdrive at:

```text
postgresql://pleasure1234:123456@localhost:5432/mydb
```

Start a matching local Postgres instance:

```bash
docker run -d \
  --name my-profile-postgres \
  -e POSTGRES_USER=pleasure1234 \
  -e POSTGRES_PASSWORD=123456 \
  -e POSTGRES_DB=mydb \
  -p 5432:5432 \
  --restart always \
  postgres:latest
```

Current application tables are defined in `server/lib/schema.ts`:

- `user`
- `session`
- `account`
- `verification`
- `am_i_ok_status`
