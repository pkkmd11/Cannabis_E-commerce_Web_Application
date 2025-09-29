import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';

// Construct Supabase database URL if not already set
let databaseUrl = process.env.DATABASE_URL;

// If DATABASE_URL is not set or points to Neon, use Supabase instead
if (!databaseUrl || databaseUrl.includes('neon.tech')) {
  const supabasePassword = process.env.SUPABASE_DB_PASSWORD;
  if (supabasePassword) {
    // Construct Supabase PostgreSQL connection string
    // Project ref: dbzagmhddcbdcrgdhnjx
    databaseUrl = `postgresql://postgres.dbzagmhddcbdcrgdhnjx:${supabasePassword}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`;
    console.log('Using Supabase PostgreSQL database');
  } else {
    throw new Error('DATABASE_URL or SUPABASE_DB_PASSWORD environment variable is required');
  }
}

// Create postgres connection
const sql = postgres(databaseUrl, { prepare: false });

// Create drizzle database instance
export const db = drizzle(sql, { schema });
