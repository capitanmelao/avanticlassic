# Content Management System Feature Specification

## Overview

The content management system for Avanticlassic is designed around JSON-based data files that enable non-technical users to update website content without requiring developer intervention. This system prioritizes simplicity and reliability over advanced features.

## Feature Description

### Core Principles
- **JSON-First**: All content stored in structured JSON files
- **File-Based**: No database dependencies or complex CMS setup
- **Version Control**: Content changes tracked through Git
- **Multilingual**: Integrated with i18n system for translations
- **Rebuild-Free**: Future enhancement for real-time updates

### Content Types
1. **Artists**: Performer profiles with biographies and images
2. **Releases**: Album/recording catalog with tracklists and metadata
3. **Videos**: YouTube video gallery with artist associations
4. **Distributors**: Partner information and links
5. **Translations**: Multilingual content for all languages

## Data Structure Specifications

### Artist Data Model
```json
{
  "id": 1,
  "url": "Martha-Argerich",
  "name": "Martha Argerich",
  "facebook": "https://www.facebook.com/groups/107946371992/",
  "imageId": 1,
  "featured": true,
  "sortOrder": 1
}
```

### Release Data Model
```json
{
  "id": 1,
  "url": "Fire-Dance-Roby-Lakatos",
  "title": "Fire Dance - Roby Lakatos (1 CD)",
  "tracklist": "| | | | \n|-|-|-| \n| 1. | Title | Duration |",
  "artists": [10],
  "shopUrl": "https://shop.avanticlassic.com/products/...",
  "releaseDate": "2023-01-15",
  "catalogNumber": "AC001",
  "imageId": 1,
  "featured": false
}
```

### Video Data Model
```json
{
  "id": 1,
  "url": "performance-title",
  "title": "Performance Title",
  "youtubeId": "dQw4w9WgXcQ",
  "artists": [1, 2],
  "description": "Performance description",
  "featured": true,
  "publishDate": "2023-02-20"
}
```

## Content Management Workflow

### Current Process (JSON-Based)
1. **Content Creation**: Edit JSON files directly
2. **Asset Management**: Upload images to appropriate directories
3. **Translation Updates**: Update corresponding translation files
4. **Build Process**: Run Deno build script to generate static site
5. **Deployment**: Deploy `_site/` directory to hosting

### Proposed Enhanced Workflow
1. **Content Interface**: Web-based form for content editing
2. **Asset Upload**: Drag-and-drop image management
3. **Preview System**: Real-time content preview
4. **Auto-Translation**: Integration with translation services
5. **One-Click Deploy**: Automated build and deployment

## File Organization

### Data Directory Structure
```
data/
├── artists.json          # Artist profiles
├── releases.json         # Release catalog
├── videos.json           # Video gallery
└── distributors.json     # Partner information
```

### Asset Directory Structure
```
assets/
├── images/
│   ├── artists/
│   │   ├── 1-800.jpeg    # Artist thumbnails
│   │   ├── 1-1125.jpeg   # Artist medium
│   │   └── 1-1500.jpeg   # Artist full-size
│   └── releases/
│       ├── 1.jpeg        # Release thumbnails
│       └── 1-1200.jpeg   # Release full-size
└── fonts/
    └── helvetica/
```

### Translation Directory Structure
```
i18n/
├── en.json               # English translations
├── fr.json               # French translations
└── de.json               # German translations
```

## Content Validation Rules

### Data Integrity
- **Unique IDs**: All content items must have unique identifiers
- **URL Slugs**: URL-friendly identifiers for all content
- **Required Fields**: Essential fields must be present
- **Artist References**: Valid artist ID references in releases/videos
- **Image References**: Valid image file references

### Content Quality
- **Tracklist Formatting**: Proper Markdown table format for releases
- **URL Validation**: Valid external URLs for shop links and social media
- **Translation Completeness**: All content available in all languages
- **Image Optimization**: Proper image sizes and formats

## Asset Management

### Image Processing Pipeline
1. **Upload**: Original high-resolution images
2. **Processing**: Automatic resizing for different screen sizes
3. **Optimization**: Compression without quality loss
4. **Formats**: WebP with JPEG fallback
5. **Storage**: Organized by content type and size

### Image Naming Convention
- **Artists**: `{artistId}-{size}.{ext}`
- **Releases**: `{releaseId}-{size}.{ext}`
- **Generic**: `{filename}-{size}.{ext}`

### Size Specifications
- **Thumbnail**: 400x400px (artist profiles)
- **Medium**: 800x800px (artist detail)
- **Large**: 1200x1200px (release covers)
- **Full**: 1500x1500px (high-resolution)

## Translation Management

### Translation Key Structure
```json
{
  "artists": {
    "1": {
      "description": "Artist biography in target language"
    }
  },
  "releases": {
    "1": {
      "description": "Release description in target language"
    }
  },
  "videos": {
    "1": {
      "description": "Video description in target language"
    }
  }
}
```

### Translation Workflow
1. **Content Addition**: Add new content to data files
2. **Key Generation**: Create translation keys for new content
3. **Translation**: Translate content for all supported languages
4. **Review**: Quality check for translation accuracy
5. **Deployment**: Include in next build cycle

## Content Publishing Process

### Current Static Generation
1. **Data Loading**: Load all JSON files
2. **Translation Loading**: Load all language files
3. **Template Rendering**: Generate HTML for all languages
4. **Asset Copying**: Copy images and static assets
5. **Output Generation**: Create complete static site

### Enhanced Publishing (Future)
1. **Content Staging**: Preview changes before publication
2. **Incremental Updates**: Only rebuild changed content
3. **Automated Deployment**: Trigger deployment on content changes
4. **Rollback Capability**: Quick revert to previous versions

## User Roles and Permissions

### Content Manager (Fred)
- **Permissions**: Add/edit/delete all content
- **Responsibilities**: Maintain artist profiles, release catalog
- **Tools**: Direct JSON editing or future web interface
- **Training**: Documentation and workflow guides

### Developer (Carlos)
- **Permissions**: Full system access
- **Responsibilities**: System maintenance, feature development
- **Tools**: Code editor, Git, deployment tools
- **Training**: Technical documentation and specifications

## Quality Assurance

### Content Review Process
1. **Data Validation**: Automated checks for data integrity
2. **Link Verification**: Ensure all external links are valid
3. **Image Checks**: Verify all images exist and are optimized
4. **Translation Review**: Check translation completeness
5. **Preview Testing**: Review generated site before deployment

### Automated Checks
- **JSON Validation**: Syntax and structure verification
- **Reference Integrity**: Artist ID references in releases/videos
- **Image Existence**: Verify all referenced images exist
- **Translation Coverage**: Ensure all content is translated

## Performance Optimization

### Content Delivery
- **Static Generation**: Pre-built HTML for optimal performance
- **CDN Integration**: Global content distribution
- **Image Optimization**: Responsive images with proper sizing
- **Lazy Loading**: Progressive image loading for better performance

### Build Performance
- **Parallel Processing**: Multi-threaded content generation
- **Incremental Builds**: Only rebuild changed content
- **Caching Strategy**: Cache unchanged content during builds
- **Asset Optimization**: Compress and optimize all assets

## Backup and Recovery

### Data Protection
- **Git Versioning**: All content changes tracked in version control
- **Automated Backups**: Regular backups of data and assets
- **Recovery Procedures**: Step-by-step recovery documentation
- **Disaster Recovery**: Complete system restoration procedures

### Content Versioning
- **Change Tracking**: Git history for all content modifications
- **Rollback Capability**: Easy reversion to previous versions
- **Branch Strategy**: Development and production content branches
- **Merge Procedures**: Safe integration of content changes

## Future Enhancements

### Content Management Interface
1. **Web-Based Editor**: HTML forms for content editing
2. **WYSIWYG Editor**: Rich text editing for descriptions
3. **Asset Manager**: Drag-and-drop image management
4. **Preview System**: Real-time content preview
5. **User Management**: Role-based access control

### Advanced Features
1. **Search Integration**: Full-text search across all content
2. **Analytics Integration**: Track content performance
3. **SEO Optimization**: Automated meta tag generation
4. **Content Scheduling**: Schedule content publication
5. **Translation Services**: Integration with automatic translation

### Technical Improvements
1. **API Layer**: RESTful API for content management
2. **Real-Time Updates**: WebSocket-based content updates
3. **Content Validation**: Advanced validation rules
4. **Performance Monitoring**: Content delivery optimization
5. **Security Enhancements**: Content security and access control