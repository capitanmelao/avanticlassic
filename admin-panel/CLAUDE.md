# CLAUDE.md - Admin Panel

This file provides guidance to Claude Code when working with the **Admin Panel** portion of the Avanti Classic project.

## ⚠️ IMPORTANT DEPLOYMENT INFORMATION

### **Production Setup**
- **Production URL**: https://avanticlassic-admin.vercel.app
- **Vercel Project**: `avanticlassic-admin` (EXISTING PROJECT - DO NOT CREATE NEW)
- **Database**: Production Supabase PostgreSQL (shared with main site)
- **Authentication**: Simple username/password system
  - **Super Admin**: leinso@gmail.com / Naviondo123.1

### **Development vs Production**
- **Local Development**: Only for testing code changes before deployment
- **Production Testing**: Use https://avanticlassic-admin.vercel.app directly
- **Database**: ALWAYS production Supabase (no local database)
- **Environment**: All testing should be done on the live admin panel

### **Deployment Process**
1. **NEVER create a new Vercel project**
2. **ALWAYS use existing**: `avanticlassic-admin` project in Vercel
3. **Git workflow**: Push to main branch → Auto-deploys to production
4. **Testing**: Use production URL for all functionality testing

## Project Structure

This is the **Admin Panel** portion of the Avanti Classic website - a separate Next.js application from the main site.

### **Admin Panel Features** ✅ PRODUCTION READY
- **Framework**: Next.js 15 + TypeScript + Tailwind CSS
- **Authentication**: Simple username/password system (no Auth.js)
- **Database**: Supabase PostgreSQL with audit logging
- **Security**: Role-based middleware, audit logging, permission validation

### **Two-Tier Architecture**
- **Company Admins**: Content management only (artists, releases, videos, playlists, reviews, distributors)
- **Super Admins**: Full system access + user management + settings

### **Content Management Features**
- ✅ Complete CRUD for all content types
- ✅ **Drag-and-drop reordering** for releases with real-time database updates
- ✅ YouTube metadata integration for videos
- ✅ **Playlist management** with image uploads and streaming integration
- ✅ **Automatic metadata retrieval** from streaming services
- ✅ 5-star review system
- ✅ User management interface (super admin only)
- ✅ Comprehensive site settings

## Latest Features (July 17, 2025)

### **Playlist System Complete** ✅
- **Image Upload API**: `/src/app/api/upload/route.ts` - Server-side authentication
- **Metadata Retrieval**: `/src/app/api/metadata/route.ts` - Auto-fetch from streaming URLs
- **Database Integration**: Fixed playlist constraint issues
- **Streaming Services**: Spotify, Apple Music, YouTube integration

### **Key API Routes**
- **Upload**: `/api/upload` - Server-side image upload with authentication
- **Metadata**: `/api/metadata` - Automatic playlist metadata retrieval
- **Playlists**: `/api/playlists` - Complete CRUD operations
- **Auth**: `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`

## Development Commands

### **Local Development** (for code changes only)
```bash
npm run dev  # Serves at http://localhost:3000
```

### **Production Build** (for deployment verification)
```bash
npm run build  # Production build for Vercel
```

### **Production Access**
- **URL**: https://avanticlassic-admin.vercel.app
- **Login**: leinso@gmail.com / Naviondo123.1

## Important Notes

1. **Database**: Always uses production Supabase (no local database setup)
2. **Testing**: All functionality testing should be done on production URL
3. **Deployment**: Automatic via Git push to main branch
4. **Vercel Project**: Use existing `avanticlassic-admin` project (DO NOT CREATE NEW)
5. **Environment Variables**: All configured in Vercel dashboard
6. **Authentication**: Simple system (no external OAuth dependencies)

## File Structure

### **Core Authentication**
- `src/lib/auth.ts` - Core authentication logic with bcrypt
- `src/lib/session.ts` - Session management with HTTP-only cookies
- `src/lib/use-session.ts` - Custom useSession hook
- `src/middleware.ts` - Authentication middleware

### **API Routes**
- `src/app/api/auth/` - Authentication endpoints
- `src/app/api/upload/` - Image upload handling
- `src/app/api/metadata/` - Streaming service metadata retrieval
- `src/app/api/playlists/` - Playlist CRUD operations

### **Dashboard Pages**
- `src/app/dashboard/` - Main admin interface
- `src/app/dashboard/playlists/` - Playlist management
- `src/app/dashboard/artists/` - Artist management
- `src/app/dashboard/releases/` - Release management with drag-and-drop
- `src/app/dashboard/videos/` - Video management
- `src/app/dashboard/users/` - User management (super admin only)

### **Components**
- `src/components/ImageUpload.tsx` - Image upload component
- `src/components/admin-sidebar.tsx` - Navigation sidebar

## Security

- **Authentication**: bcrypt password hashing with 12 salt rounds
- **Sessions**: HTTP-only cookies with 24-hour expiration
- **Database**: Row Level Security (RLS) policies
- **Audit Logging**: Complete audit trail for all admin actions
- **Role-based Access**: Company admin vs Super admin permissions

## Status: Production Ready ✅

All core features implemented and deployed. The admin panel is fully functional for content management of the Avanti Classic website.