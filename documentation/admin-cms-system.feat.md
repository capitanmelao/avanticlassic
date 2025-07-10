# Admin CMS System Feature Specification

## Overview

A secure, single-admin content management system that integrates with Baptiste's existing SSG architecture, enabling Fred to manage content, upload images, and publish changes without touching code.

## Business Requirements

### Core Problem
- Fred needs to update content independently without developer intervention
- Current JSON-based system requires technical knowledge
- Image management is manual and error-prone
- No authentication or security for content updates

### Success Criteria
- Single admin login with 2FA security
- Intuitive web interface for content management
- Image upload with automatic optimization
- One-click publishing to live site
- Zero downtime deployments

## System Architecture

### Hybrid Approach
```
Admin CMS (Supabase Backend) → JSON Files → SSG Build → Static Site (Vercel)
```

### Components
1. **Admin Backend**: Supabase for auth, database, and file storage
2. **Admin Frontend**: React/Next.js admin panel
3. **Build Trigger**: Webhook to regenerate SSG
4. **Content Sync**: API to update JSON files and trigger builds

## Authentication System

### Single Admin Access
- **No Multi-tenancy**: Single hardcoded admin account
- **Email/Password**: Primary authentication method
- **2FA Required**: TOTP-based (Google Authenticator, Authy)
- **Session Management**: Secure JWT tokens with refresh

### Security Features
```typescript
interface AdminAuth {
  email: 'admin@avanticlassic.com';
  password: string; // Bcrypt hashed
  totpSecret: string; // 2FA secret
  lastLogin: Date;
  sessionToken: string;
  refreshToken: string;
}
```

### 2FA Implementation
- **Setup**: QR code generation for authenticator app
- **Verification**: 6-digit TOTP code required on each login
- **Backup Codes**: 10 single-use recovery codes
- **Session Timeout**: 4-hour automatic logout

## Content Management Interface

### Dashboard Overview
```
┌─────────────────────────────────────┐
│ Avanticlassic Admin Dashboard       │
├─────────────────────────────────────┤
│ 📊 Overview                         │
│ • 19 Artists • 38 Releases • 15 Videos │
│ • Last Update: 2 days ago          │
│                                     │
│ 🚀 Quick Actions                    │
│ [Add Artist] [Add Release] [Publish]│
└─────────────────────────────────────┘
```

### Artist Management
- **List View**: Grid of artist cards with photos
- **Add/Edit Form**: Name, bio, social links, photo upload
- **Drag & Drop**: Photo upload with automatic resizing
- **Preview**: Real-time preview of artist page

### Release Management
- **Rich Editor**: WYSIWYG editor for tracklist
- **Markdown Support**: Direct markdown editing option
- **Artist Linking**: Dropdown to associate artists
- **Cover Upload**: Automatic image optimization

### Video Management
- **YouTube Integration**: Paste YouTube URL for automatic metadata
- **Artist Association**: Multi-select artist linking
- **Thumbnail**: Auto-fetch from YouTube or manual upload

## Image Management System

### Upload Features
- **Drag & Drop**: Modern file upload interface
- **Multiple Formats**: JPEG, PNG, WebP support
- **Automatic Optimization**: Resize and compress on upload
- **Progressive Upload**: Progress bars and error handling

### Image Processing Pipeline
```typescript
interface ImageProcessing {
  upload: (file: File) => Promise<string>;
  resize: (sizes: number[]) => Promise<string[]>;
  optimize: (quality: number) => Promise<void>;
  generateWebP: () => Promise<string>;
  updateJSON: (imageId: string) => Promise<void>;
}
```

### Size Variants
- **Artists**: 800px, 1125px, 1500px (responsive)
- **Releases**: 400px, 1200px (thumbnail + full)
- **Optimization**: 85% JPEG quality, WebP variants
- **Naming**: Automatic ID-based naming convention

## Database Schema (Supabase)

### Admin Table
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  totp_secret TEXT,
  backup_codes TEXT[],
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Content Tables (Mirror JSON Structure)
```sql
-- Artists table
CREATE TABLE artists (
  id SERIAL PRIMARY KEY,
  url TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  facebook TEXT,
  image_id INTEGER,
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Artist translations
CREATE TABLE artist_translations (
  id SERIAL PRIMARY KEY,
  artist_id INTEGER REFERENCES artists(id),
  language TEXT NOT NULL,
  description TEXT,
  UNIQUE(artist_id, language)
);

-- Similar tables for releases, videos, distributors
```

### Image Storage
- **Supabase Storage**: Secure file storage with CDN
- **Public Buckets**: For optimized images served to site
- **Private Buckets**: For original uploads and admin assets
- **RLS Policies**: Row-level security for admin-only access

## Content Publishing Workflow

### Edit → Preview → Publish Flow
1. **Edit Content**: Admin makes changes in CMS
2. **Auto-save**: Changes saved to Supabase immediately
3. **Preview Mode**: Generate preview URLs for testing
4. **Publish**: One-click to update JSON files and trigger build

### Build Integration
```typescript
interface PublishWorkflow {
  syncToJSON: () => Promise<void>;           // Update JSON files
  triggerBuild: () => Promise<string>;       // Trigger Vercel build
  monitorBuild: (buildId: string) => Promise<'success' | 'failed'>;
  notifyCompletion: (status: string) => Promise<void>;
}
```

### Version Control
- **Git Integration**: Automatic commits for each publish
- **Rollback**: Ability to revert to previous versions
- **Change Log**: Track who changed what and when

## Admin Panel UI/UX

### Technology Stack
- **Frontend**: Next.js 14 with App Router
- **UI Framework**: Shadcn/ui + Tailwind CSS
- **State Management**: Zustand for global state
- **Forms**: React Hook Form with Zod validation
- **File Upload**: React Dropzone with progress

### Navigation Structure
```
Admin Panel
├── Dashboard (overview, quick stats)
├── Artists
│   ├── List View (grid of artist cards)
│   ├── Add Artist (form + image upload)
│   └── Edit Artist (edit form)
├── Releases
│   ├── List View (table with filters)
│   ├── Add Release (rich editor)
│   └── Edit Release
├── Videos
│   ├── List View (YouTube thumbnails)
│   └── Add/Edit Video
├── Media Library (image management)
├── Settings (admin profile, 2FA)
└── Publish (build status, deploy)
```

### Responsive Design
- **Mobile-First**: Works on tablets and phones
- **Touch-Friendly**: Large buttons and touch targets
- **Offline Capable**: Service worker for offline editing
- **Dark Mode**: Admin-friendly dark theme

## Security Implementation

### Authentication Flow
```typescript
// Login with 2FA
const loginFlow = {
  step1: { email, password } => validateCredentials(),
  step2: { totpCode } => verify2FA(),
  result: { accessToken, refreshToken } => setSession()
};
```

### API Security
- **JWT Tokens**: Short-lived access tokens (15 minutes)
- **Refresh Tokens**: Longer-lived (7 days) for token renewal
- **Rate Limiting**: Prevent brute force attacks
- **CORS**: Restrict origins to admin domain only
- **HTTPS Only**: SSL encryption for all communication

### Data Protection
- **RLS Policies**: Supabase row-level security
- **Encrypted Storage**: Sensitive data encryption at rest
- **Audit Logs**: Track all admin actions
- **IP Restrictions**: Optional IP whitelist

## Integration with Existing SSG

### Minimal Changes to Current System
- **Preserve JSON Structure**: Keep existing data format
- **API Endpoint**: New endpoint to update JSON files
- **Build Trigger**: Webhook to regenerate site
- **Asset Sync**: Copy optimized images to SSG assets

### Migration Strategy
1. **Phase 1**: Set up Supabase backend and admin auth
2. **Phase 2**: Build admin panel for content management
3. **Phase 3**: Implement image upload and processing
4. **Phase 4**: Add build trigger and publishing workflow
5. **Phase 5**: Train Fred and go live

## Development Plan

### Week 1: Backend Setup
- Set up Supabase project
- Configure authentication with 2FA
- Create database schema
- Set up storage buckets

### Week 2: Admin Frontend
- Build Next.js admin panel
- Implement authentication UI
- Create dashboard and navigation
- Add basic CRUD forms

### Week 3: Image Management
- Implement image upload
- Add image processing pipeline
- Create media library interface
- Integrate with content forms

### Week 4: Publishing System
- Build JSON sync functionality
- Implement build triggers
- Add preview system
- Create publish workflow

### Week 5: Testing & Training
- Comprehensive testing
- Security audit
- User documentation
- Train Fred on the system

## Cost Estimation

### Hosting Costs (Monthly)
- **Supabase**: $25/month (Pro plan)
- **Vercel**: $20/month (Pro plan for admin)
- **Domain**: $12/year
- **Total**: ~$45/month (much cheaper than current setup)

### Development Time
- **Initial Build**: 4-5 weeks
- **Testing & Polish**: 1 week
- **Training & Handover**: 1 week
- **Total**: 6-7 weeks

## Risk Mitigation

### Technical Risks
- **Build Failures**: Automatic rollback on failed builds
- **Data Loss**: Regular backups and version control
- **Security Breach**: 2FA, audit logs, and monitoring
- **Performance**: CDN and optimized images

### Business Risks
- **User Adoption**: Intuitive interface and training
- **Content Quality**: Preview system and approval workflow
- **Site Downtime**: Zero-downtime deployments
- **Maintenance**: Documentation and monitoring

## Success Metrics

### Technical Success
- Login security: 0 successful attacks
- Build success rate: >99%
- Image optimization: <500KB average
- Page load speed: <2 seconds

### Business Success
- Fred uses system independently
- Content updates happen weekly
- Hosting costs reduced by 60%
- Zero developer intervention needed

## Future Enhancements

### Phase 2 Features
- **Content Scheduling**: Schedule publish dates
- **Analytics Integration**: Track content performance
- **SEO Tools**: Meta tag management
- **Email Notifications**: Build status notifications

### Advanced Features
- **Multi-language Content**: Translation management
- **Content Approval**: Workflow for content review
- **API Integration**: Third-party service connections
- **Advanced Analytics**: Content performance insights