# Avanticlassic - Classical Music Label Website

A multilingual classical music website for Avanti Classic, a boutique Belgian record label. Built with a modern SSG architecture and upcoming admin CMS.

## 🎼 Project Overview

Showcases classical music artists, releases, and videos with elegant design and multilingual support (English, French, German).

**Live Site**: https://ssg-eta.vercel.app/ (Baptiste's SSG implementation)

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Admin CMS     │    │   SSG System    │    │   Static Site   │
│   (Coming Soon) │───▶│   (ssg-eta/)    │───▶│   (Vercel)      │
│   • Secure Auth │    │   • Deno + Eta  │    │   • Multi-lang  │
│   • Image Upload│    │   • JSON Data   │    │   • Fast + SEO  │
│   • Content Mgmt│    │   • Auto Build  │    │   • CDN Ready   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Current System (SSG)

Baptiste's excellent static site generator using Deno and Eta templates.

### Quick Start
```bash
cd ssg-eta
deno run --allow-read --allow-write main.ts    # Build site
deno run --allow-read --allow-write watch.ts   # Development mode
cd _site && python3 -m http.server 8080       # Local preview
```

### Content Management (Current)
- **Artists**: Edit `data/artists.json`
- **Releases**: Edit `data/releases.json` 
- **Videos**: Edit `data/videos.json`
- **Translations**: Edit `i18n/*.json` files
- **Images**: Place in `assets/images/`

## 🔐 Upcoming: Admin CMS

Secure content management system for Fred (the label owner):
- **Single Admin Login** with 2FA
- **Image Upload** with automatic optimization
- **Rich Content Editor** for descriptions/tracklists
- **One-Click Publishing** to live site
- **No Code Required** - web interface only

### Cost-Effective Hosting
- **Supabase**: Free tier (auth + storage)
- **Vercel**: Free tier (static hosting)
- **Total Cost**: ~$1/month (just domain)

## 📁 Repository Structure

```
avanticlassic/
├── ssg-eta/                 # Baptiste's SSG system (current)
│   ├── data/               # JSON content files
│   ├── eta-files/          # Templates and layouts
│   ├── i18n/               # Translation files
│   ├── services/           # Core SSG services
│   └── _site/              # Generated static site
├── documentation/          # Complete project docs
│   ├── admin-cms-system.feat.md     # CMS specification
│   ├── ssg-module.spec.md           # SSG technical docs
│   └── *.md                         # Feature specs & guides
└── CLAUDE.md              # Development guidelines
```

## 🎯 Development Roadmap

### ✅ Phase 1: Complete (Analysis & Cleanup)
- Repository cleaned and organized
- Comprehensive documentation created
- SSG system analyzed and documented

### 🔄 Phase 2: Admin CMS Development (Next)
- Supabase backend setup
- Admin authentication with 2FA
- Content management interface
- Image upload and processing
- Auto-publishing system

### 🔮 Phase 3: Enhancement
- Advanced search features
- Analytics integration
- Performance optimization
- Mobile app (optional)

## 🛠️ Technology Stack

### Current (SSG)
- **Runtime**: Deno
- **Templates**: Eta
- **Styling**: CSS + Custom components
- **Deployment**: Vercel
- **Content**: JSON files

### Planned (Admin CMS)
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Frontend**: Next.js + Shadcn/ui
- **Security**: JWT + TOTP 2FA
- **Integration**: GitHub API + Vercel webhooks

## 📊 Key Features

- **🌍 Multilingual**: English, French, German
- **📱 Responsive**: Mobile-first design
- **⚡ Fast**: Static generation + CDN
- **🔍 SEO**: Optimized meta tags and structure
- **🎨 Elegant**: Baptiste's beautiful design
- **🔒 Secure**: Admin-only content management
- **💰 Cost-Effective**: <$50/month total hosting

## 🤝 Credits

- **Baptiste**: Original SSG architecture and elegant design
- **Carlos**: Documentation, cleanup, and upcoming CMS
- **Fred**: Content and label owner

## 📖 Documentation

See the `documentation/` folder for:
- Technical specifications
- Feature documentation
- Development guidelines
- Deployment procedures

## 🚀 Getting Started

1. **Explore the current site**: https://ssg-eta.vercel.app/
2. **Read the docs**: Check `documentation/` folder
3. **Test the SSG**: Follow Quick Start above
4. **Follow development**: Watch for CMS updates

---

*Transforming classical music presentation with modern web technology* 🎼