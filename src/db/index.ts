import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './auth-schema';

const db = drizzle(process.env.DATABASE_URL!, { schema });

export { db };