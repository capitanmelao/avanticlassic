# Setup Guide
## Avanticlassic Classical Music Platform

**Version**: 1.8.0  
**Last Updated**: July 23, 2025

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### 1. Clone Repository
```bash
git clone https://github.com/your-repo/avanticlassic.git
cd avanticlassic
```

### 2. Environment Setup

#### Main Website
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your values:
# - Supabase URL and keys
# - Stripe keys
# - Application URL
```

#### Admin Panel
```bash
cd admin-panel
cp .env.example .env.local

# Edit .env.local with your values:
# - Supabase configuration (same as main site)
# - Session secret
# - Main site URL
```

### 3. Install Dependencies
```bash
# Main website
npm install

# Admin panel
cd admin-panel
npm install
```

### 4. Development Servers
```bash
# Main website (port 3000)
npm run dev

# Admin panel (port 3000 in admin-panel directory)
cd admin-panel
npm run dev
```

---

## 🗄️ Database Setup

### Supabase Configuration
1. Create account at https://supabase.com
2. Create new project
3. Copy URL and keys to `.env.local` files
4. Run database migrations via Supabase dashboard

### Required Tables
The database includes 23+ tables supporting:
- Content management (artists, releases, videos)
- E-commerce (products, orders, customers)
- Admin system (users, audit logs)
- Multilingual content (translations)

---

## 💳 Payment Setup

### Stripe Configuration
1. Create Stripe account
2. Get publishable and secret keys
3. Configure webhooks for `/api/webhooks/stripe`
4. Enable Apple Pay domain verification

### Supported Payment Methods
- Credit/Debit Cards
- Apple Pay
- Google Pay
- Link by Stripe

---

## 🌍 Production Deployment

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Create two projects:
   - `avanticlassic` (main site)
   - `avanticlassic-admin` (admin panel)
3. Configure environment variables in Vercel dashboard
4. Deploy via git push to main branch

### Environment Variables (Vercel)
Add these to both projects:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (main only)
- `STRIPE_SECRET_KEY` (main only)
- `SESSION_SECRET` (admin only)

---

## 👥 Admin Access

### Default Admin Login
- **URL**: https://avanticlassic-admin.vercel.app
- **Username**: leinso@gmail.com
- **Password**: Naviondo123.1

### Admin Features
- Content management (artists, releases, videos)
- E-commerce controls (products, orders)
- User management (Super Admin only)
- System monitoring and audit logs

---

## 🔧 Development Commands

### Main Website
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # Code linting
```

### Admin Panel
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
```

---

## 📚 Documentation

- **API Documentation**: `API_DOCUMENTATION.md`
- **Comprehensive Audit**: `COMPREHENSIVE_PROJECT_AUDIT_REPORT.md`
- **Project Guidelines**: `CLAUDE.md`
- **Setup Instructions**: This file

---

## 🆘 Common Issues

### Build Errors
- Ensure all environment variables are set
- Check TypeScript compilation errors
- Verify Supabase connection

### Authentication Issues
- Check admin credentials
- Verify session secret configuration
- Ensure secure cookie settings

### Payment Problems
- Verify Stripe webhook endpoints
- Check API key configuration
- Test in Stripe test mode first

---

## 📈 Features Included

### ✅ Content Management
- 37 professional classical music releases
- 21+ artist profiles with biographies
- Database-driven video gallery
- Curated playlists with streaming integration

### ✅ E-commerce System
- Complete shopping cart functionality
- Stripe Express Checkout integration
- Admin-configurable shipping/tax overrides
- Order management and tracking

### ✅ Admin System
- Two-tier authentication (Company/Super Admin)
- Comprehensive content management
- Audit logging for all actions
- Real-time updates to main site

### ✅ SEO & Performance
- AI/LLM search optimization
- Complete JSON-LD structured data
- Core Web Vitals optimized
- Multilingual support (EN/FR/DE)

---

**Setup Complete!** 🎉

Your Avanticlassic classical music platform is ready for development or production deployment.

For additional help, see the comprehensive documentation files included in the project.