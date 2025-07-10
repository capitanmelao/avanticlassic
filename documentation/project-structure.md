# Project Structure - Avanticlassic Repository

## 📁 **Repository Overview**

```
avanticlassic/
├── 📄 README.md                    # Main project documentation
├── 📄 CLAUDE.md                    # Development guidelines and commands
├── 📄 CONTEXT_RECAP.md             # Current project status and context
├── 📄 DEPLOYMENT.md                # Deployment instructions
├── 📄 .gitignore                   # Git ignore patterns
├── 📄 .env.example                 # Environment variables template
├── 📄 vercel.json                  # Vercel deployment configuration
├── 📄 package.json                 # Astro project dependencies
├── 📄 astro.config.mjs             # Astro framework configuration
├── 📄 tailwind.config.mjs          # Tailwind CSS configuration
├── 📄 tsconfig.json                # TypeScript configuration
│
├── 📂 admin-panel/                 # Next.js Admin System [NEW]
├── 📂 src/                         # Astro Site Source Code
├── 📂 public/                      # Static Assets and Images
├── 📂 supabase/                    # Database Schema and Configuration
├── 📂 documentation/               # Project Documentation
├── 📂 ssg-eta/                     # Baptiste's Original SSG (Preserved)
└── 📂 dist/                        # Build Output (Generated)
```

---

## 🔐 **Admin Panel Structure (`admin-panel/`)**

**Technology**: Next.js 14 + TypeScript + Tailwind CSS + NextAuth.js

```
admin-panel/
├── 📄 README.md                    # Admin panel documentation
├── 📄 package.json                 # Next.js dependencies
├── 📄 next.config.ts               # Next.js configuration
├── 📄 tailwind.config.ts           # Tailwind configuration
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 .env.example                 # Environment template
├── 📄 .env.local                   # Local environment (git ignored)
│
├── 📂 src/
│   ├── 📂 app/                     # Next.js App Router
│   │   ├── 📄 layout.tsx           # Root layout with providers
│   │   ├── 📄 page.tsx             # Home page (redirects to dashboard)
│   │   ├── 📄 providers.tsx        # NextAuth session provider
│   │   ├── 📄 globals.css          # Global styles
│   │   │
│   │   ├── 📂 api/
│   │   │   └── 📂 auth/
│   │   │       └── 📂 [...nextauth]/
│   │   │           └── 📄 route.ts # NextAuth configuration
│   │   │
│   │   ├── 📂 auth/
│   │   │   ├── 📂 signin/
│   │   │   │   └── 📄 page.tsx     # Google OAuth sign-in page
│   │   │   └── 📂 error/
│   │   │       └── 📄 page.tsx     # Authentication error page
│   │   │
│   │   └── 📂 dashboard/
│   │       └── 📄 page.tsx         # Main admin dashboard
│   │
│   └── 📄 middleware.ts            # Route protection middleware
│
└── 📂 public/                      # Static assets for admin panel
```

### **Admin Panel Key Features:**
- 🔐 **Google OAuth Authentication** with NextAuth.js
- 🛡️ **Single Admin Access** (Fred's email only)
- 📱 **Responsive Design** with Tailwind CSS
- 🔒 **Protected Routes** with middleware
- 📊 **Dashboard Interface** with content statistics

---

## 🎵 **Astro Site Structure (`src/`)**

**Technology**: Astro 4 + TypeScript + Tailwind CSS

```
src/
├── 📂 data/                        # JSON Data Files
│   ├── 📄 artists.json             # Artist profiles (19 artists)
│   ├── 📄 releases.json            # Album releases (37 releases)
│   ├── 📄 videos.json              # Video gallery (15 videos)
│   └── 📄 distributors.json        # Partner distributors
│
├── 📂 i18n/                        # Internationalization
│   ├── 📄 en.json                  # English translations
│   ├── 📄 fr.json                  # French translations
│   └── 📄 de.json                  # German translations
│
├── 📂 layouts/
│   └── 📄 BaseLayout.astro         # Main site layout with navigation
│
├── 📂 pages/                       # Astro Pages (File-based Routing)
│   ├── 📄 index.astro              # Root redirect to /en/
│   └── 📂 [lang]/                  # Language-specific routes
│       ├── 📄 index.astro          # Homepage with carousel
│       ├── 📂 about/
│       │   └── 📄 index.astro      # About page
│       ├── 📂 artists/
│       │   ├── 📄 index.astro      # Artists listing (page 1)
│       │   ├── 📄 [slug].astro     # Individual artist pages
│       │   └── 📂 page/
│       │       └── 📄 [page].astro # Artists pagination
│       ├── 📂 releases/
│       │   ├── 📄 index.astro      # Releases catalog
│       │   └── 📄 [slug].astro     # Individual release pages
│       └── 📂 videos/
│           ├── 📄 index.astro      # Videos gallery (page 1)
│           └── 📂 page/
│               └── 📄 [page].astro # Videos pagination
│
├── 📂 styles/
│   └── 📄 global.css               # Global styles with Tailwind imports
│
├── 📂 types/
│   └── 📄 index.ts                 # TypeScript type definitions
│
└── 📂 utils/
    └── 📄 data.ts                  # Data loading and utility functions
```

### **Astro Site Key Features:**
- 🌍 **Multilingual Support** (EN/FR/DE) with proper routing
- 📄 **Static Site Generation** (202 pages total)
- 🎨 **Responsive Design** preserving Baptiste's aesthetic
- 🔍 **SEO Optimized** with hreflang and Open Graph tags
- ⚡ **High Performance** with sub-2s load times

---

## 🖼️ **Public Assets Structure (`public/`)**

```
public/
├── 📄 favicon.ico                  # Site favicon
├── 📄 favicon.svg                  # SVG favicon
│
├── 📂 fonts/                       # Custom Typography
│   ├── 📄 Helvetica.woff2          # Regular weight
│   ├── 📄 Helvetica-Light.woff2    # Light weight
│   └── 📄 Helvetica-Bold.woff2     # Bold weight
│
└── 📂 images/                      # Image Assets
    ├── 📄 logo.jpeg                # Avanticlassic logo
    ├── 📂 carousel/                # Homepage carousel images
    │   ├── 📄 carousel1.jpg        # Carousel slide 1
    │   ├── 📄 carousel2.jpg        # Carousel slide 2
    │   ├── 📄 carousel3.jpg        # Carousel slide 3
    │   ├── 📄 carousel4.jpg        # Carousel slide 4
    │   └── 📄 carousel5.jpg        # Carousel slide 5
    ├── 📂 artists/                 # Artist Profile Images
    │   ├── 📄 [id]-800.jpeg        # Thumbnail (800px)
    │   ├── 📄 [id]-1125.jpeg       # Medium (1125px)
    │   └── 📄 [id]-1500.jpeg       # Full size (1500px)
    └── 📂 releases/                # Album Cover Art
        ├── 📄 [id].jpeg            # Standard cover (400px)
        └── 📄 [id]-1200.jpeg       # High-res cover (1200px)
```

### **Image Organization:**
- 📐 **Multiple Sizes** for responsive design
- 🎨 **Optimized Formats** for web delivery
- 📁 **Organized Structure** by content type
- 🏷️ **ID-based Naming** for easy management

---

## 🗄️ **Database Structure (`supabase/`)**

```
supabase/
└── 📄 schema.sql                   # Complete database schema
```

### **Database Tables:**
- 👤 **admin_users** - Authentication and session management
- 🎵 **artists** - Artist profiles and metadata
- 💿 **releases** - Album information and tracklists
- 📹 **videos** - Video gallery with YouTube integration
- 🏢 **distributors** - Partner distributor information
- 📝 **content_changes** - Audit log for all modifications
- 🚀 **build_status** - Deployment tracking and monitoring

---

## 📚 **Documentation Structure (`documentation/`)**

```
documentation/
├── 📄 project.spec.md              # High-level project overview
├── 📄 ssg-module.spec.md           # SSG technical specification
├── 📄 admin-cms-system.feat.md     # CMS feature specification
├── 📄 content-management.feat.md   # Content workflow specification
├── 📄 i18n-system.feat.md          # Internationalization system
├── 📄 typescript.coding-style.md   # TypeScript coding standards
├── 📄 implementation-plan.md       # Project phases and timeline [NEW]
├── 📄 bug-tracking.md              # Issue tracking and resolution [NEW]
├── 📄 project-structure.md         # This file [NEW]
├── 📄 frontend.spec.md             # UI/UX guidelines [PLANNED]
└── 📄 tasks.md                     # Task breakdown and references
```

---

## 🔄 **Baptiste's Original Work (`ssg-eta/`)**

**Preserved for Reference and Fallback**

```
ssg-eta/                            # Complete original system
├── 📄 README.md                    # Original documentation
├── 📂 eta-files/                   # Eta templates
├── 📂 data/                        # Original JSON data
├── 📂 i18n/                        # Translation files
├── 📂 services/                    # TypeScript services
├── 📂 assets/                      # Original assets
└── 📂 _site/                       # Generated static site
```

### **Preservation Purpose:**
- 📚 **Reference Implementation** for understanding original logic
- 🔄 **Fallback Option** if needed during development
- 📖 **Learning Resource** for understanding Baptiste's architecture
- 🎨 **Design Reference** for maintaining visual consistency

---

## 🚀 **Build and Deployment**

### **Build Outputs:**
- **Astro Site**: `dist/` directory (202 static HTML pages)
- **Admin Panel**: Built and deployed separately to Vercel
- **Assets**: Copied to build output for CDN delivery

### **Deployment Targets:**
- **Main Site**: Vercel (automatic builds from main branch)
- **Admin Panel**: Vercel (separate project, manual or automatic)
- **Database**: Supabase (hosted PostgreSQL)
- **Assets**: Vercel CDN (global distribution)

### **Environment Configuration:**
- **Development**: Local with `.env.local` files
- **Staging**: Vercel preview deployments
- **Production**: Vercel with environment variables

---

## 📊 **File Statistics**

### **Code Files:**
- **TypeScript/JavaScript**: ~25 files
- **Astro Components**: ~15 files
- **React Components**: ~8 files (admin panel)
- **CSS Files**: ~3 files (global styles)

### **Content Files:**
- **JSON Data**: 4 files (artists, releases, videos, distributors)
- **Translation Files**: 3 files (EN/FR/DE)
- **Documentation**: ~12 files

### **Asset Files:**
- **Images**: 200+ files (artists, releases, carousel)
- **Fonts**: 3 files (Helvetica variants)
- **Icons**: 5+ files (logos, favicons)

### **Total Repository Size:**
- **Estimated**: ~50MB (including images)
- **Code Only**: ~2MB
- **Documentation**: ~500KB