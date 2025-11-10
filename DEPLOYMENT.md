# Cannabis E-commerce Deployment Guide

Complete guide for deploying and running the cannabis e-commerce application locally and in production.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [File Storage Setup](#file-storage-setup)
5. [Local Development](#local-development)
6. [Production Deployment](#production-deployment)
7. [Admin Access](#admin-access)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:
- Node.js (v18 or higher)
- npm or yarn
- A Supabase account (for PostgreSQL database)
- A Cloudflare account (for R2 object storage)

---

## Environment Setup

### 1. Create `.env` file in the project root

```bash
# Database Configuration
NEW_PG_DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require

# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=cana-products
R2_PUBLIC_DOMAIN=https://pub-xxxxx.r2.dev

# Optional: Legacy Database URL (not used)
# DATABASE_URL=postgresql://...
```

### 2. Get Supabase PostgreSQL Connection String

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **Database**
4. Copy the **Connection String** (URI format)
5. Replace `[YOUR-PASSWORD]` with your actual database password
6. Set as `NEW_PG_DATABASE_URL` in `.env`

### 3. Get Cloudflare R2 Credentials

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **R2** → **Overview**
3. Note your **Account ID** (set as `R2_ACCOUNT_ID`)

**Create API Token:**
1. Click **Manage R2 API Tokens**
2. Click **Create API Token**
3. Set permissions: **Object Read & Write**
4. Click **Create API Token**
5. Copy **Access Key ID** (set as `R2_ACCESS_KEY_ID`)
6. Copy **Secret Access Key** (set as `R2_SECRET_ACCESS_KEY`)

**Create R2 Bucket:**
1. Go to **R2** → **Create bucket**
2. Name it `cana-products`
3. Click **Create bucket**
4. Go to **Settings** → **Public access**
5. Click **Allow Access** to enable public URLs
6. Copy the **Public bucket URL** (set as `R2_PUBLIC_DOMAIN`)

---

## Database Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Push Database Schema

This creates all necessary tables in your Supabase PostgreSQL database:

```bash
npm run db:push
```

Expected tables created:
- `users` - Admin credentials
- `products` - Product catalog
- `contact_info` - Contact platform details (Telegram, Messenger, Line)
- `faq_items` - FAQ questions and answers
- `site_settings` - CMS content (About, How to Order sections)

### 3. Create Admin User

Run this command to create the default admin account:

```bash
npm run db:push
```

Then manually insert admin user (or use the migration script):

```sql
INSERT INTO users (username, password) 
VALUES ('admin', '$2b$10$encrypted_password_hash');
```

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin`

⚠️ **IMPORTANT**: Change these credentials immediately after first login via the Admin Settings page.

---

## File Storage Setup

### Bucket Structure

Your R2 bucket (`cana-products`) should have these folders:
- `products-images/` - Product image files
- `products-video/` - Product video files

**Note**: Folders are created automatically when you upload files through the admin panel.

### Upload Configuration

The application uses a backend upload endpoint (`POST /api/upload`) that:
1. Receives files from the admin panel
2. Uploads to Cloudflare R2
3. Returns public URLs for storage in the database

No additional configuration needed - it works automatically with your `.env` credentials.

---

## Local Development

### 1. Start Development Server

```bash
npm run dev
```

This command:
- Starts Express backend server
- Starts Vite frontend development server
- Runs both on the same port (default: 5000)
- Enables hot module replacement for instant updates

### 2. Access the Application

- **Client Website**: http://localhost:5000
- **Admin Panel**: http://localhost:5000/admin

### 3. Development Workflow

1. Make code changes
2. Save files - auto-reload happens instantly
3. Check browser for updates
4. Backend changes require server restart (handled automatically)

---

## Production Deployment

### Option 1: Deploy on Replit

This project is optimized for Replit deployment:

1. Ensure `.env` file has all production credentials
2. Click **Publish** button in Replit
3. Your app will be live at `https://your-repl-name.repl.co`

**Replit handles:**
- Environment variable management
- Automatic SSL certificates
- Server scaling
- Database connections

### Option 2: Deploy on Vercel/Netlify

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Set environment variables** in your hosting platform dashboard

3. **Configure build settings:**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`

4. **Deploy** using your platform's CLI or Git integration

### Option 3: Deploy on VPS (Ubuntu/Debian)

1. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone repository:**
   ```bash
   git clone <your-repo-url>
   cd <project-folder>
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Create `.env` file** with production credentials

5. **Build application:**
   ```bash
   npm run build
   ```

6. **Run with PM2** (process manager):
   ```bash
   sudo npm install -g pm2
   pm2 start npm --name "cannabis-app" -- start
   pm2 save
   pm2 startup
   ```

7. **Setup Nginx reverse proxy** (optional but recommended):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## Admin Access

### Accessing Admin Panel

1. Navigate to `/admin` route
2. Enter admin credentials (default: `admin` / `admin`)
3. You'll see the admin dashboard with:
   - Products management
   - Contact info management
   - CMS content editor
   - FAQ management
   - Settings (change credentials)

### Admin Features

**Product Management:**
- Add/Edit/Delete products
- Upload multiple images and videos
- Set quality tiers (High/Medium/Low)
- Manage stock status
- Multilingual content (Myanmar/English)

**Contact Management:**
- Configure Telegram, Messenger, Line contact info
- Upload QR codes
- Set contact links

**CMS Editor:**
- Edit "About Us" section content
- Edit "How to Order" section content
- Multilingual content support

**FAQ Management:**
- Add/Edit/Delete FAQ items
- Reorder questions
- Multilingual Q&A pairs

**Settings:**
- Change admin username
- Change admin password
- Secure credential management

---

## Troubleshooting

### Database Connection Issues

**Error**: `Connection refused` or `ECONNREFUSED`

**Solution**:
1. Verify `NEW_PG_DATABASE_URL` is correct in `.env`
2. Check Supabase project is active
3. Ensure SSL mode is enabled: `?sslmode=require`
4. Test connection:
   ```bash
   npm run db:push
   ```

### File Upload Failures

**Error**: `Upload failed` or `403 Forbidden`

**Solution**:
1. Verify R2 credentials in `.env` are correct
2. Check bucket name is `cana-products`
3. Ensure bucket has public access enabled
4. Verify API token has **Object Read & Write** permissions
5. Check `R2_PUBLIC_DOMAIN` matches your bucket's public URL

### Missing Products on Frontend

**Solution**:
1. Log in to admin panel
2. Check if products exist and are marked as "Active"
3. Verify product images uploaded successfully
4. Check browser console for API errors

### Admin Login Not Working

**Solution**:
1. Verify admin user exists in database:
   ```bash
   npm run db:push
   ```
2. Reset admin password if needed via database query
3. Clear browser cache and sessionStorage
4. Check backend logs for authentication errors

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port in vite.config.ts
```

---

## Security Best Practices

1. **Change default admin credentials** immediately after deployment
2. **Use strong passwords** for database and admin accounts
3. **Keep `.env` file secure** - never commit to version control
4. **Rotate R2 API tokens** periodically
5. **Enable HTTPS** in production (Replit handles this automatically)
6. **Regularly update dependencies**: `npm update`

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Replit Deployment Guide](https://docs.replit.com/hosting/deployments/about-deployments)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)

---

## Support

For issues or questions:
1. Check this documentation first
2. Review error logs in console/terminal
3. Verify environment variables are set correctly
4. Test database and R2 connections independently

---

**Last Updated**: November 10, 2025
