import { Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";

interface UserTable {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface SessionTable {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
}

interface AccountTable {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  accessTokenExpiresAt: Date | null;
  refreshTokenExpiresAt: Date | null;
  scope: string | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface VerificationTable {
  id: string;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface AmIOkStatusTable {
  id: number;
  apps: string[];
  deviceName: string;
  updatedAt: Date;
}

interface Database {
  user: UserTable;
  session: SessionTable;
  account: AccountTable;
  verification: VerificationTable;
  am_i_ok_status: AmIOkStatusTable;
}

const dbs = new Map<string, Kysely<Database>>();

export function getDb(connectionString: string): Kysely<Database> {
  const existingDb = dbs.get(connectionString);
  if (existingDb) return existingDb;

  const db = new Kysely<Database>({
    dialect: new PostgresJSDialect({
      postgres: postgres(connectionString, {
        max: 5,
        fetch_types: false,
        prepare: true,
      }),
    }),
  });

  dbs.set(connectionString, db);
  return db;
}
