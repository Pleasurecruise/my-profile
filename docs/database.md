## How to init the database locally

```bash
docker run -d \
  --name drizzle-postgres \
  --network oauth-network \
  -e POSTGRES_USER=root \
  -e POSTGRES_PASSWORD=987412365 \
  -e POSTGRES_DB=simple-oauth \
  -p 5434:5432 \
  --restart always \
  postgres:latest
```