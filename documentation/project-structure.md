# Project Structure - Avanticlassic Repository

## 📁 **Repository Overview - Updated July 14, 2025**

```
avanticlassic/
├── 📄 README.md                    # Main project documentation
├── 📄 CLAUDE.md                    # Development guidelines and commands
├── 📄 CONTEXT_RECAP.md             # Current project status and priorities
├── 📄 DEPLOYMENT.md                # Deployment instructions
├── 📄 .gitignore                   # Git ignore patterns
├── 📄 .env.example                 # Environment variables template
├── 📄 vercel.json                  # Vercel deployment configuration
├── 📄 package.json                 # Next.js project dependencies
├── 📄 tailwind.config.ts           # Tailwind CSS configuration
├── 📄 tsconfig.json                # TypeScript configuration
│
├── 📂 admin-panel/                 # Next.js Admin CMS [PRODUCTION]
├── 📂 app/                         # Next.js App Directory
├── 📂 components/                  # React Components
├── 📂 contexts/                    # React Context Providers
├── 📂 hooks/                       # Custom React Hooks
├── 📂 lib/                         # Shared Utilities
├── 📂 public/                      # Static Assets
├── 📂 supabase/                    # Database Schema and Migrations
├── 📂 documentation/               # Project Documentation
├── 📂 old-astro-site/              # Preserved Astro Migration
└── 📂 avanti-classic-template/     # Original v0 Template (Archived)
```

---

## 🔐 **Admin Panel Structure (`admin-panel/`) - PRODUCTION READY**

**Technology**: Next.js 15 + TypeScript + Tailwind CSS + Auth.js v5 + Supabase
**Live URL**: https://avanticlassic-admin-qp2uem9ho-carlos-2227s-projects.vercel.app
**Status**: ✅ Fully Deployed and Functional

```
admin-panel/
├── 📄 README.md                    # Admin panel documentation
├── 📄 package.json                 # Next.js dependencies
├── 📄 next.config.ts               # Next.js configuration
├── 📄 tailwind.config.ts           # Tailwind configuration  
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 .env.example                 # Environment template
├── 📄 .env.local                   # Local environment (git ignored)
├── 📄 .env.production              # Production environment (deployment)
├── 📄 vercel.json                  # Vercel deployment configuration
│
├── 📂 src/
│   ├── 📂 app/                     # Next.js App Router
│   │   ├── 📄 layout.tsx           # Root layout with providers
│   │   ├── 📄 page.tsx             # Home page (redirects to dashboard)
│   │   ├── 📄 globals.css          # Global styles
│   │   │
│   │   ├── 📂 api/                 # API Routes
│   │   │   └── 📂 auth/            # Auth.js v5 API routes
│   │   │       └── 📂 [...nextauth]/
│   │   │           └── 📄 route.ts # Auth handlers (GET/POST)
│   │   │
│   │   ├── 📂 auth/
│   │   │   ├── 📂 signin/
│   │   │   │   └── 📄 page.tsx     # Google OAuth sign-in page
│   │   │   └── 📂 error/
│   │   │       └── 📄 page.tsx     # Authentication error page
│   │   │
│   │   └── 📂 dashboard/           # Protected admin area
│   │       ├── 📄 page.tsx         # Dashboard with analytics
│   │       ├── 📄 layout.tsx       # Dashboard layout with sidebar
│   │       │
│   │       ├── 📂 artists/         # ✅ Artist Management
│   │       │   ├── 📄 page.tsx     # Artists list and grid
│   │       │   ├── 📂 new/
│   │       │   │   └── 📄 page.tsx # Create new artist
│   │       │   └── 📂 [id]/
│   │       │       └── 📂 edit/
│   │       │           └── 📄 page.tsx # Edit artist profile
│   │       │
│   │       ├── 📂 releases/        # ✅ Releases Management + Drag-and-Drop
│   │       │   ├── 📄 page.tsx     # Releases catalog with drag-and-drop ordering (@dnd-kit)
│   │       │   ├── 📂 new/
│   │       │   │   └── 📄 page.tsx # Create new release
│   │       │   └── 📂 [id]/
│   │       │       └── 📂 edit/
│   │       │           └── 📄 page.tsx # Edit release details
│   │       │
│   │       ├── 📂 videos/          # ✅ Videos Management
│   │       │   ├── 📄 page.tsx     # Videos gallery management
│   │       │   ├── 📂 new/
│   │       │   │   └── 📄 page.tsx # Add new video
│   │       │   └── 📂 [id]/
│   │       │       └── 📂 edit/
│   │       │           └── 📄 page.tsx # Edit video with YouTube metadata
│   │       │
│   │       ├── 📂 playlists/       # ✅ Playlists Management
│   │       │   ├── 📄 page.tsx     # Playlists overview
│   │       │   ├── 📂 new/
│   │       │   │   └── 📄 page.tsx # Create playlist (By Artist/Composer)
│   │       │   └── 📂 [id]/
│   │       │       └── 📂 edit/
│   │       │           └── 📄 page.tsx # Edit playlist with external links
│   │       │
│   │       ├── 📂 reviews/         # ✅ Reviews Management
│   │       │   ├── 📄 page.tsx     # Reviews list with ratings
│   │       │   ├── 📂 new/
│   │       │   │   └── 📄 page.tsx # Create new review
│   │       │   └── 📂 [id]/
│   │       │       └── 📂 edit/
│   │       │           └── 📄 page.tsx # Edit review and rating
│   │       │
│   │       ├── 📂 distributors/    # ✅ Distributors Management
│   │       │   ├── 📄 page.tsx     # Distributors with country flags
│   │       │   ├── 📂 new/
│   │       │   │   └── 📄 page.tsx # Add new distributor
│   │       │   └── 📂 [id]/
│   │       │       └── 📂 edit/
│   │       │           └── 📄 page.tsx # Edit distributor info
│   │       │
│   │       ├── 📂 settings/        # ✅ Site Settings [RESTRICTED]
│   │       │   └── 📄 page.tsx     # General, Social, Email, Advanced tabs
│   │       │
│   │       └── 📂 users/           # ✅ [DEPLOYED] User Management
│   │           ├── 📄 page.tsx     # Admin users list [SUPER ADMIN ONLY]
│   │           ├── 📂 new/
│   │           │   └── 📄 page.tsx # Create admin user [SUPER ADMIN ONLY]
│   │           └── 📂 [id]/
│   │               └── 📂 edit/
│   │                   └── 📄 page.tsx # Edit user roles [SUPER ADMIN ONLY]
│   │
│   ├── 📄 auth.ts                  # Auth.js v5 configuration
│   ├── 📄 middleware.ts            # Route protection middleware
│   │
│   ├── 📂 lib/
│   │   ├── 📄 supabase.ts          # Supabase client and types
│   │   ├── 📄 permissions.ts       # ✅ [DEPLOYED] Role-based permissions
│   │   └── 📄 audit.ts             # ✅ [DEPLOYED] Audit logging utilities
│   │
│   └── 📂 components/
│       ├── 📄 admin-sidebar.tsx    # Navigation sidebar with role-based visibility
│       ├── 📄 providers.tsx        # Auth and session providers
│       └── 📂 ui/                  # Shared UI components
│
├── 📂 supabase/                    # Database Schema
│   ├── 📄 schema.sql               # Complete database schema
│   └── 📂 migrations/              # Database migrations
│       ├── 📄 001_initial.sql      # Initial schema
│       ├── 📄 002_auth.sql         # Authentication tables
│       ├── 📄 003_content.sql      # Content management tables
│       ├── 📄 004_playlists.sql    # Playlist categories update
│       └── 📄 005_user_roles.sql   # ✅ [DEPLOYED] User roles and audit logging
│
└── 📂 public/                      # Static assets for admin panel
```

### **Admin Panel Key Features - COMPLETED:**
- ✅ **Google OAuth Authentication** with Auth.js v5 (Production)
- ✅ **Dashboard Interface** with content statistics and analytics
- ✅ **Complete CRUD Operations** for all content types
- ✅ **Responsive Design** with black & white professional theme
- ✅ **Mobile Sidebar** with collapsible navigation
- ✅ **Database Integration** with Supabase PostgreSQL
- ✅ **YouTube Integration** for video metadata fetching
- ✅ **Production Deployment** at https://avanticlassic-admin-qp2uem9ho-carlos-2227s-projects.vercel.app

### **Admin Panel Critical Issues - RESOLVED:**
- ✅ **Two-Tier Admin Architecture** - Company admin vs super admin roles implemented
- ✅ **Role-Based Access Control** - Settings restricted to super admins only (working)
- ✅ **User Management Interface** - Super admins can add/remove company admins (operational)
- ✅ **Audit Logging** - Complete tracking of all administrative actions (active)

---

## 🌐 **Next.js Site Structure (`app/`) - MAIN WEBSITE**

**Technology**: Next.js 15 + TypeScript + Tailwind CSS
**Live URL**: https://avanticlassic.vercel.app

```
app/
├── 📄 layout.tsx                   # Root layout with metadata
├── 📄 page.tsx                     # Homepage with intro video
├── 📄 globals.css                  # Global styles with Playfair Display
├── 📄 favicon.ico                  # Site favicon
│
├── 📂 about/
│   └── 📄 page.tsx                 # About page with all 26 distributors
│
├── 📂 artists/
│   ├── 📄 loading.tsx              # Loading state
│   ├── 📄 page.tsx                 # Artists grid (no instrument dropdown)
│   └── 📂 [id]/
│       └── 📄 page.tsx             # Individual artist pages with bigger photos
│
├── 📂 releases/
│   ├── 📄 loading.tsx              # Loading state
│   ├── 📄 page.tsx                 # Releases catalog (same size as artists)
│   └── 📂 [id]/
│       └── 📄 page.tsx             # Release detail with tracklist
│
├── 📂 videos/                      # Renamed from "news-and-more"
│   ├── 📄 loading.tsx              # Loading state
│   └── 📄 page.tsx                 # Videos gallery with YouTube integration
│
├── 📂 playlists/
│   ├── 📄 loading.tsx              # Loading state
│   └── 📄 page.tsx                 # Playlists by artist and composer
│
└── 📂 api/                         # API Routes for detailed pages  
    ├── 📄 releases/
    │   └── 📄 route.ts             # 🔧 FIXED: Release ordering API (translation layer)
    ├── 📂 artists/
    │   └── 📂 [id]/
    │       └── 📄 route.ts         # Artist detail API with URL encoding
    ├── 📂 releases/
    │   └── 📂 [id]/
    │       └── 📄 route.ts         # Release detail API with special characters
    └── 📂 videos/
        └── 📂 [id]/
            └── 📄 route.ts         # Video detail API
```

### **Main Site Key Features - COMPLETED:**
- ✅ **Video Hero Section** with intro.mp4 (muted, hover sound control)
- ✅ **Enhanced Typography** with Playfair Display font
- ✅ **Consistent Card Sizes** between artists and releases
- ✅ **No Instrument Classification** - dropdown removed
- ✅ **Bigger Artist Photos** - 100% larger profile images
- ✅ **No Performer Subtitles** - cleaned up artist presentations
- ✅ **26 Distributors** - complete distributor list on About page
- ✅ **Videos & More Page** - transformed from "News & More"
- ✅ **Special Character Support** - URL encoding for release titles  
- ✅ **Multilingual Support** - EN/FR/DE routing (inherited from Astro)
- ✅ **Release Ordering Sync** - Main site displays admin-configured order via fixed API

---

## 🗄️ **Database Structure (`supabase/`) - PRODUCTION**

```
supabase/
├── 📄 nextauth-schema.sql          # Auth.js v5 authentication schema
├── 📄 schema.sql                   # Complete content management schema
├── 📄 fix-rls.sql                  # Row Level Security policies
├── 📄 fix-sequence.sql             # Database sequence fixes
│
└── 📂 migrations/                  # Version-controlled schema changes
    ├── 📄 001_initial_schema.sql   # Base content tables
    ├── 📄 002_auth_integration.sql # Authentication integration
    ├── 📄 003_multilingual.sql     # Translation table setup
    ├── 📄 004_playlist_categories.sql # "By Artist"/"By Composer" categories
    └── 📄 005_user_roles.sql       # 🚨 [PLANNED] Admin roles and audit logging
```

### **Database Tables - PRODUCTION:**
- ✅ **admin_users** - Authentication with Google OAuth
- ✅ **artists** - Artist profiles with biography and images
- ✅ **releases** - Album information with tracklists, metadata, and sort_order field
- ✅ **videos** - Video gallery with YouTube integration
- ✅ **playlists** - Curated playlists by artist/composer with external links
- ✅ **reviews** - 5-star rating system with publication controls
- ✅ **distributors** - Global distribution network with contact information
- ✅ **Translation Tables** - Multilingual content support for all types
- ✅ **admin_audit_log** - [DEPLOYED] Audit trail for administrative actions

### **Database Relationships:**
- ✅ **Foreign Keys** properly configured between all content types
- ✅ **Cascade Deletes** for maintaining data integrity
- ✅ **Multilingual Support** with translation tables
- ✅ **RLS Policies** for secure data access

---

## 📚 **Documentation Structure (`documentation/`) - UPDATED**

```
documentation/
├── 📄 project.spec.md              # High-level project overview
├── 📄 ssg-module.spec.md           # SSG technical specification
├── 📄 admin-cms-system.feat.md     # CMS feature specification
├── 📄 content-management.feat.md   # Content workflow specification
├── 📄 i18n-system.feat.md          # Internationalization system
├── 📄 typescript.coding-style.md   # TypeScript coding standards
├── 📄 implementation-plan.md       # ✅ UPDATED: Project phases with current status
├── 📄 bug-tracking.md              # ✅ UPDATED: Critical two-tier admin architecture issue
├── 📄 project-structure.md         # ✅ UPDATED: This file with current structure
├── 📄 frontend.spec.md             # ✅ UPDATED: UI/UX guidelines with admin design
└── 📄 tasks.md                     # Task breakdown and references
```

---

## 🔄 **Legacy and Archive Structures**

### **Old Astro Site (`old-astro-site/`) - ARCHIVED**
```
old-astro-site/                     # Preserved Astro migration
├── 📂 src/                         # Astro source code
├── 📂 public/                      # Astro assets
└── 📄 astro.config.mjs             # Astro configuration
```

### **Original Template (`avanti-classic-template/`) - ARCHIVED**
```
avanti-classic-template/            # Original v0 template (reference only)
└── [Original template files preserved for reference]
```

**Preservation Purpose:**
- 📚 **Historical Reference** for understanding migration decisions
- 🔄 **Fallback Documentation** for reverting changes if needed
- 📖 **Learning Resource** for understanding previous implementations

---

## 🚀 **Build and Deployment - PRODUCTION STATUS**

### **Build Outputs:**
- ✅ **Main Site**: Deployed to https://avanticlassic.vercel.app
- ✅ **Admin Panel**: Deployed to https://avanticlassic-admin-qp2uem9ho-carlos-2227s-projects.vercel.app
- ✅ **Database**: Supabase production environment with real data
- ✅ **Assets**: Optimized and served via Vercel CDN

### **Deployment Status:**
- ✅ **Main Site**: Automatic builds from main branch
- ✅ **Admin Panel**: Production deployment with Auth.js v5
- ✅ **Database**: Supabase PostgreSQL in production
- ✅ **Environment Variables**: Properly configured for both environments

### **Environment Configuration:**
- ✅ **Development**: Local with `.env.local` files
- ✅ **Production**: Vercel with encrypted environment variables
- ✅ **Database**: Production Supabase with RLS policies
- ✅ **Authentication**: Google OAuth properly configured

---

## 📊 **File Statistics - UPDATED**

### **Code Files:**
- **TypeScript/JavaScript**: ~45 files (includes admin panel)
- **React Components**: ~25 files (admin panel UI)
- **Next.js Pages**: ~30 files (main site + admin)
- **CSS Files**: ~5 files (global styles and Tailwind)

### **Content Management:**
- ✅ **Complete CRUD Operations** for all content types
- ✅ **Database Tables**: 8+ production tables with relationships
- ✅ **Admin Interfaces**: Fully functional content management
- ✅ **External Integrations**: YouTube oEmbed API working

### **Asset Files:**
- **Images**: 200+ files (artists, releases, carousel)
- **Fonts**: Playfair Display font family
- **Videos**: intro.mp4 for homepage hero
- **Icons**: Professional favicons and logos

### **Total Repository Size:**
- **Estimated**: ~60MB (including admin panel and images)
- **Code Only**: ~5MB (includes admin panel)
- **Documentation**: ~1MB (comprehensive documentation)

---

## ✅ **CRITICAL STEPS COMPLETED**

### **✅ Implemented Priority (Completed This Week):**
1. ✅ **Database Schema Update** - User roles and audit logging tables deployed
2. ✅ **Role-Based Middleware** - Permission checking implemented for all routes
3. ✅ **User Management Interface** - Complete CRUD for managing admin accounts
4. ✅ **Navigation Updates** - Settings hidden from company admins (working)
5. ✅ **Audit Logging** - Complete tracking of all administrative actions

### **✅ Security Implementation Timeline COMPLETED:**
- ✅ **Day 1**: Database schema changes and role checking implemented
- ✅ **Day 1**: UI updates and user management interface operational
- ✅ **Day 1**: Audit logging and comprehensive testing completed
- ✅ **Day 1**: Security validation and production deployment successful

## ✅ **LATEST UPDATES (July 14, 2025)**

### **🎯 Drag-and-Drop Release Ordering - COMPLETED:**
- ✅ **@dnd-kit Integration**: Core, sortable, and utilities libraries added
- ✅ **Visual Interface**: Three-dot drag handles with real-time feedback  
- ✅ **Database Sync**: Automatic `sort_order` field updates on drag completion
- ✅ **Main Site Sync**: API translation layer fixed - public site shows admin order
- ✅ **Error Handling**: Failed updates revert to original order with user notification

### **🔧 Critical API Fix - RESOLVED:**
- ✅ **Translation Layer Issue**: Removed `!inner` join requirement from releases API
- ✅ **Empty Response Fix**: API now returns actual releases instead of fallback data
- ✅ **Order Synchronization**: Main site immediately reflects admin drag-and-drop changes

### **📦 New Dependencies Added:**
```json
{
  "@dnd-kit/core": "^6.3.1",
  "@dnd-kit/sortable": "^10.0.0", 
  "@dnd-kit/utilities": "^3.2.2"
}
```

### **🛠️ Key Files Modified:**
- `admin-panel/src/app/dashboard/releases/page.tsx` - Complete drag-and-drop implementation
- `app/api/releases/route.ts` - API translation layer fixes for proper ordering
- `admin-panel/package.json` - Added @dnd-kit dependencies

### **🎯 Session Handover Ready:**
All systems operational with comprehensive documentation for seamless session continuation.

**Current Status**: Comprehensive admin panel CMS with two-tier admin architecture, drag-and-drop ordering, and synchronized content display successfully deployed and production-ready for multi-user management.