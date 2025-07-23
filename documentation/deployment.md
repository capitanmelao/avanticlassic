# Deployment Guide

## Overview

This document outlines the deployment process for the Avanticlassic website using Next.js 15 with automatic Vercel deployment.

## Current Production Architecture

### Next.js Application
- **Framework**: Next.js 15 with App Router
- **Build Process**: `npm run build`
- **Runtime**: Node.js with React Server Components
- **Hosting**: Vercel (https://avanticlassic.vercel.app)

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Database**: Supabase PostgreSQL
- **Payments**: Stripe with Express Checkout
- **Authentication**: Simple username/password (admin panel)
- **Styling**: Tailwind CSS v4

## Production URLs

### Main Website
- **URL**: https://avanticlassic.vercel.app
- **Vercel Project**: `avanticlassic`
- **Git Branch**: `main` (auto-deploy)

### Admin Panel
- **URL**: https://avanticlassic-admin.vercel.app
- **Vercel Project**: `avanticlassic-admin`
- **Git Branch**: `main` (auto-deploy)
- **Login**: leinso@gmail.com / Naviondo123.1

## Deployment Process

### Automatic Deployment
1. **Code Push**: Push changes to `main` branch
2. **Automatic Trigger**: Vercel detects changes via GitHub integration
3. **Build Execution**: Runs `npm run build` for both projects
4. **Environment Variables**: Loaded from Vercel dashboard
5. **CDN Distribution**: Content distributed globally via Vercel Edge Network
6. **Live Update**: Sites automatically updated (no manual intervention)

### Build Configuration
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "nodeVersion": "18.x"
}
```

## Environment Variables

### Main Website (.env)
```env
NEXT_PUBLIC_SUPABASE_URL=https://cfyndmpjohwtvzljtypr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
NEXT_PUBLIC_APP_URL=https://avanticlassic.vercel.app
```

### Admin Panel (.env)
```env
NEXT_PUBLIC_SUPABASE_URL=https://cfyndmpjohwtvzljtypr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SESSION_SECRET=your_session_secret
NEXT_PUBLIC_MAIN_SITE_URL=https://avanticlassic.vercel.app
```

## Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup Process
1. **Clone Repository**
   ```bash
   git clone https://github.com/your-repo/avanticlassic.git
   cd avanticlassic
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Fill in your environment variables
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Admin Panel Development**
   ```bash
   cd admin-panel
   npm install
   npm run dev
   ```

### Local URLs
- **Main Site**: http://localhost:3000
- **Admin Panel**: http://localhost:3000 (in admin-panel directory)

## Database Management

### Supabase Production
- **URL**: https://cfyndmpjohwtvzljtypr.supabase.co
- **Management**: Via admin panel (content) and Supabase dashboard (schema)
- **Backups**: Automatic daily backups via Supabase
- **Migrations**: Applied directly via Supabase dashboard SQL editor

### Schema Updates
1. **Test in Supabase Dashboard**: SQL editor for schema changes
2. **Verify via Admin Panel**: Ensure admin functionality works
3. **Document Changes**: Update CLAUDE.md with schema modifications

## Monitoring and Maintenance

### Performance Monitoring
- **Vercel Analytics**: Built-in performance monitoring
- **Core Web Vitals**: Tracked automatically
- **Error Tracking**: Vercel Functions logs

### Regular Maintenance
- **Dependencies**: Monthly `npm audit` and updates
- **Database**: Monitor Supabase usage and performance
- **Content**: Regular content updates via admin panel

## Rollback Process

### Emergency Rollback
1. **Vercel Dashboard**: Revert to previous deployment
2. **Git Revert**: `git revert <commit>` and push to main
3. **Database**: Restore from Supabase backup if needed

### Testing Before Rollback
1. **Check Admin Panel**: Verify admin functionality
2. **Test E-commerce**: Confirm Stripe payments work
3. **Content Verification**: Ensure all content displays correctly

## Security Considerations

### Production Security
- **HTTPS Only**: Enforced via Vercel
- **Environment Variables**: Stored securely in Vercel dashboard
- **Database Security**: Row Level Security (RLS) policies active
- **Admin Authentication**: bcrypt password hashing with HTTP-only cookies

### Regular Security Updates
- **Dependencies**: Regular security patches via `npm audit fix`
- **Supabase Updates**: Automatic platform security updates
- **Environment Rotation**: Regular API key rotation (quarterly)

## Support and Troubleshooting

### Common Issues
1. **Build Failures**: Check Vercel build logs
2. **Database Errors**: Verify Supabase connection and RLS policies
3. **Payment Issues**: Check Stripe webhook configuration
4. **Admin Access**: Verify session management and authentication

### Getting Help
- **Vercel Support**: Enterprise support via dashboard
- **Supabase Support**: Community and documentation
- **Stripe Support**: Developer documentation and support portal

## Current Status (July 2025)

✅ **Production Ready**
- Main website deployed and fully functional
- Admin panel operational with role-based access
- E-commerce system with Stripe Express Checkout
- SEO optimization complete with AI/LLM search support
- Multilingual system (EN/FR/DE) operational
- Content management via admin panel working

✅ **Performance Optimized**
- Next.js 15 App Router for optimal performance
- Infinite scroll implemented across all content pages
- Core Web Vitals optimized
- CDN distribution via Vercel Edge Network