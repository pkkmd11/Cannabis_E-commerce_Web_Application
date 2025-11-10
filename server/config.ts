import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Export environment variables for easy access
export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  NEW_PG_DATABASE_URL: process.env.NEW_PG_DATABASE_URL,
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
  R2_PUBLIC_DOMAIN: process.env.R2_PUBLIC_DOMAIN,
  NEW_SUPABASE_URL: process.env.NEW_SUPABASE_URL,
  NEW_SUPABASE_SERVICE_ROLE_KEY: process.env.NEW_SUPABASE_SERVICE_ROLE_KEY,
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '5000',
};
