import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export function getDb(connectionString: string) {
  const sqlClient = postgres(connectionString, {
    max: 1,
    fetch_types: false,
    // Workers cannot safely reuse request-bound I/O objects across requests.
    prepare: false,
    idle_timeout: 5,
    connect_timeout: 10,
  });

  return drizzle({ client: sqlClient });
}
