import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';

// Use Replit's built-in PostgreSQL database
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

console.log('Using Replit PostgreSQL database');

// Create postgres connection
const sql = postgres(databaseUrl, { prepare: false });

// Create drizzle database instance
export const db = drizzle(sql, { schema });
