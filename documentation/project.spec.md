# Project Specification - Avanticlassic Website

## Overview

Avanticlassic is a multilingual classical music label website showcasing artists, releases, and videos for a boutique Belgian record label. The project consists of two implementations:

1. **Legacy Angular Application** (main root) - Original SPA with backend API
2. **Modern SSG Implementation** (ssg-eta/) - Static site generator with no backend dependencies

## High-Level Architecture

### Current State Analysis
- **Active Implementation**: Custom SSG built with Deno and Eta templates
- **Deployment**: Vercel (http://ssg-eta.vercel.app/)
- **Content Management**: JSON-based data files
- **Internationalization**: Custom i18n system (EN/FR/DE)
- **Status**: Complete but not adopted by client

### Control Flow
```
JSON Data Sources → Deno Rendering Engine → Eta Templates → Static HTML → Vercel Deployment
```

### Core Modules
1. **Data Service**: Loads and manages JSON data files
2. **Translation Service**: Handles multilingual content
3. **Render Service**: Generates static HTML from templates
4. **Template System**: Eta-based layouts, pages, and components

## Business Objectives

### Primary Goals
- Showcase classical music artists and their releases
- Provide multilingual access (English, French, German)
- Maintain elegant, minimalist design aesthetic
- Enable content updates without technical expertise
- Minimize hosting costs and complexity

### Success Metrics
- Zero backend hosting costs
- Sub-second page load times
- Mobile-responsive design
- SEO-optimized static pages
- Easy content management workflow

## Technical Strategy

### Current Implementation Benefits
- **Cost Efficiency**: No backend server required
- **Performance**: Pre-generated static HTML
- **Scalability**: CDN-friendly architecture
- **Maintainability**: Simple JSON-based content management
- **Security**: No server-side attack surface

### Proposed Evolution Path
1. **Phase 1**: Document and optimize existing SSG system
2. **Phase 2**: Enhance content management workflow
3. **Phase 3**: Add modern features (search, filtering, etc.)
4. **Phase 4**: Implement automated deployment pipeline

## Key Stakeholders
- **Fred**: Label owner and primary content manager
- **Baptiste**: Original developer and architect
- **Carlos**: Current maintainer and enhancement developer

## Repository Structure
```
avanticlassic/
├── src/                    # Legacy Angular application
├── ssg-eta/               # Modern SSG implementation
│   ├── data/             # JSON data files
│   ├── eta-files/        # Templates and layouts
│   ├── services/         # Core SSG services
│   ├── i18n/             # Translation files
│   └── _site/            # Generated static site
└── documentation/        # Project documentation
```

## Success Factors
- Preserve Baptiste's elegant design philosophy
- Maintain JSON-based content management simplicity
- Ensure seamless multilingual experience
- Optimize for search engine visibility
- Enable non-technical content updates