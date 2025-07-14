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
- **Development server**: `npm run dev` - Serves at http://localhost:3000
- **Build**: `npm run build` - Production build with optimizations  
- **Production URL**: https://avanticlassic.vercel.app

### Admin Panel (admin-panel/) - ✅ PRODUCTION READY
- **Development server**: `cd admin-panel && npm run dev` - Serves at http://localhost:3001
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

## Documentation Framework

This project uses a facet-based documentation management system with structured documentation files:

### ✅ Updated Documentation Files (July 14, 2025)
- **CONTEXT_RECAP.md**: Current project status with two-tier admin architecture completion
- **documentation/implementation-plan.md**: Updated roadmap showing Phase 4 completion
- **documentation/bug-tracking.md**: Critical BUG-002 resolved - Two-tier admin architecture
- **documentation/project-structure.md**: Complete file structure with admin panel details
- **documentation/frontend.spec.md**: UI/UX guidelines including admin panel design

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
- ✅ **Security implementation** documented with audit logging details
- ✅ **Production deployment** status and URLs documented

All documentation reflects the current production-ready state with comprehensive admin CMS.