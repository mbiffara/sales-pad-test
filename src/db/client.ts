import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { config } from '../config/env';

const pool = new Pool({
  connectionString: config.database.url,
  max: config.database.poolSize,
});

// Reuse a single Pool/drizzle instance so connections remain pooled.
export const db = drizzle(pool);
export const dbPool = pool;
