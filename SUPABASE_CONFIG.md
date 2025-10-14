# Supabase Configuration Guide

This file contains all the connection links and credentials you need to configure for your Supabase database.

## Required Environment Variables

Replace the placeholder values with your actual Supabase credentials:

### 1. DATABASE_URL (Primary Connection String)
```
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[YOUR-REGION].pooler.supabase.com:6543/postgres"
```

**How to get this:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/projects)
2. Select your project
3. Click "Connect" button in top toolbar
4. Copy URI from "Connection string" → "Transaction pooler"
5. Replace `[YOUR-PASSWORD]` with your actual database password

**Example:**
```
DATABASE_URL="postgresql://postgres.dbzagmhddcbdcrgdhnjx:your_actual_password_here@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
```

---

### 2. SUPABASE_DB_PASSWORD (Backup/Alternative)
```
SUPABASE_DB_PASSWORD="your_database_password_here"
```

**How to get this:**
- This is the database password you set when creating your Supabase project
- If you forgot it, you can reset it in: Settings → Database → Database Password

---

### 3. Supabase Storage Configuration (For file uploads)

#### VITE_SUPABASE_URL
```
VITE_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
```

**How to get this:**
1. Go to your Supabase project
2. Go to Settings → API
3. Copy "Project URL"

**Example:**
```
VITE_SUPABASE_URL="https://dbzagmhddcbdcrgdhnjx.supabase.co"
```

#### VITE_SUPABASE_ANON_KEY
```
VITE_SUPABASE_ANON_KEY="your_anon_public_key_here"
```

**How to get this:**
1. Go to your Supabase project
2. Go to Settings → API
3. Copy "anon public" key under "Project API keys"

**Example:**
```
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiem..."
```

---

## Complete Configuration Template

Copy this entire block and replace ALL placeholder values:

```bash
# Database Connection (PostgreSQL)
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[YOUR-REGION].pooler.supabase.com:6543/postgres"
SUPABASE_DB_PASSWORD="your_database_password_here"

# Supabase Client (For Storage & Auth)
VITE_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
VITE_SUPABASE_ANON_KEY="your_anon_public_key_here"
```

---

## Your Current Project Reference

Based on your existing configuration:
- **Project Ref:** `dbzagmhddcbdcrgdhnjx`
- **Region:** `ap-southeast-1` (Singapore)

So your DATABASE_URL should look like:
```
DATABASE_URL="postgresql://postgres.dbzagmhddcbdcrgdhnjx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
```

---

## How to Set These Variables

### In Replit (Production):
1. Click "Tools" → "Secrets" in the sidebar
2. Add each environment variable as a new secret
3. Restart your application

### In Local Development:
1. Create a `.env` file in your project root
2. Add all the variables above
3. Restart your development server

---

## Troubleshooting

### Connection Refused Error (ECONNREFUSED)
- **Problem:** Database password is wrong or database is paused
- **Solution:** 
  1. Verify your password in Supabase Dashboard → Settings → Database
  2. Check if your database is active (not paused)
  3. Update DATABASE_URL with correct password

### Authentication Failed (28P01)
- **Problem:** Wrong database password
- **Solution:** Reset password in Supabase Dashboard → Settings → Database → Reset Database Password

### Storage Upload Errors
- **Problem:** Wrong SUPABASE_URL or ANON_KEY
- **Solution:** Copy fresh values from Settings → API in Supabase Dashboard

---

## Storage Buckets Setup (For Product Images)

If you haven't created storage buckets yet:

1. Go to Supabase Dashboard → Storage
2. Create these buckets:
   - `product-images` (for product photos)
   - `product-videos` (for product videos)
3. Set bucket permissions:
   - Go to bucket → Policies
   - Enable public access or set appropriate RLS policies
   - For public access: Create policy allowing SELECT for anonymous users

---

## Need Help?

1. **Supabase Dashboard:** https://supabase.com/dashboard/projects
2. **Your Project:** https://supabase.com/dashboard/project/dbzagmhddcbdcrgdhnjx
3. **Supabase Docs:** https://supabase.com/docs
