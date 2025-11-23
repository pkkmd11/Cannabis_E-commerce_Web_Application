# Cannabis E-commerce Web Application

## Overview
This project is a comprehensive cannabis e-commerce web application, leveraging React, TypeScript, and Express.js. It features a bilingual (Myanmar/English) client storefront and a secure admin panel. The application is designed to showcase cannabis products organized by quality tiers with rich media support, contact integration, and robust content management capabilities. The business vision is to provide a modern, maintainable, and scalable platform for cannabis product sales, focusing on user experience and administrative efficiency.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, built using Vite.
- **UI/UX**: Utilizes Shadcn/ui components (built on Radix UI primitives) and Tailwind CSS for styling, applying a consistent beige background theme (#F5F5DC).
- **State Management**: TanStack Query (React Query) for server state.
- **Routing**: Wouter for client-side routing.
- **Forms**: React Hook Form with Zod validation.
- **Internationalization**: Custom bilingual support for Myanmar and English.
- **Component Organization**: Feature-based structure, with a focus on modularity and separation of concerns, especially within the admin panel.

### Backend
- **Runtime**: Node.js with Express.js.
- **Language**: TypeScript with ES modules.
- **API Design**: RESTful API with modular route handlers for products, authentication, FAQs, contacts, content, settings, and file uploads.
- **Data Validation**: Zod schemas for type-safe validation.
- **Storage Layer**: Abstracted interface.

### Database
- **ORM**: Drizzle ORM with PostgreSQL dialect.
- **Database**: New Supabase PostgreSQL (managed database).
- **Schema**: Includes tables for users (admin authentication), products (multilingual JSON fields, quality tiers, active status), site content, contact info (with unique platform constraint), and FAQ items (multilingual support).
- **Migrations**: `npm run db:push` for schema synchronization.

### Authentication & Authorization
- **Admin Access**: Custom username/password authentication with bcrypt hashing for secure storage.
- **Session Management**: sessionStorage-based authentication state.
- **Security**: Admin routes are protected with authentication checks, and credential changes require current password verification.

### Product Management
- **Quality Tiers**: Three tiers (High, Medium, Low) with localized labels.
- **Media**: Supports multiple images and videos per product.
- **Content**: Multilingual content and flexible specification lists using JSON-based storage.
- **Features**: Soft delete functionality via active/inactive states.

### Content Management
- **Dynamic Sections**: Configurable site sections (about, how-to-order, FAQ).
- **Multilingual CMS**: Full content management in both languages.
- **Contact Integration**: QR codes and direct links for Telegram, WhatsApp, and Messenger.
- **FAQ System**: Manageable question/answer pairs with ordering and active status.

### File Upload & Media
- **Cloud Storage**: Cloudflare R2 (S3-compatible object storage) for all media.
- **Upload Flow**: Backend API (`/api/upload`) handles uploads to R2.
- **Structure**: Files stored in `cana-products` bucket with `products-images/` and `products-video/` folders.
- **Features**: Support for multiple product images (responsive, optimized) and video galleries.

## External Dependencies

### Database & Backend Services
- **New Supabase PostgreSQL**: Primary managed PostgreSQL database.
- **Postgres.js**: PostgreSQL client for Drizzle ORM.
- **Drizzle ORM**: Type-safe database operations.

### Cloud Services
- **Cloudflare R2**: S3-compatible object storage for all files and media (`@aws-sdk/client-s3`).
- **Vercel**: Deployment platform.
- **dotenv**: Environment variable management.

### UI & Component Libraries
- **Radix UI**: Headless UI primitives.
- **Tailwind CSS**: Utility-first CSS framework.
- **Lucide React**: Icon library.
- **Class Variance Authority**: Component variant management.
- **React Icons**: Icon library for consistent iconography.

### File Upload & Media Processing
- **Uppy**: File upload library with dashboard UI (`@uppy/core`, `@uppy/dashboard`, `@uppy/aws-s3`).
- **@uppy/react**: React wrapper for Uppy.

### Communication Platforms
- **Telegram**: Direct messaging integration.
- **WhatsApp**: Business messaging support.
- **Facebook Messenger**: Social media messaging integration.

### Development Tools
- **Vite**: Frontend build tool.
- **TypeScript**: For type safety.
- **ESBuild**: Fast JavaScript bundler.
- **PostCSS**: CSS processing.
- **Google Analytics**: For tracking and analytics (gtag.js).