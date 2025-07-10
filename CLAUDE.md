# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a bilingual (English/French/German) classical music website for Avanti Classic, built with Angular 11. The project showcases artists, releases, and videos with internationalization support. It includes both a main Angular application and a static site generator (SSG) built with Deno and Eta templates.

## Development Commands

### Angular Application
- **Development server**: `npm start` or `ng serve` - Serves at http://localhost:4200
- **Build**: `npm run build` or `ng build --prod` - Production build with optimizations
- **Test**: `npm test` or `ng test` - Runs unit tests via Karma
- **Lint**: `npm run lint` or `ng lint` - Runs TSLint for code quality
- **E2E Tests**: `npm run e2e` or `ng e2e` - Runs end-to-end tests via Protractor

### Static Site Generator (ssg-eta/)
- **Build SSG**: `deno run --allow-read --allow-write main.ts` - Generates static site in `_site/`
- **Watch mode**: `deno run --allow-read --allow-write watch.ts` - Watches for changes and rebuilds
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