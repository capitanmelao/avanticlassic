# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a multilingual (English/French/German) classical music website for Avanti Classic with a comprehensive admin CMS. Successfully migrated from Baptiste's custom SSG to Next.js with complete two-tier admin architecture implemented.

### ✅ Production Architecture (COMPLETED)
- **Next.js Main Site** (`app/`): Modern site with Playfair Display typography and enhanced UX
- **Admin Panel CMS** (`admin-panel/`): ✅ **PRODUCTION READY** - Two-tier role-based admin system
- **Legacy SSG** (`ssg-eta/`): Baptiste's custom implementation (archived for reference)
- **Database**: Supabase PostgreSQL with comprehensive schema and audit logging

### ✅ Admin Panel Status (DEPLOYED)
- **URL**: https://avanticlassic-admin-qp2uem9ho-carlos-2227s-projects.vercel.app
- **Authentication**: Google OAuth with Auth.js v5
- **Two-Tier Architecture**: Company Admins + Super Admins with role-based access control
- **Security**: Complete audit logging and permission validation
- **User Management**: Super admins can manage company admin accounts

## Development Commands

### Next.js Main Site (Production)
- **Development server**: `npm run dev` - Serves at http://localhost:3001
- **Build**: `npm run build` - Production build with optimizations  
- **Production URL**: https://avanticlassic.vercel.app

### Admin Panel (admin-panel/) - ✅ PRODUCTION READY  
- **Development server**: `cd admin-panel && npm run dev` - Serves at http://localhost:3000
- **Build**: `cd admin-panel && npm run build` - Production build for Vercel
- **Production URL**: https://avanticlassic-admin-qp2uem9ho-carlos-2227s-projects.vercel.app
- **Google OAuth**: carloszamalloa@gmail.com (Super Admin)

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

### ✅ Admin Panel CMS Structure (`admin-panel/`)
- **Framework**: Next.js 15 + TypeScript + Tailwind CSS
- **Authentication**: Auth.js v5 with Google OAuth (production-grade)
- **Database**: Supabase PostgreSQL with audit logging
- **Two-Tier Architecture**:
  - **Company Admins**: Content management only (artists, releases, videos, playlists, reviews, distributors)
  - **Super Admins**: Full system access + user management + settings
- **Security**: Role-based middleware, audit logging, permission validation
- **Features**:
  - Complete CRUD for all content types
  - **Drag-and-drop reordering** for releases with real-time database updates
  - YouTube metadata integration for videos
  - Playlist categories: "By Artist" and "By Composer"
  - 5-star review system
  - User management interface (super admin only)
  - Comprehensive site settings

## ✅ Production Environment Configuration

### Main Site Environment
- **Production URL**: https://avanticlassic.vercel.app
- **Database**: Supabase PostgreSQL (production)
- **Framework**: Next.js 15 with App Router

### Admin Panel Environment  
- **Production URL**: https://avanticlassic-admin-qp2uem9ho-carlos-2227s-projects.vercel.app
- **Database**: Supabase PostgreSQL (shared with main site)
- **Authentication**: Google OAuth (carloszamalloa@gmail.com)
- **Framework**: Next.js 15 + Auth.js v5

## ✅ Production Dependencies

### Next.js Site Dependencies
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Supabase client for database
- Playfair Display font

### Admin Panel Dependencies
- Next.js 15 + TypeScript
- Auth.js v5 (NextAuth v5) for authentication
- Supabase for database and RLS
- Tailwind CSS for professional UI
- Heroicons for navigation icons
- YouTube oEmbed API integration
- **@dnd-kit libraries** for drag-and-drop functionality (core, sortable, utilities)

## Documentation Framework

This project uses a facet-based documentation management system with structured documentation files:

### ✅ Updated Documentation Files (July 14, 2025)
- **CONTEXT_RECAP.md**: Current project status with drag-and-drop ordering implementation
- **documentation/implementation-plan.md**: Updated roadmap with manual ordering feature completion
- **documentation/bug-tracking.md**: All critical bugs resolved - Release ordering fixed
- **documentation/project-structure.md**: Complete file structure with admin panel details
- **documentation/frontend.spec.md**: UI/UX guidelines including drag-and-drop interface

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
- ✅ **Release ordering bug** completely resolved with API translation fixes

## ✅ Critical Bug Fixes Completed (July 14, 2025)

### BUG-003: Release Ordering Issue (RESOLVED)
- **Problem**: Main site showed releases in wrong order despite admin panel configuration
- **Root Cause**: API required `release_translations` with inner join, but no translations existed
- **Solution**: Made translations optional in API, removed language filter requirement
- **Files Modified**: 
  - `app/api/releases/route.ts:31` - Removed `!inner` from translations query
  - `app/api/releases/route.ts:43` - Removed `.eq('release_translations.language', lang)` filter
- **Result**: Main site now displays releases in exact order configured via admin drag-and-drop

### BUG-002: Distributors TypeError (RESOLVED)  
- **Problem**: `TypeError: e.toLowerCase is not a function` in distributors page
- **Root Cause**: `country_id` field contained numbers, not strings
- **Solution**: Added `.toString()` conversion before `.toLowerCase()` calls
- **Files Modified**: `admin-panel/src/app/dashboard/distributors/page.tsx`

All documentation reflects the current production-ready state with comprehensive admin CMS and working drag-and-drop ordering system.

## 🔄 Session Handover Information

### **For New Claude Sessions - Quick Start Guide**

When starting a new session, the following information provides complete context for continuing development:

#### **Current Development Environment:**
- **Main Site**: Running on `npm run dev` → http://localhost:3001
- **Admin Panel**: Running on `cd admin-panel && npm run dev` → http://localhost:3000  
- **Database**: Supabase PostgreSQL (production) - fully populated with real content
- **Authentication**: Google OAuth via Auth.js v5 (carloszamalloa@gmail.com)

#### **Project Status - All Core Features COMPLETED:**
1. ✅ **Two-tier admin architecture** with role-based access control working
2. ✅ **Complete CRUD operations** for all content types (releases, artists, videos, etc.)
3. ✅ **Drag-and-drop release ordering** with real-time database sync
4. ✅ **Main site order synchronization** - API translation layer fixed
5. ✅ **Production deployment** - Both admin and main site deployed and functional

#### **Most Recent Work (July 14, 2025):**
- **RESOLVED**: Release ordering bug - main site now shows admin-configured order
- **IMPLEMENTED**: Drag-and-drop interface with @dnd-kit libraries
- **FIXED**: API translation layer causing empty responses
- **VERIFIED**: Public site reflects admin changes immediately

#### **Key Technical Context:**
- **Framework**: Next.js 15 with App Router + TypeScript
- **Database**: Supabase with `sort_order` field for manual ordering
- **Ordering Logic**: Higher `sort_order` value = first position in display
- **Drag System**: @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
- **API Fix**: Removed `!inner` from translations query to prevent empty results

#### **Critical File Locations:**
- **Admin Releases Page**: `admin-panel/src/app/dashboard/releases/page.tsx` (drag-and-drop implementation)
- **Main Site API**: `app/api/releases/route.ts` (ordering and translation fixes)
- **Database Updates**: `admin-panel/src/app/dashboard/releases/page.tsx:198-232` (updateSortOrder function)

#### **Development Workflow:**
1. Start both servers: `npm run dev` (main) + `cd admin-panel && npm run dev` (admin)
2. Admin panel: http://localhost:3000/dashboard/releases (drag to reorder)
3. Main site: http://localhost:3001/releases (verify order sync)
4. Database: Changes auto-saved to Supabase `releases.sort_order` field

#### **For Debugging Order Issues:**
- Check API response: `curl "http://localhost:3001/api/releases?limit=5"`
- Verify database: Admin panel → Releases shows current `sort_order` values
- Test drag-and-drop: Should update immediately with visual feedback

### **Session Continuation Context Files:**
- **CONTEXT_RECAP.md**: Complete status overview with latest features
- **documentation/implementation-plan.md**: Roadmap with Phase 4 completion  
- **documentation/bug-tracking.md**: All resolved issues including release ordering
- **documentation/project-structure.md**: Current file organization
- **documentation/frontend.spec.md**: UI/UX guidelines and design patterns

**Ready for**: Additional features, optimizations, or new content management requirements.