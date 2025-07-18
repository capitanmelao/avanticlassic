# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🎉 **MAJOR UPDATE - JULY 18, 2025**

**✅ E-COMMERCE SHOP SYSTEM COMPLETE & OPTIMIZED**  
Full Stripe-integrated shopping platform with database-driven product catalog successfully implemented, deployed, and optimized for user experience.

### ✅ Latest Session Achievements (July 18, 2025)

#### **E-COMMERCE SYSTEM IMPLEMENTATION**
- **Status**: ✅ Production Ready and Deployed
- **Current Tag**: `v1.2.0-shop-complete`
- **Previous Tag**: `v1.1.0-ecommerce-complete`
- **Shop URL**: https://avanticlassic.vercel.app/shop
- **Products**: 37 classical music releases available for purchase

#### **Key Features Implemented:**
- ✅ **Complete Shop System** - Product catalog, cart, and Stripe checkout
- ✅ **Database Integration** - 37 products populated from releases table
- ✅ **Shopping Cart** - Persistent cart with localStorage and React Context
- ✅ **Stripe Payment Processing** - Live API integration with secure checkout
- ✅ **Order Management** - Complete order tracking and customer system
- ✅ **API Routes** - Products, cart, checkout, orders, and Stripe webhooks
- ✅ **Mobile Optimized** - Responsive design for all screen sizes
- ✅ **Direct Purchase** - Buy buttons on release pages with correct pricing
- ✅ **Simplified Shop** - Streamlined shop page focused on products

#### **Critical Issues Resolved:**
- ✅ **Database Queries** - Fixed column names and relationship syntax
- ✅ **Environment Variables** - Correct Supabase client configuration
- ✅ **Build Dependencies** - Added missing Stripe packages
- ✅ **Production Deployment** - All environment variables configured in Vercel
- ✅ **Pricing Display** - Fixed €0.00 issue, now shows correct prices (€14.00 CD, €16.00 Hybrid SACD)
- ✅ **Format Mapping** - Fixed database constraints and format capitalization
- ✅ **UUID Compatibility** - Updated product creation for UUID-based schema

## Project Overview

This is a multilingual (English/French/German) classical music website for Avanti Classic with a comprehensive admin CMS and complete e-commerce shop system. Successfully migrated from Baptiste's custom SSG to Next.js with full two-tier admin architecture and Stripe-integrated shopping platform.

### ✅ Production Architecture (COMPLETED)
- **Next.js Main Site** (`app/`): Modern site with Playfair Display typography, enhanced UX, and complete e-commerce shop
- **Admin Panel CMS** (`admin-panel/`): ✅ **PRODUCTION READY** - Two-tier role-based admin system
- **E-commerce Shop** (`app/shop/`): ✅ **PRODUCTION READY** - Stripe-integrated shopping platform
- **Legacy SSG** (`ssg-eta/`): Baptiste's custom implementation (archived for reference)
- **Database**: Supabase PostgreSQL with comprehensive schema, audit logging, and e-commerce tables

### ✅ Admin Panel Status (DEPLOYED)
- **URL**: https://avanticlassic-admin.vercel.app
- **Authentication**: ✅ Simple username/password system (leinso@gmail.com / Naviondo123.1)
- **Previous**: Google OAuth with Auth.js v5 replaced due to deployment issues
- **Two-Tier Architecture**: Company Admins + Super Admins with role-based access control
- **Security**: Complete audit logging and permission validation
- **User Management**: Super admins can manage company admin accounts
- **Playlist System**: ✅ Complete CRUD with image uploads and metadata retrieval

### ✅ Playlist System (NEWLY IMPLEMENTED)
- **Public API**: `/app/api/playlists/route.ts` - Database-driven content
- **Categories**: "By Artist" and "By Composer" sections
- **Visual Design**: Bold gradient headers, animated backgrounds, hover effects
- **Streaming Links**: Direct integration with Spotify, Apple Music, YouTube
- **Featured System**: Hero section showcases featured playlists
- **Image Management**: Server-side upload API with proper authentication
- **Metadata Auto-Fetch**: Retrieves playlist info from streaming URLs

### ✅ Shop System Optimization (LATEST)
- **Simplified Design**: Removed unnecessary sections for cleaner UX
- **Direct Purchase**: Buy buttons on release pages with correct pricing (€14.00 CD, €16.00 Hybrid SACD)
- **Minimalist Shop**: Streamlined shop page with just "Browse All" button and featured products
- **Format Display**: Fixed capitalization (CD not cd, Hybrid SACD not hybrid_sacd)
- **Database Integration**: UUID-based products with proper price variant mapping
- **Production Ready**: All pricing issues resolved, fully functional e-commerce

## Development Commands

### Next.js Main Site (Production)
- **Development server**: `npm run dev` - Serves at http://localhost:3000
- **Build**: `npm run build` - Production build with optimizations  
- **Production URL**: https://avanticlassic.vercel.app

### Admin Panel (admin-panel/) - ✅ PRODUCTION READY  
- **Development server**: `cd admin-panel && npm run dev` - Serves at http://localhost:3000 (different port when both running)
- **Build**: `cd admin-panel && npm run build` - Production build for Vercel
- **Production URL**: https://avanticlassic-admin.vercel.app
- **Authentication**: leinso@gmail.com / Naviondo123.1 (Super Admin)

### Legacy References (Archived)
- **Old Astro Site**: `old-astro-site/` - Archived migration reference
- **SSG**: `ssg-eta/` - Baptiste's original implementation (archived)

## ✅ Production Architecture

### Next.js Main Site Structure (`app/`)
- **Framework**: Next.js 15 with App Router and TypeScript
- **Routing**: File-based routing with dynamic pages for artists, releases, videos
- **Database**: Supabase PostgreSQL with comprehensive content schema
- **Typography**: Playfair Display font for enhanced classical music aesthetic
- **Multilingual**: EN/FR/DE support with proper URL encoding for special characters
- **Enhanced UX**: 
  - Video hero section with intro.mp4 (muted, hover sound control)
  - Artist pictures 100% larger with no instrument classification
  - Release cards same size as artist cards
  - Complete distributor list (26 distributors)
  - **NEW**: Dynamic playlist page with bold visual design

### ✅ Admin Panel CMS Structure (`admin-panel/`)
- **Framework**: Next.js 15 + TypeScript + Tailwind CSS
- **Authentication**: ✅ Simple username/password system (leinso@gmail.com / Naviondo123.1)
- **Previous**: Auth.js v5 with Google OAuth replaced due to deployment issues
- **Database**: Supabase PostgreSQL with audit logging
- **Two-Tier Architecture**:
  - **Company Admins**: Content management only (artists, releases, videos, playlists, reviews, distributors)
  - **Super Admins**: Full system access + user management + settings
- **Security**: Role-based middleware, audit logging, permission validation
- **Features**:
  - Complete CRUD for all content types
  - **Drag-and-drop reordering** for releases with real-time database updates
  - YouTube metadata integration for videos
  - **NEW**: Playlist management with image uploads and streaming integration
  - **NEW**: Automatic metadata retrieval from streaming services
  - 5-star review system
  - User management interface (super admin only)
  - Comprehensive site settings

## ✅ Production Environment Configuration

### Main Site Environment
- **Production URL**: https://avanticlassic.vercel.app
- **Database**: Supabase PostgreSQL (production)
- **Framework**: Next.js 15 with App Router
- **New Dependencies**: @supabase/ssr for server-side rendering

### Admin Panel Environment  
- **Production URL**: https://avanticlassic-admin.vercel.app
- **Database**: Supabase PostgreSQL (shared with main site)
- **Authentication**: Simple username/password system (leinso@gmail.com / Naviondo123.1)
- **Framework**: Next.js 15 + Simple Authentication

## ✅ Production Dependencies

### Next.js Site Dependencies
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Supabase client for database
- **NEW**: @supabase/ssr for server-side database access
- Playfair Display font

### Admin Panel Dependencies
- Next.js 15 + TypeScript
- Simple Authentication System (bcrypt + HTTP-only cookies)
- Supabase for database and RLS
- Tailwind CSS for professional UI
- Heroicons for navigation icons
- YouTube oEmbed API integration
- **@dnd-kit libraries** for drag-and-drop functionality (core, sortable, utilities)
- **NEW**: Metadata retrieval system for streaming services

## ✅ Authentication System Overhaul (July 15, 2025)

### Simple Authentication System Implementation
**Status**: ✅ Production-ready authentication system successfully implemented
**Issue**: Auth.js v5 deployment failures causing 500 errors on Vercel
**Solution**: Complete replacement with simple, secure authentication system

#### ✅ Authentication System Features:
- ✅ **Simple Login**: Username/password authentication (leinso@gmail.com / Naviondo123.1)
- ✅ **Secure Password**: bcrypt hashing with 12 salt rounds
- ✅ **Session Management**: HTTP-only cookies with 24-hour expiration
- ✅ **Role-Based Access**: Super admin role with full system access
- ✅ **Custom Implementation**: No external dependencies for authentication
- ✅ **Production Ready**: All TypeScript and build issues resolved

#### ✅ Core Authentication Files:
- **admin-panel/src/lib/auth.ts**: Core authentication logic with bcrypt
- **admin-panel/src/lib/session.ts**: Session management with HTTP-only cookies
- **admin-panel/src/lib/use-session.ts**: Custom useSession hook
- **admin-panel/src/app/api/auth/login/route.ts**: Login endpoint
- **admin-panel/src/app/api/auth/logout/route.ts**: Logout endpoint
- **admin-panel/src/app/api/auth/me/route.ts**: Session verification
- **admin-panel/src/middleware.ts**: Authentication middleware
- **admin-panel/src/app/auth/signin/page.tsx**: Simple login form

#### ✅ Production Build Fixes:
- ✅ **TypeScript Errors**: Fixed user.id vs user.email type mismatches
- ✅ **Type Guards**: Proper unknown type validation in isValidUser function
- ✅ **ESLint Issues**: All unused variable warnings resolved
- ✅ **Build Process**: Vercel production compilation successful
- ✅ **Development vs Production**: Fixed discrepancies between environments

## ✅ Latest Features Implemented (July 17, 2025)

### Playlist System Complete Overhaul
**Status**: ✅ Fully functional and deployed

#### **Database Integration:**
- **Public API Route**: `/app/api/playlists/route.ts` 
- **Supabase Integration**: Real-time data with translations
- **Category Filtering**: "by_artist" and "by_composer" categories
- **Featured System**: Special highlighting for featured playlists

#### **Visual Design Revolution:**
- **Carousel Removal**: Eliminated horizontal scrolling navigation
- **Bold Section Headers**: Gradient backgrounds with large typography
- **Animated Hero**: Dynamic gradient background with floating elements
- **Interactive Cards**: Hover effects, streaming badges, smooth transitions
- **Responsive Layout**: Mobile-first design with perfect grid layouts

#### **Streaming Service Integration:**
- **Hover Overlays**: Spotify (green), Apple Music (black), YouTube (red) buttons
- **Direct Links**: External access to streaming platforms
- **Metadata Display**: Track counts, descriptions, cover art
- **Featured Badges**: Golden gradient badges for special playlists

#### **Admin Panel Enhancements:**
- **Image Upload API**: `/admin-panel/src/app/api/upload/route.ts`
- **Server-Side Authentication**: Resolves 400 storage errors
- **Metadata Retrieval**: `/admin-panel/src/lib/metadata-retrieval.ts`
- **Auto-Population**: Fetches titles, images from streaming URLs
- **Database Fixes**: Playlist constraint resolved via SQL update

### Technical Implementation Details

#### **New Files Created:**
- `/app/api/playlists/route.ts` - Public playlist API
- `/lib/supabase/client.ts` - Browser-side Supabase client
- `/lib/supabase/server.ts` - Server-side Supabase client
- `/admin-panel/src/app/api/upload/route.ts` - Image upload API
- `/admin-panel/src/app/api/metadata/route.ts` - Metadata retrieval API
- `/admin-panel/src/lib/metadata-retrieval.ts` - Streaming service integration

#### **Major File Updates:**
- `/app/playlists/page.tsx` - Complete transformation with database integration
- `/admin-panel/src/components/ImageUpload.tsx` - Server-side upload integration

#### **Database Schema Updates:**
```sql
-- Fixed playlist categories constraint
ALTER TABLE public.playlists DROP CONSTRAINT IF EXISTS playlists_category_check;
ALTER TABLE public.playlists ADD CONSTRAINT playlists_category_check 
  CHECK (category IN ('by_artist', 'by_composer'));
```

## Documentation Framework

This project uses a facet-based documentation management system with structured documentation files:

### ✅ Updated Documentation Files (July 17, 2025)
- **CLAUDE.md**: Updated with latest playlist system implementation
- **CONTEXT_RECAP.md**: Current project status with playlist transformation
- **documentation/implementation-plan.md**: Roadmap updates with playlist completion
- **documentation/bug-tracking.md**: All playlist creation issues resolved
- **documentation/project-structure.md**: New API routes and components documented
- **documentation/frontend.spec.md**: UI/UX guidelines with new playlist design

### Core Documentation Files  
- **project.spec.md**: High-level project overview and architecture
- **tasks.md**: Structured task breakdown with implementation status
- **typescript.coding-style.md**: Coding standards and style guidelines

### Feature Documentation
- **i18n-system.feat.md**: Internationalization system specification
- **content-management.feat.md**: Content management workflow and admin CMS
- **deployment.md**: Production deployment procedures

### Documentation Status
- ✅ **All critical documentation updated** with current production status
- ✅ **Two-tier admin architecture** fully documented and implemented
- ✅ **Drag-and-drop ordering system** documented and working in production
- ✅ **Security implementation** documented with audit logging details
- ✅ **Production deployment** status and URLs documented
- ✅ **Playlist system** fully documented with API and design specifications

## 🔄 Session Handover Information

### **For New Claude Sessions - Quick Start Guide**

When starting a new session, the following information provides complete context for continuing development:

#### **Current Development Environment:**
- **Main Site**: Running on `npm run dev` → http://localhost:3001
- **Admin Panel**: Running on `cd admin-panel && npm run dev` → http://localhost:3000  
- **Database**: Supabase PostgreSQL (production) - fully populated with real content
- **Authentication**: Simple username/password system (leinso@gmail.com / Naviondo123.1)

#### **Project Status - All Core Features COMPLETED:**
1. ✅ **Two-tier admin architecture** with role-based access control working
2. ✅ **Complete CRUD operations** for all content types (releases, artists, videos, playlists, etc.)
3. ✅ **Drag-and-drop release ordering** with real-time database sync
4. ✅ **Main site order synchronization** - API translation layer fixed
5. ✅ **Production deployment** - Both admin and main site deployed and functional
6. ✅ **Playlist system** - Dynamic, database-driven with bold visual design

#### **Most Recent Work (July 17, 2025):**
- **COMPLETED**: Playlist page transformation with database integration
- **IMPLEMENTED**: Bold two-section design replacing carousel navigation
- **ADDED**: Streaming service integration with hover effects
- **FIXED**: All playlist creation issues (constraints, image uploads, metadata)
- **DEPLOYED**: Production-ready playlist system

#### **Key Technical Context:**
- **Framework**: Next.js 15 with App Router + TypeScript
- **Database**: Supabase with real-time updates and translations
- **Playlist Categories**: "by_artist" and "by_composer" only
- **API Routes**: Public `/api/playlists` and admin upload/metadata APIs
- **Design**: Gradient headers, animated backgrounds, interactive cards

#### **Critical File Locations:**
- **Playlist Page**: `/app/playlists/page.tsx` (complete transformation)
- **Playlist API**: `/app/api/playlists/route.ts` (database integration)
- **Admin Upload**: `/admin-panel/src/app/api/upload/route.ts` (image handling)
- **Metadata System**: `/admin-panel/src/lib/metadata-retrieval.ts` (streaming integration)
- **Supabase Setup**: `/lib/supabase/` (client and server configurations)

#### **Development Workflow:**
1. Start both servers: `npm run dev` (main) + `cd admin-panel && npm run dev` (admin)
2. Admin panel: http://localhost:3000/dashboard/playlists (create/edit playlists)
3. Main site: http://localhost:3001/playlists (view dynamic design)
4. Database: Changes auto-sync between admin and public site

#### **For Debugging Playlist Issues:**
- Check API response: `curl "http://localhost:3001/api/playlists"`
- Verify database: Admin panel → Playlists shows all current data
- Test streaming links: Should display hover overlays with service badges
- Confirm categories: Only "by_artist" and "by_composer" sections appear

### **Session Continuation Context Files:**
- **CLAUDE.md**: This file - complete project overview
- **CONTEXT_RECAP.md**: Detailed status with latest implementations
- **documentation/implementation-plan.md**: Roadmap and completed features
- **documentation/project-structure.md**: File organization and architecture
- **documentation/frontend.spec.md**: UI/UX guidelines and design patterns

#### **Latest Git Commits (July 17, 2025):**
- **a6230b8**: Complete playlist page transformation with database integration
- **abd81ac**: TypeScript/ESLint fixes for production build
- **9d590e3**: Regex syntax error fixes in metadata retrieval
- **66ff654**: Playlist creation issues resolved with server-side APIs

#### **Final Production Status:**
- ✅ **Main Site**: https://avanticlassic.vercel.app (deployed with new playlist page)
- ✅ **Admin Panel**: https://avanticlassic-admin.vercel.app (production-ready)
- ✅ **Authentication**: Simple username/password system (leinso@gmail.com / Naviondo123.1)
- ✅ **Build Process**: All TypeScript/ESLint issues resolved
- ✅ **Database**: Production Supabase with playlist constraint fixes
- ✅ **Playlist System**: Complete database integration with bold visual design

**Ready for**: Any future enhancements, content additions, or design refinements. The entire system is production-ready with comprehensive admin management.

## 🎯 **MILESTONE: Pre-E-commerce Implementation (July 17, 2025)**

### **🛡️ STABLE ROLLBACK POINT CREATED**
- **Commit**: `48151ad`
- **Tag**: `v1.0.0-pre-ecommerce`
- **Status**: Production-ready foundation before e-commerce implementation

### **✅ Current State:**
- **All major features completed** - Admin panel and main site fully functional
- **Playlist system transformed** - Dynamic, database-driven with bold design
- **Video system fixed** - All schema issues resolved, CRUD operations working
- **Production deployment verified** - Both sites deployed and stable
- **Database optimized** - All constraints and relationships properly configured

### **🔄 Rollback Instructions:**
```bash
# If e-commerce implementation fails, restore with:
git reset --hard v1.0.0-pre-ecommerce
git push origin main --force-with-lease
```

### **🚀 Next Phase: E-commerce Implementation**
1. **Database Schema Extension** - Add products, orders, customers, cart tables
2. **Stripe Integration** - Implement 2025 API with enhanced features
3. **Admin Panel Extension** - Add product and order management
4. **Customer-Facing Shop** - Build complete shopping experience
5. **Payment Processing** - Checkout, fulfillment, and customer accounts

### **📋 Documentation Files:**
- `MILESTONE_PRE_ECOMMERCE.md` - Complete milestone documentation
- `RELEASE_NOTES_v1.0.0.md` - Release notes for GitHub
- `admin-panel/CLAUDE.md` - Admin-specific instructions

**Current Status**: Ready for e-commerce development with safe rollback point established.