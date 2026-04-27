import { Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import type { Database } from "../types/database";

export function getDb(connectionString: string): Kysely<Database> {
  return new Kysely<Database>({
    dialect: new PostgresJSDialect({
      postgres: postgres(connectionString, {
        max: 1,
        fetch_types: false,
        // Keep the Worker client request-scoped and conservative behind Hyperdrive.
        prepare: false,
        idle_timeout: 5,
        connect_timeout: 10,
      }),
    }),
  });
}
