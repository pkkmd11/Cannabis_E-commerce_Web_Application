# Cannabis E-commerce Web Application

## Overview

This is a comprehensive cannabis e-commerce web application built with React, TypeScript, and Express.js. The application features a bilingual (Myanmar/English) client-facing storefront and a secure admin management panel. The system is designed to showcase cannabis products organized by quality tiers with rich media support, contact integration, and comprehensive content management capabilities.

## Recent Changes

### November 23, 2025
- **Major Code Refactoring for Maintainability**: Restructured the codebase to improve human maintainability and developer experience
  - **Root Directory Cleanup**: 
    - Moved all screenshots, migration logs, and temporary files to `archive/` directory
    - Removed old migration scripts from server directory
    - Cleaner project root makes it easier to find important files
  - **Backend Route Modularization**:
    - Split monolithic `server/routes.ts` (349 lines) into focused route modules
    - Created `server/routes/` directory with separate files:
      - `product.routes.ts` - Product CRUD operations
      - `auth.routes.ts` - Admin authentication and credential management
      - `faq.routes.ts` - FAQ management endpoints
      - `contact.routes.ts` - Contact information endpoints
      - `content.routes.ts` - Site content endpoints
      - `settings.routes.ts` - Site settings endpoints
      - `upload.routes.ts` - File upload to R2 storage
    - Main `routes.ts` now acts as a clean orchestrator, importing and registering route modules
    - Each route file is well-documented with JSDoc comments explaining purpose
  - **Admin Panel Component Breakdown**:
    - Split large `admin.tsx` (548 lines) into focused, manageable components
    - Created `client/src/pages/admin/` directory with:
      - `Dashboard.tsx` - Statistics and overview display
      - `ProductManagement.tsx` - Product CRUD operations and listing
      - `FaqManagement.tsx` - FAQ item management
    - Main `admin.tsx` now delegates to section-specific components (235 lines)
    - Improved separation of concerns makes features easier to locate and modify
  - **Code Documentation**:
    - Added helpful JSDoc comments to all route modules explaining their purpose
    - Documented component props and key functions
    - Added inline comments for complex business logic
  - **Benefits**:
    - Faster feature location - developers can find specific functionality quickly
    - Easier maintenance - changes are isolated to specific modules
    - Better onboarding - new developers can understand structure faster
    - Safer modifications - smaller files reduce risk of breaking unrelated features

### November 10, 2025
- **Complete Infrastructure Migration**: Successfully migrated from Old Supabase to New Supabase PostgreSQL + Cloudflare R2 storage
  - **Database Migration**:
    - Migrated from Replit PostgreSQL to New Supabase PostgreSQL (NEW_PG_DATABASE_URL)
    - Transferred all data: 57 products, 3 contacts, 1 FAQ, 2 settings, 1 user
    - Migration script archived at `server/migrate-db-data.ts`
  - **File Storage Migration**: 
    - Migrated from Old Supabase Storage to Cloudflare R2 (cana-products bucket)
    - Successfully transferred 218 product images to R2
    - All files stored in organized folders: `products-images/` and `products-video/`
    - Migration script archived at `server/migrate-data.COMPLETED.ts`
  - **New Upload System**:
    - Created R2 client module (`server/r2-client.ts`) with AWS S3-compatible upload function
    - Implemented POST `/api/upload` endpoint for backend file handling
    - Updated `ObjectUploader` component to use new backend API instead of direct storage uploads
    - All new uploads now go directly to R2 with public URLs
  - **Code Cleanup**:
    - Removed all debug console.log statements
    - Removed unused Old Supabase authentication code (`client/src/lib/supabase.ts`, `client/src/hooks/useAuth.ts`)
    - Application now uses custom admin authentication exclusively
    - Improved error handling across upload and API endpoints
  - **Environment Variables**: Using dotenv to load from `.env` file with R2 and New Supabase credentials
  - **Infrastructure Benefits**: Improved reliability, cost efficiency, and simplified file management
  - **Safe to Delete**: Old Supabase project can now be safely deleted from dashboard

### October 25, 2025
- **Google Analytics Integration**: Added Google Analytics tracking code (gtag.js) to index.html
  - Tracking ID: G-Q3PYSN2ZCF
  - Script loads asynchronously to prevent blocking page render
  - Placed at the beginning of <head> for earliest possible tracking initialization
  - Enables visitor tracking, behavior analytics, and conversion monitoring
- **Platform Icons Update**: Replaced FontAwesome icons with React Icons for better consistency
  - Updated ProductDetailModal to use SiTelegram, SiMessenger, SiLine icons from react-icons/si
  - Updated "How to Order" section contact cards with matching React Icons
  - Added WhatsApp icon support (SiWhatsapp) for future use
  - Added neutral fallback icon (MessageCircle from lucide-react) for unknown platforms
  - Explicit icon sizing (w-5 h-5 for modal buttons, w-8 h-8 for contact cards) ensures consistent display
- **Design Updates**: Applied beige background theme (#F5F5DC) consistently across entire website
  - Header, Products, About, How to Order, and FAQ sections now use beige background
  - Product cards and contact cards maintain white backgrounds for visual contrast
  - Hero section retains gradient background with logo watermark overlay

### October 14, 2025
- **Admin Settings Feature**: Implemented secure admin credential management system
  - Added POST /api/admin/login endpoint with database validation using bcrypt
  - Added POST /api/admin/update-credentials endpoint for changing username and password
  - Created AdminSettings component with form validation for credential updates
  - Added Settings section to admin panel sidebar and navigation
  - Fixed authentication to use database validation instead of hardcoded credentials
  - Implemented proper session management with sessionStorage cleanup on logout
  - All credential changes require current password verification for security
  - End-to-end testing confirms secure username and password updates
- **Database Migration to Replit PostgreSQL**: Successfully migrated from Supabase PostgreSQL to Replit's built-in PostgreSQL database
  - Updated `server/database.ts` to use Replit's DATABASE_URL exclusively
  - Removed Supabase connection fallback logic
  - Added unique constraint on `contact_info.platform` to prevent duplicate contact entries
  - Cleaned up duplicate contact data (removed 3 legacy duplicates)
  - All API endpoints verified working: products, contacts, FAQ, filtering, and CRUD operations
  - End-to-end testing confirms full functionality with new database
- **Dialog Accessibility Fixed**: Added DialogTitle and DialogDescription to admin login dialog to resolve console accessibility warnings
- **Upload Retry Logic**: Implemented automatic retry mechanism for Supabase file uploads with exponential backoff (up to 3 attempts) to handle timeout and network errors
- **Error Handling Improvements**: Enhanced error messages for upload failures with specific guidance for different error types

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Project Structure
```
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ui/              # Shadcn UI components
│   │   │   ├── Header.tsx       # Site header with language toggle
│   │   │   ├── Footer.tsx       # Site footer
│   │   │   ├── ProductCard.tsx  # Product display card
│   │   │   ├── ProductForm.tsx  # Product creation/edit form
│   │   │   ├── FaqForm.tsx      # FAQ creation/edit form
│   │   │   └── ...              # Other shared components
│   │   ├── pages/               # Page-level components
│   │   │   ├── admin/           # Admin panel section components
│   │   │   │   ├── Dashboard.tsx         # Admin dashboard
│   │   │   │   ├── ProductManagement.tsx # Product CRUD operations
│   │   │   │   └── FaqManagement.tsx     # FAQ management
│   │   │   ├── admin.tsx        # Main admin page (orchestrator)
│   │   │   ├── home.tsx         # Public homepage
│   │   │   └── not-found.tsx    # 404 page
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utility functions and clients
│   │   └── types/               # TypeScript type definitions
│   └── index.html               # HTML entry point
│
├── server/                      # Backend Express application
│   ├── routes/                  # Modular route handlers (NEW)
│   │   ├── product.routes.ts    # Product API endpoints
│   │   ├── auth.routes.ts       # Authentication endpoints
│   │   ├── faq.routes.ts        # FAQ API endpoints
│   │   ├── contact.routes.ts    # Contact info endpoints
│   │   ├── content.routes.ts    # Site content endpoints
│   │   ├── settings.routes.ts   # Site settings endpoints
│   │   └── upload.routes.ts     # File upload to R2
│   ├── routes.ts                # Route orchestrator (imports route modules)
│   ├── storage.ts               # Database abstraction layer
│   ├── database.ts              # PostgreSQL connection
│   ├── r2-client.ts             # Cloudflare R2 upload client
│   └── index.ts                 # Express server entry point
│
├── shared/                      # Shared code between frontend and backend
│   └── schema.ts                # Database schema and Zod validators
│
├── archive/                     # Historical files (NEW)
│   ├── screenshots/             # Old UI screenshots
│   ├── logs/                    # Migration logs
│   └── server-old-files/        # Archived migration scripts
│
└── [config files]               # package.json, tsconfig.json, etc.
```

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation
- **Internationalization**: Custom bilingual support for Myanmar and English languages
- **Component Organization**: Feature-based structure with dedicated admin section components

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with modular route handlers organized by domain
- **Route Organization**: Separate route files for products, auth, FAQ, contacts, content, settings, and uploads
- **Data Validation**: Zod schemas for type-safe data validation
- **Storage Layer**: Abstracted storage interface supporting both in-memory and database implementations
- **Development**: Hot module replacement via Vite integration

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: New Supabase PostgreSQL (managed database)
- **Connection**: Uses NEW_PG_DATABASE_URL environment variable (loaded from .env via dotenv)
- **Schema Structure**:
  - Users table for admin authentication
  - Products table with multilingual JSON fields and quality tiers
  - Site content table for CMS functionality
  - Contact info table for platform integration (unique constraint on platform field)
  - FAQ items table with multilingual support
- **Data Types**: Extensive use of JSON columns for multilingual content and flexible data structures
- **Migrations**: Uses `npm run db:push` to sync schema changes to database

### Authentication & Authorization
- **Admin Access**: Custom username/password authentication stored in database
- **Password Security**: bcrypt hashing for secure credential storage
- **Session Management**: sessionStorage-based authentication state
- **Route Protection**: Admin routes protected with authentication checks

### Product Management System
- **Quality Tiers**: Three-tier system (High, Medium, Low) with localized labels
- **Media Support**: Multiple images and videos per product
- **Multilingual Content**: JSON-based content storage for Myanmar and English
- **Specifications**: Flexible specification lists in both languages
- **Active Status**: Soft delete functionality with active/inactive states

### Content Management
- **Dynamic Sections**: Configurable site sections (about, how-to-order, FAQ)
- **Multilingual CMS**: Full content management in both languages
- **Contact Integration**: QR codes and direct links for Telegram, WhatsApp, and Messenger
- **FAQ System**: Question/answer pairs with ordering and active status

### File Upload & Media
- **Cloud Storage**: Cloudflare R2 (S3-compatible object storage)
- **Upload Flow**: Backend API (`/api/upload`) handles file uploads to R2
- **Bucket Structure**: Single bucket (`cana-products`) with organized folders (`products-images/`, `products-video/`)
- **Image Handling**: Support for multiple product images with responsive display and optimization
- **Video Support**: Video gallery functionality for product demonstrations
- **Public Access**: All uploaded files have public URLs for direct access

## External Dependencies

### Database & Backend Services
- **New Supabase PostgreSQL**: Managed PostgreSQL database (primary database)
- **Postgres.js**: PostgreSQL client library for Drizzle ORM
- **Drizzle ORM**: Type-safe database operations and migrations

### Cloud Services
- **Cloudflare R2**: S3-compatible object storage for file and media storage (@aws-sdk/client-s3)
- **Vercel**: Deployment platform (configured for production builds)
- **dotenv**: Environment variable management for configuration

### UI & Component Libraries
- **Radix UI**: Headless UI primitives for accessible components
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Component variant management

### File Upload & Media Processing
- **Uppy**: File upload library with dashboard UI (@uppy/core, @uppy/dashboard, @uppy/aws-s3)
- **React Integration**: Uppy React wrapper (@uppy/react)

### Development Tools
- **Vite**: Frontend build tool with hot module replacement
- **TypeScript**: Type safety across the entire application
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer

### Communication Platforms
- **Telegram**: Direct messaging integration
- **WhatsApp**: Business messaging support
- **Facebook Messenger**: Social media messaging integration