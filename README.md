# Avanticlassic Website

A multilingual classical music label website built with Astro, featuring artists, releases, and videos with comprehensive content management.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Site will be available at http://localhost:4321

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Setup

1. Copy environment variables:
```bash
cp .env.example .env
```

2. Update `.env` with your Supabase credentials:
```env
SUPABASE_URL=https://cfyndmpjohwtvzljtypr.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SITE_URL=https://your-domain.vercel.app
```

## 🌍 Multilingual Structure

The site supports English (en), French (fr), and German (de):

- `/en/` - English content
- `/fr/` - French content  
- `/de/` - German content
- `/` - Redirects to `/en/`

## 📁 Project Structure

```
/
├── public/
│   ├── images/           # Artist and release images
│   ├── fonts/           # Helvetica font files
│   └── favicon.ico
├── src/
│   ├── data/            # JSON data files
│   ├── i18n/            # Translation files
│   ├── layouts/         # Astro layouts
│   ├── pages/           # Route pages
│   ├── styles/          # Global CSS
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── astro.config.mjs     # Astro configuration
├── tailwind.config.mjs  # Tailwind CSS config
└── vercel.json          # Vercel deployment config
```

## 🎵 Features

### Artists System
- Paginated artist listing (6 per page)
- Individual artist pages with biographies
- Artist image galleries (responsive sizes)
- Release and social media integration

### Releases Catalog
- Complete discography with cover art
- Tracklist rendering with Markdown support
- Artist associations and purchase links
- Responsive album grid layout

### Video Gallery
- YouTube integration with thumbnails
- Modal video player with autoplay
- Paginated video listing
- Mobile-optimized playback

### Content Management
- JSON-based content system
- Multilingual translation support
- SEO-optimized with hreflang tags
- Open Graph meta tags

## 🎨 Design System

- **Framework**: Astro with Tailwind CSS
- **Typography**: Custom Helvetica fonts
- **Layout**: Responsive, mobile-first design
- **Colors**: Blue accent (#38bdf8) with neutral grays
- **Components**: Clean, minimal aesthetic

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Vercel

```
SUPABASE_URL=https://cfyndmpjohwtvzljtypr.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SITE_URL=https://your-domain.vercel.app
```

## 📊 Performance

- **Build**: 202 pages generated in ~1.5 seconds
- **Languages**: 3 (EN/FR/DE)
- **SEO**: Complete hreflang implementation
- **Images**: Optimized responsive variants
- **Loading**: Fast static site generation

## 🔮 Future: Admin CMS

Phase 2 will include:
- Supabase-powered admin backend
- 2FA authentication system
- Rich content editor
- Image upload and processing
- One-click publishing workflow

## 🛠 Development

Built with modern web technologies:
- **Astro 4.x** - Static site generation
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Supabase** - Backend infrastructure (Phase 2)

## 📄 License

Copyright © 2024 Avanticlassic. All rights reserved.
