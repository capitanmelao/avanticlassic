# Avanti Classic

A modern classical music website built with Next.js 15, featuring complete e-commerce functionality, multilingual support, and professional content management.

## 🚀 Production URLs

- **Main Website**: https://avanticlassic.vercel.app
- **Admin Panel**: https://avanticlassic-admin.vercel.app

## 🏗 Project Overview

- **Framework**: Next.js 15 with App Router + TypeScript
- **Database**: Supabase PostgreSQL with Row Level Security  
- **E-commerce**: Stripe integration with Express Checkout (Apple Pay, Google Pay, Link)
- **Authentication**: Simple username/password system (admin panel)
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Deployment**: Vercel with automatic deployments
- **Content**: Trilingual (EN/FR/DE) with real-time switching

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (payments, content, auth)
│   ├── shop/              # E-commerce pages (cart, checkout, success)
│   ├── artists/           # Artist pages with infinite scroll
│   ├── releases/          # Release catalog with reviews
│   ├── videos/            # Video gallery
│   ├── playlists/         # Curated playlists
│   └── faq/               # SEO-optimized FAQ
├── components/            # React components + UI library
├── lib/                   # Utilities, Supabase, Stripe, translations
├── admin-panel/           # Separate Next.js admin interface
└── documentation/         # Current deployment and development docs
```

## 🛠 Development

### Main Site
```bash
npm install        # Install dependencies  
npm run dev        # Start on port 3000
npm run build      # Build for production
```

### Admin Panel
```bash
cd admin-panel
npm install        # Install admin dependencies
npm run dev        # Start admin on port 3000
```

## 🎯 Features

### E-commerce System ✅ Production Ready
- 🛒 Shopping cart with persistent state
- 💳 Stripe Express Checkout (Apple Pay, Google Pay, Link)
- 📦 Product catalog with 37 professional releases
- 💰 Admin-configurable shipping and tax overrides
- 📱 Mobile-optimized checkout experience
- 🔒 Secure payment processing with PCI compliance

### Content Management ✅ Complete
- 🎼 37 professionally catalogued classical music releases  
- 👨‍🎨 18 artist profiles with authentic biographies
- 🎥 Database-driven video gallery with YouTube integration
- 🎵 Curated playlists with streaming service integration
- 📝 15 authentic reviews from real classical music critics
- 🌍 Complete trilingual content (EN/FR/DE)
- 🔍 Infinite scroll on all content pages for optimal UX

### Admin Panel ✅ Two-Tier System
- 🔐 Simple authentication (username/password)
- 👥 Role-based access (Company Admin / Super Admin)
- ✏️ Complete CRUD operations for all content types
- 🖼️ Drag-and-drop image upload with optimization
- 🎚️ Product override controls (shipping/tax per item)
- 📊 Audit logging for all administrative actions
- 📱 Responsive design with resizable tables

### SEO & Performance ✅ AI-Optimized
- 🤖 AI/LLM search optimization (ChatGPT, Perplexity, Gemini)
- 📄 Complete JSON-LD structured data (Schema.org)
- 🗺️ Dynamic sitemap generation with real-time updates
- 📱 Core Web Vitals optimized for maximum performance
- 🔍 Traditional SEO + modern AI search platform targeting

## 🔧 Environment Setup

### Main Website
```env
NEXT_PUBLIC_SUPABASE_URL=https://cfyndmpjohwtvzljtypr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
NEXT_PUBLIC_APP_URL=https://avanticlassic.vercel.app
```

### Admin Panel
```env
NEXT_PUBLIC_SUPABASE_URL=https://cfyndmpjohwtvzljtypr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SESSION_SECRET=your_session_secret
NEXT_PUBLIC_MAIN_SITE_URL=https://avanticlassic.vercel.app
```

## 🚀 Deployment

### Automatic Deployment via Vercel
- **Main Site**: `avanticlassic` project → https://avanticlassic.vercel.app
- **Admin Panel**: `avanticlassic-admin` project → https://avanticlassic-admin.vercel.app
- **Trigger**: Git push to `main` branch → instant deployment
- **Environment**: All variables configured in Vercel dashboard

### Key Features
- ⚡ Edge-optimized globally via Vercel CDN
- 🔄 Automatic builds with Next.js 15 optimization
- 🛡️ Secure environment variable management
- 📈 Built-in performance monitoring and analytics

## 📊 Database Architecture

### Supabase PostgreSQL with Row Level Security
- **Artists**: Trilingual profiles with biographies and metadata
- **Releases**: Complete catalog with reviews, tracklists, and streaming links
- **Products**: E-commerce integration with Stripe and admin overrides
- **Videos**: YouTube integration with metadata and categorization
- **Playlists**: Curated collections with streaming service integration
- **Reviews**: Authentic classical music critic reviews with ratings
- **Users**: Admin authentication with role-based permissions
- **Audit Logs**: Complete administrative action tracking

## 🏗 Production Architecture

- **Frontend**: Next.js 15 App Router with React Server Components
- **API**: Next.js serverless functions with TypeScript
- **Database**: Supabase PostgreSQL with real-time subscriptions
- **Payments**: Stripe with Express Checkout and webhook integration
- **Authentication**: Simple username/password with bcrypt + HTTP-only cookies
- **Styling**: Tailwind CSS v4 with shadcn/ui component library
- **Deployment**: Vercel with automatic scaling and global CDN

## 📈 Current Status (July 2025)

✅ **Production Ready**: Complete e-commerce classical music website
✅ **Content Complete**: 37 releases, 18 artists, authentic reviews
✅ **Payment Processing**: Stripe Express Checkout with Apple Pay/Google Pay
✅ **Admin Management**: Two-tier system with audit logging  
✅ **SEO Optimized**: AI/LLM search + traditional SEO complete
✅ **Performance**: Core Web Vitals optimized, infinite scroll UX