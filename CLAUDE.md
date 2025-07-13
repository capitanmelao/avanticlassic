# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a multilingual (English/French/German) classical music website for Avanti Classic. Currently migrating from Baptiste's custom SSG to Astro for better maintainability and ecosystem support.

### Current Architecture
- **Astro Site** (`astro-site/`): Modern static site generator with Tailwind CSS
- **Legacy SSG** (`ssg-eta/`): Baptiste's custom Deno/Eta implementation (working reference)
- **Admin CMS**: Planned Supabase + Next.js backend for content management

## Development Commands

### Astro Site (Main Website)
- **Development server**: `npm run dev` - Serves at http://localhost:4321
- **Build**: `npm run build` - Production build with optimizations
- **Preview**: `npm run preview` - Preview production build locally

### Admin Panel (admin-panel/)
- **Development server**: `cd admin-panel && npm run dev` - Serves at http://localhost:3001/avantiadmin
- **Build**: `cd admin-panel && npm run build` - Production build for Vercel
- **OAuth Testing**: Visit http://localhost:3001/avantiadmin for Google authentication

### Static Site Generator (ssg-eta/) - Legacy
- **Build SSG**: `deno run --allow-read --allow-write --allow-env main.ts` - Generates static site in `_site/`
- **Watch mode**: `deno run --allow-read --allow-write --allow-env watch.ts` - Watches for changes and rebuilds
- **Serve locally**: `python3 -m http.server 8080` (from `_site/` directory)

## Architecture

### Angular Application Structure
- **Component prefix**: `ns-` (as configured in angular.json)
- **Routing**: File-based routing in `app.routes.ts` with routes for artists, releases, videos, and about
- **Services**: Centralized data services in `services/` directory:
  - `artistsService.ts` - Artist data management
  - `releasesService.ts` - Release/album data management  
  - `videosService.ts` - Video content management
  - `distributorsService.ts` - Distributor information
  - `picturesService.ts` - Image handling
  - `urlsService.ts` - URL generation utilities
- **Models**: TypeScript interfaces in `models/` directory for type safety
- **Internationalization**: Uses ngx-translate with JSON files in `assets/i18n/`
- **API**: Connects to external API at `https://api.avanticlassic.com/api/`

### Static Site Generator Structure  
- **Templates**: Eta templates in `eta-files/` with layouts, pages, and partials
- **Data**: JSON files in `data/` directory (artists.json, releases.json, videos.json, distributors.json)
- **Services**: TypeScript services for data processing and rendering
- **Multilingual**: Supports EN/FR/DE with translation files in `i18n/`

### Key Features
- Responsive design with Bootstrap 4
- Artist profiles with biography and release listings
- Release catalog with detailed information
- Video gallery
- Multi-language support (English, French, German)
- Static site generation for SEO optimization

## Environment Configuration

- **Development**: `src/environments/environment.ts` - Uses development API URL
- **Production**: `src/environments/environment.prod.ts` - Production API configuration
- **API Base URL**: `https://api.avanticlassic.com/api/`

## Dependencies

### Key Angular Dependencies
- Angular 11.x with Angular CLI
- Bootstrap 4 with ng-bootstrap
- ngx-translate for internationalization
- RxJS for reactive programming
- Node.js 16+ required

### SSG Dependencies (Deno)
- Eta templating engine
- Deno standard library modules
- Custom TypeScript services for data processing

## Documentation Framework

This project uses a facet-based documentation management system with structured documentation files:

### Core Documentation Files
- **project.spec.md**: High-level project overview, architecture, and objectives
- **ssg-module.spec.md**: Technical design of the SSG module, repository map, and architecture
- **tasks.md**: Structured task breakdown with references to appropriate documentation
- **typescript.coding-style.md**: Coding standards and style guidelines

### Feature Documentation
- **i18n-system.feat.md**: Internationalization system specification
- **content-management.feat.md**: Content management workflow and data structures
- **deployment.md**: Deployment procedures and infrastructure documentation

### Documentation Types
- **\*.spec.md**: Technical specifications for modules and components
- **\*.feat.md**: Detailed feature specifications with implementation details
- **\*.coding-style.md**: Language and framework-specific coding guidelines
- **\*.doc.md**: Generated documentation for libraries and frameworks
- **\*.md**: General documentation (deployment, security, etc.)

All documentation files are located in the `documentation/` directory and provide comprehensive context for development and maintenance.