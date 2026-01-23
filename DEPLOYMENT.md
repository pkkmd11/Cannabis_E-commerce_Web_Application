# Cannabis E-commerce Deployment Guide

Complete guide for deploying the cannabis e-commerce application.

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
- npm (v8 or higher)
- A Supabase account (for PostgreSQL database)
- A Cloudflare account (for R2 object storage)

---

## Environment Setup

### 1. Create `.env` file

Copy `env.example` to `.env`:

```bash
cp env.example .env
```

### 2. Configure Environment Variables

```bash
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"

# Cloudflare R2 Storage
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="cana-products"
R2_PUBLIC_DOMAIN="https://pub-xxxxx.r2.dev"

# Application
NODE_ENV="development"
PORT="5000"
```

### 3. Get Supabase Connection String

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings > Database**
4. Copy the **Connection String** (URI format)
5. Replace `[YOUR-PASSWORD]` with your database password
6. Set as `DATABASE_URL` in `.env`

### 4. Get Cloudflare R2 Credentials

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **R2 > Overview**
3. Copy your **Account ID**

**Create API Token:**
1. Click **Manage R2 API Tokens**
2. Click **Create API Token**
3. Set permissions: **Object Read & Write**
4. Copy **Access Key ID** and **Secret Access Key**

**Create R2 Bucket:**
1. Go to **R2 > Create bucket**
2. Name it `cana-products`
3. Go to **Settings > Public access**
4. Click **Allow Access**
5. Copy the **Public bucket URL**

---

## Database Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Push Database Schema

```bash
npm run db:push
```

This creates these tables:
- `users` - Admin credentials
- `products` - Product catalog
- `contact_info` - Contact platforms (Telegram, Messenger, Line)
- `faq_items` - FAQ questions and answers
- `site_settings` - CMS content

### 3. Default Admin User

The app automatically creates a default admin user on first run:
- **Username**: `admin`
- **Password**: `admin`

**Important**: Change these credentials immediately after first login via Admin Settings.

---

## File Storage Setup

### Bucket Structure

Your R2 bucket (`cana-products`) uses these folders:
- `products-images/` - Product image files
- `products-video/` - Product video files

Folders are created automatically when you upload files through the admin panel.

### How Uploads Work

1. Admin uploads file through the admin panel
2. Backend receives file at `POST /api/upload`
3. File is uploaded to Cloudflare R2
4. Public URL is returned and stored in database

No additional configuration needed.

---

## Local Development

### Start Development Server

```bash
npm run dev
```

This starts:
- Express backend server
- Vite frontend with hot reload
- Both on port 5000

### Access Points

- **Website**: http://localhost:5000
- **Admin Panel**: http://localhost:5000/admin

---

## Production Deployment

### Option 1: Replit (Recommended)

1. Set environment variables in Replit Secrets
2. Click **Publish** button
3. App is live at `https://your-app.replit.app`

Replit handles SSL, scaling, and server management automatically.

### Option 2: VPS (Ubuntu/Debian)

**1. Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**2. Clone and setup:**
```bash
git clone <your-repo-url>
cd <project-folder>
npm install
```

**3. Create `.env` with production credentials**

**4. Build and run:**
```bash
npm run build
```

**5. Use PM2 (process manager):**
```bash
sudo npm install -g pm2
pm2 start dist/index.js --name "cannabis-app"
pm2 save
pm2 startup
```

**6. Nginx reverse proxy (optional):**
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

**7. SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

---

## Admin Access

### Login

1. Go to `/admin`
2. Enter credentials (default: `admin` / `admin`)

### Features

- **Products**: Add/edit/delete products with images and videos
- **Contacts**: Configure Telegram, Messenger, Line with QR codes
- **CMS**: Edit About Us and How to Order sections
- **FAQ**: Manage question/answer pairs
- **Settings**: Change admin username and password

---

## Troubleshooting

### Database Connection Error

**Error**: `Connection refused` or `ECONNREFUSED`

**Fix**:
1. Check `DATABASE_URL` in `.env`
2. Verify Supabase project is active (not paused)
3. Ensure connection string includes `?sslmode=require`
4. Test with: `npm run db:push`

### File Upload Fails

**Error**: `Upload failed` or `403 Forbidden`

**Fix**:
1. Verify all R2 variables in `.env`
2. Check bucket has public access enabled
3. Confirm API token has read/write permissions
4. Verify `R2_PUBLIC_DOMAIN` matches bucket URL

### Products Not Showing

**Fix**:
1. Check products are marked "Active" in admin
2. Verify images uploaded successfully
3. Check browser console for errors

### Admin Login Fails

**Fix**:
1. Run `npm run db:push` to ensure tables exist
2. Clear browser cache and sessionStorage
3. Check backend logs for errors

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

---

## Security Best Practices

1. Change default admin credentials immediately
2. Use strong passwords
3. Never commit `.env` to version control
4. Rotate R2 API tokens periodically
5. Use HTTPS in production
6. Keep dependencies updated: `npm update`

---

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
