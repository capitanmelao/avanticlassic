# Avanti Classic Template Integration Guide

This guide explains how to integrate the Avanti Classic template with your existing Supabase database.

## Prerequisites

1. A Supabase project with the Avanti Classic database schema
2. The database migrations from `/admin-panel/supabase/migrations/` applied
3. Environment variables configured

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Database Migrations

Ensure you've run all migrations in your Supabase project:
- `001_initial_schema.sql` - Base tables
- `002_update_existing_tables.sql` - Additional fields for template
- `003_create_new_feature_tables.sql` - News, reviews, playlists, etc.

### 3. API Endpoints

The template includes API routes that transform database data to match component expectations:

#### Artists API
- `GET /api/artists` - List all artists with pagination
- `GET /api/artists/[id]` - Get single artist by ID or slug

#### Releases API
- `GET /api/releases` - List all releases with pagination
- `GET /api/releases/[id]` - Get single release by ID or slug

#### Videos API
- `GET /api/videos` - List all videos with pagination
- `GET /api/videos/[id]` - Get single video by ID or slug

#### Search API
- `GET /api/search?q=query` - Search across all content types

#### Newsletter API
- `POST /api/newsletter` - Subscribe to newsletter
- `DELETE /api/newsletter` - Unsubscribe

### 4. Data Requirements

#### Required Fields
The template expects certain fields that may need to be populated:

**Artists:**
- `instrument` - Musical instrument or voice type
- `image_url` - Artist profile image

**Releases:**
- `format` - CD, SACD, Vinyl, Digital, or Cassette
- `description` - In release_translations table

**Videos:**
- `thumbnail_url` - Or it will generate from YouTube ID
- `published_date` - For sorting

### 5. Image Handling

The template expects images at these paths:
- Artists: `/images/artists/{id}-800.jpeg`
- Releases: `/images/releases/{id}.jpeg`
- Default placeholders are provided if images don't exist

### 6. Multi-language Support

All content supports three languages: EN, FR, DE

The API automatically selects content based on:
1. `lang` query parameter
2. `Accept-Language` header
3. Default to English

Example: `/api/artists?lang=fr`

### 7. Component Integration

Replace mock data with API calls:

```typescript
// Before (mock data)
const artists = mockArtists

// After (API integration)
const response = await fetch('/api/artists')
const { artists } = await response.json()
```

### 8. Features Not Yet Implemented

These features have database support but need frontend implementation:
- News articles management
- Reviews system
- Playlists and curated content
- Composers profiles
- Static pages (Privacy Policy, Terms)
- Analytics tracking

### 9. Admin Panel Integration

The admin panel at `/admin-panel` can manage:
- Artists (with new fields)
- Releases (with streaming links)
- Videos (with metadata)

Still needs implementation:
- News management
- Reviews management
- Playlists management
- Composers management
- Site settings

### 10. Testing

1. Run the development server:
   ```bash
   npm run dev
   ```

2. Test API endpoints:
   - http://localhost:3000/api/artists
   - http://localhost:3000/api/releases
   - http://localhost:3000/api/videos
   - http://localhost:3000/api/search?q=test

3. Check component rendering with real data

## Troubleshooting

### Missing Data
If components show empty states:
1. Check if data exists in database
2. Verify API response format
3. Check browser console for errors

### Image 404s
- Ensure image URLs are correctly formatted
- Check if images exist in public folder
- Consider using a CDN for production

### Language Issues
- Verify translations exist in database
- Check language parameter is passed correctly
- Ensure translation tables have data for all languages

## Next Steps

1. Populate database with real content
2. Upload images to public folder or CDN
3. Implement remaining features (news, playlists, etc.)
4. Configure SEO metadata
5. Set up production deployment