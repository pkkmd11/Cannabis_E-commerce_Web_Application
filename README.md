# Cannabis E-commerce Web Application

A bilingual (Myanmar/English) cannabis e-commerce platform with admin management panel.

## Features

- **Bilingual Support**: Myanmar and English languages
- **Product Catalog**: Three quality tiers (High, Medium, Low) with images and videos
- **Contact-Based Ordering**: Telegram, WhatsApp, Messenger, Line integration
- **Admin Panel**: Manage products, FAQ, contacts, and site content
- **Cloud Storage**: Cloudflare R2 for media files
- **Responsive Design**: Mobile-first modern UI

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Shadcn/ui
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL (Supabase)
- **Storage**: Cloudflare R2
- **ORM**: Drizzle ORM

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repository-url>
cd <project-directory>
npm install
```

### 2. Configure Environment

Copy `env.example` to `.env` and fill in your values:

```bash
cp env.example .env
```

Required environment variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Supabase PostgreSQL connection string |
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 access key |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 secret key |
| `R2_BUCKET_NAME` | R2 bucket name (e.g., `cana-products`) |
| `R2_PUBLIC_DOMAIN` | R2 public bucket URL |

### 3. Setup Database

```bash
npm run db:push
```

### 4. Run Development Server

```bash
npm run dev
```

App runs at `http://localhost:5000`

## External Services Setup

### Supabase (Database)

1. Create project at [supabase.com](https://supabase.com)
2. Go to **Settings > Database > Connection String**
3. Copy the URI and add your password
4. Set as `DATABASE_URL` in `.env`

### Cloudflare R2 (File Storage)

1. Create account at [dash.cloudflare.com](https://dash.cloudflare.com)
2. Go to **R2 > Create bucket** (name: `cana-products`)
3. Create folders: `products-images/` and `products-video/`
4. **Manage R2 API Tokens > Create API Token** (Object Read & Write)
5. Enable public access on the bucket
6. Copy credentials to `.env`

## Admin Access

- **URL**: `/admin` (click Admin link on homepage)
- **Default credentials**: `admin` / `admin`
- Change password after first login in Admin Settings

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   │   ├── home.tsx    # Customer storefront
│   │   │   └── admin/      # Admin panel pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities
├── server/                 # Express backend
│   ├── routes/             # API route handlers
│   ├── database.ts         # Database connection
│   ├── storage.ts          # Data storage layer
│   └── objectStorage.ts    # R2 file operations
├── shared/                 # Shared types
│   └── schema.ts           # Database schema & types
└── env.example             # Environment template
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run db:push` | Push database schema |
| `npm run check` | TypeScript type check |

## Production Deployment

### Build

```bash
npm run build
npm start
```

### With PM2 (Recommended)

```bash
npm install -g pm2
pm2 start dist/index.js --name cannabis-ecommerce
pm2 save
pm2 startup
```

### With Nginx (Reverse Proxy)

```nginx
server {
    listen 80;
    server_name your-domain.com;

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

## Troubleshooting

**Database connection error:**
- Verify `DATABASE_URL` is correct
- Check if Supabase project is active (not paused)

**File upload not working:**
- Verify all R2 environment variables
- Check bucket has public access enabled
- Confirm API token has read/write permissions

**Build errors:**
```bash
rm -rf node_modules dist
npm install
npm run build
```

## License

MIT License - see [LICENSE](LICENSE) file.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.
