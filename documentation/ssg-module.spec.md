# SSG Module Technical Specification

## Overview

The Static Site Generator (SSG) module is a custom-built system using Deno and Eta templates to generate a multilingual classical music website from JSON data sources.

## Architecture Components

### Core Services

#### DataService (data.service.ts)
- **Purpose**: Singleton service for loading and managing JSON data files
- **Implementation**: Scans `data/` directory for `.json` files
- **Data Structure**: Nested object mapping filename to parsed JSON content
- **Key Methods**:
  - `loadData()`: Asynchronously loads all JSON files from data directory
  - `data`: Public property containing all loaded data

#### TranslationService (translation.service.ts)
- **Purpose**: Manages multilingual content and translations
- **Supported Languages**: English (en), French (fr), German (de)
- **Implementation**: Loads translation JSON files from `i18n/` directory
- **Key Methods**:
  - `loadTranslations()`: Loads all language files
  - `translate(lang, key)`: Returns translated string for given language and key
  - `langs`: Array of supported language codes

#### RenderService (render.service.ts)
- **Purpose**: Central rendering engine for generating static HTML
- **Template Engine**: Eta with views directory set to `eta-files/`
- **Key Methods**:
  - `init()`: Initializes data and translation services, creates output directories
  - `renderAllPages()`: Renders all pages in `eta-files/pages/` for all languages
  - `renderAllTemplates()`: Renders individual item templates (artists, releases)
  - `renderPagedPage(type, itemsPerPage)`: Generates paginated listings
  - `renderPage(pageName)`: Renders single page for all languages

### Data Models

#### Artist Data Structure
```typescript
interface Artist {
  id: number;
  url: string;        // URL-friendly identifier
  name: string;       // Display name
  facebook?: string;  // Optional social media link
}
```

#### Release Data Structure
```typescript
interface Release {
  id: number;
  url: string;           // URL-friendly identifier
  title: string;         // Album/release title
  tracklist: string;     // Markdown-formatted tracklist
  artists: number[];     // Array of artist IDs
  shopUrl: string;       // Purchase link
}
```

#### Video Data Structure
```typescript
interface Video {
  id: number;
  url: string;           // URL-friendly identifier
  title: string;         // Video title
  youtubeId: string;     // YouTube video ID
  artists: number[];     // Array of artist IDs
}
```

### Template Structure

#### Layout System
- **Base Layout**: `eta-files/layouts/base.eta`
  - Common HTML structure
  - Navigation menu
  - Language selector
  - SEO meta tags
  - Responsive design classes

#### Page Templates
- **Static Pages**: `eta-files/pages/`
  - `index.eta`: Homepage with carousel
  - `artists.eta`: Artist listing page
  - `releases.eta`: Release catalog page
  - `videos.eta`: Video gallery page
  - `about.eta`: About page

#### Dynamic Templates
- **Item Templates**: `eta-files/templates/`
  - `artists.eta`: Individual artist page template
  - `releases.eta`: Individual release page template

#### Partial Components
- **Reusable Components**: `eta-files/partials/`
  - `lang-selector.eta`: Language switching component
  - `footer.eta`: Site footer

### Internationalization System

#### Translation Structure
```json
{
  "menu": {
    "ourArtists": "Our Artists",
    "releases": "Releases",
    "videos": "Videos",
    "about": "About"
  },
  "artists": {
    "searchArtist": "Search artist",
    "1": {
      "description": "Artist biography in target language"
    }
  }
}
```

#### URL Structure
- **Language Paths**: `/{lang}/page.html`
- **Artist Pages**: `/{lang}/artists/{artist-url}.html`
- **Release Pages**: `/{lang}/releases/{release-url}.html`
- **Pagination**: `/{lang}/artists/page/{page-number}.html`

### Build Process

#### Main Build Script (main.ts)
1. Initialize services (data loading, translations)
2. Render all static pages
3. Render all dynamic templates
4. Generate paginated listings
5. Output to `_site/` directory

#### Development Workflow
1. Edit JSON data files in `data/`
2. Update translations in `i18n/`
3. Modify templates in `eta-files/`
4. Run `deno run --allow-read --allow-write main.ts`
5. Deploy `_site/` contents to hosting

### Performance Optimizations

#### Static Generation Benefits
- Pre-rendered HTML for instant loading
- CDN-friendly architecture
- No server-side processing required
- Optimal Core Web Vitals scores

#### SEO Optimization
- Semantic HTML structure
- Open Graph meta tags
- Multilingual hreflang support
- Clean URL structure

### Dependencies

#### Core Dependencies
- **Deno**: JavaScript/TypeScript runtime
- **@eta-dev/eta**: Template engine
- **@deno/gfm**: GitHub Flavored Markdown rendering
- **@std/fs**: File system utilities
- **@std/path**: Path manipulation utilities

#### No Build Dependencies
- Zero npm packages
- No bundler required
- Direct Deno execution
- Native TypeScript support

### Deployment Configuration

#### Vercel Integration
- **Build Command**: `deno run --allow-read --allow-write main.ts`
- **Output Directory**: `_site/`
- **Runtime**: Node.js (for Vercel compatibility)
- **Environment**: Static site hosting

#### File Structure Output
```
_site/
├── en/
│   ├── index.html
│   ├── artists.html
│   ├── artists/
│   │   ├── Martha-Argerich.html
│   │   └── page/
│   │       ├── 1.html
│   │       └── 2.html
│   └── releases.html
├── fr/
│   └── [mirror of en structure]
├── de/
│   └── [mirror of en structure]
├── images/
├── fonts/
└── styles.css
```

## Repository Map

```
ssg-eta/
├── main.ts                 # Main build script
├── watch.ts                # Development watch mode
├── deno.json               # Deno configuration
├── data/
│   ├── artists.json        # Artist data
│   ├── releases.json       # Release catalog
│   ├── videos.json         # Video gallery
│   └── distributors.json   # Distributor information
├── eta-files/
│   ├── layouts/
│   │   └── base.eta        # Base HTML layout
│   ├── pages/
│   │   ├── index.eta       # Homepage
│   │   ├── artists.eta     # Artist listing
│   │   ├── releases.eta    # Release catalog
│   │   ├── videos.eta      # Video gallery
│   │   └── about.eta       # About page
│   ├── templates/
│   │   ├── artists.eta     # Artist detail template
│   │   └── releases.eta    # Release detail template
│   └── partials/
│       ├── lang-selector.eta
│       └── footer.eta
├── i18n/
│   ├── en.json             # English translations
│   ├── fr.json             # French translations
│   └── de.json             # German translations
├── services/
│   ├── data.service.ts     # Data loading service
│   ├── render.service.ts   # Rendering engine
│   └── translation.service.ts # i18n service
├── models/
│   ├── nested-object.model.ts
│   └── translation-tree.model.ts
├── assets/
│   └── styles/
│       └── input.css       # Tailwind CSS source
└── _site/                  # Generated static site
```

## Content Management Workflow

### Adding New Artists
1. Add artist data to `data/artists.json`
2. Add artist images to `assets/images/artists/`
3. Add artist biography to translation files in `i18n/`
4. Rebuild site with `deno run --allow-read --allow-write main.ts`

### Adding New Releases
1. Add release data to `data/releases.json`
2. Format tracklist in Markdown syntax
3. Add release images to `assets/images/releases/`
4. Rebuild and deploy

### Translation Updates
1. Edit translation files in `i18n/`
2. Maintain key consistency across all languages
3. Use nested object structure for organization
4. Rebuild to apply changes