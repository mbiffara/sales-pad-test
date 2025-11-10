import dotenv from 'dotenv';

dotenv.config();

const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const getNumericEnv = (key: string, fallback?: string): number => {
  const raw = getEnv(key, fallback);
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a valid number`);
  }
  return parsed;
};

const databaseUrl = getEnv('DATABASE_URL');
const bossConnectionString = process.env.BOSS_DATABASE_URL ?? databaseUrl;

export const config = {
  env: process.env.NODE_ENV ?? 'development',
  port: getNumericEnv('PORT', '4000'),
  database: {
    url: databaseUrl,
    poolSize: getNumericEnv('DATABASE_POOL_SIZE', '10'),
  },
  boss: {
    connectionString: bossConnectionString,
  },
};
