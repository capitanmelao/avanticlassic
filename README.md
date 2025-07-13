# Avanti Classic

A modern classical music website built with Next.js 15, featuring a complete content management system and multilingual support.

## 🚀 Project Overview

- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + shadcn/ui
- **Languages**: TypeScript
- **Deployment**: Vercel
- **Content**: Multilingual (EN/FR/DE)

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (serverless functions)
│   ├── artists/           # Artist pages
│   ├── releases/          # Release pages
│   ├── videos/            # Video gallery
│   └── playlists/         # Playlists and composers
├── components/            # React components
├── lib/                   # Utilities and Supabase client
├── admin-panel/           # Admin interface (port 3001)
└── old-astro-site/        # Archived previous version

```

## 🛠 Development

### Main Site
```bash
npm run dev        # Start on port 3003
npm run build      # Build for production
npm run start      # Start production server
```

### Admin Panel
```bash
cd admin-panel
npm run dev        # Start admin on port 3001
```

## 🎯 Features

### Public Site
- 🎼 Artist profiles with biographies
- 💿 Release catalog with streaming links
- 🎥 YouTube video integration
- 📰 News and reviews system
- 🎵 Curated playlists
- 👨‍🎼 Composer profiles
- 🔍 Advanced search functionality
- 📱 Fully responsive design
- 🌍 Multilingual content (EN/FR/DE)

### Admin Panel
- 🔐 Google OAuth authentication
- ✏️ CRUD operations for all content
- 🖼️ Image management
- 🌐 Multilingual content editor
- 📊 Analytics dashboard
- 📧 Newsletter management

### API Features
- 🔄 RESTful API endpoints
- 🗄️ Database integration with Supabase
- 🔍 Full-text search
- 📄 Pagination support
- 🌐 Language-aware content delivery

## 🔧 Environment Setup

1. Copy environment variables:
```bash
cp .env.example .env.local
```

2. Configure your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

## 🚀 Deployment

Configured for Vercel with:
- Automatic builds from main branch
- Serverless API functions
- Environment variable integration
- Custom domain support

## 📊 Database

Powered by Supabase with tables for:
- Artists and translations
- Releases and reviews  
- Videos and descriptions
- News articles
- Playlists and composers
- Newsletter subscribers
- Site analytics

## 🏗 Architecture

- **Frontend**: Next.js with server-side rendering
- **API**: Next.js API routes as serverless functions
- **Database**: Supabase PostgreSQL with Row Level Security
- **Auth**: NextAuth.js with Google OAuth
- **Styling**: Tailwind CSS with design system
- **Deployment**: Vercel with automatic deployments