import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';
import { env } from './config';

// Use New Supabase PostgreSQL database (prioritize NEW_PG_DATABASE_URL over DATABASE_URL)
const databaseUrl = env.NEW_PG_DATABASE_URL || env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('NEW_PG_DATABASE_URL or DATABASE_URL environment variable is required');
}

if (process.env.NEW_PG_DATABASE_URL) {
  console.log('✓ Using New Supabase PostgreSQL database');
} else {
  console.log('Using Replit PostgreSQL database (fallback)');
}

// Create postgres connection
const sql = postgres(databaseUrl, { prepare: false });

// Create drizzle database instance
export const db = drizzle(sql, { schema });
