import { createClient } from '@supabase/supabase-js'

// Environment variables with fallback and validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Production environment - debug logs removed

// Validate required environment variables
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

// Client for browser-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations (only if service key exists)
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Database types
export interface Artist {
  id: number
  url: string
  name: string
  image_url: string
  instrument?: string
  facebook?: string
  instagram?: string
  twitter?: string
  youtube?: string
  website?: string
  spotify_artist_id?: string
  apple_music_artist_id?: string
  featured: boolean
  sort_order: number
  meta_title?: string
  meta_description?: string
  created_at?: string
  updated_at?: string
}

export interface ArtistTranslation {
  id?: number
  artist_id: number
  language: 'en' | 'fr' | 'de'
  description: string
  created_at?: string
  updated_at?: string
}

export interface Release {
  id: number
  url: string
  title: string
  format?: 'CD' | 'SACD' | 'Vinyl' | 'Digital' | 'Cassette'
  shop_url?: string
  release_date?: string
  catalog_number?: string
  image_url?: string
  featured: boolean
  sort_order: number
  // Streaming links
  spotify_url?: string
  apple_music_url?: string
  youtube_music_url?: string
  amazon_music_url?: string
  bandcamp_url?: string
  soundcloud_url?: string
  // SEO
  meta_title?: string
  meta_description?: string
  created_at?: string
  updated_at?: string
}

export interface ReleaseTranslation {
  id?: number
  release_id: number
  language: 'en' | 'fr' | 'de'
  tracklist?: string
  description?: string
  created_at?: string
  updated_at?: string
}

export interface ReleaseArtist {
  id?: number
  release_id: number
  artist_id: number
  created_at?: string
}

export interface Video {
  id: number
  url: string
  title: string
  artist_name: string
  youtube_id: string
  youtube_url?: string
  thumbnail_url?: string
  duration?: number
  view_count?: number
  published_date?: string
  featured: boolean
  sort_order: number
  created_at?: string
  updated_at?: string
}

export interface VideoDescription {
  id?: number
  video_id: number
  language: 'en' | 'fr' | 'de'
  description: string
  created_at?: string
  updated_at?: string
}

export interface Distributor {
  id: number
  name: string
  url?: string
  website?: string
  email?: string
  phone?: string
  country_id?: string
  address?: string
  logo?: string
  sort_order: number
  created_at?: string
  updated_at?: string
}

// New interfaces for additional features

export interface News {
  id: number
  slug: string
  title: string
  excerpt?: string
  content?: string
  author?: string
  published_date: string
  featured_image?: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  sort_order: number
  meta_title?: string
  meta_description?: string
  created_at?: string
  updated_at?: string
}

export interface NewsTranslation {
  id?: number
  news_id: number
  language: 'en' | 'fr' | 'de'
  title: string
  excerpt?: string
  content?: string
  meta_title?: string
  meta_description?: string
  created_at?: string
  updated_at?: string
}

export interface Review {
  id: number
  release_id: number
  publication: string
  reviewer_name?: string
  review_date: string
  rating?: number
  review_text: string
  review_url?: string
  featured: boolean
  sort_order: number
  created_at?: string
  updated_at?: string
}

export interface ReviewTranslation {
  id?: number
  review_id: number
  language: 'en' | 'fr' | 'de'
  review_text: string
  created_at?: string
  updated_at?: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  status: 'active' | 'unsubscribed' | 'bounced'
  privacy_consent: boolean
  consent_date: string
  unsubscribe_token?: string
  ip_address?: string
  user_agent?: string
  language: 'en' | 'fr' | 'de'
  created_at?: string
  updated_at?: string
}

export interface NewsletterCampaign {
  id: number
  subject: string
  content: string
  sent_date?: string
  status: 'draft' | 'scheduled' | 'sent'
  recipients_count: number
  opens_count: number
  clicks_count: number
  created_at?: string
  updated_at?: string
}

export interface Playlist {
  id: number
  slug: string
  title: string
  description?: string
  category?: 'new_releases' | 'for_everyone' | 'moods' | 'themes' | 'kids' | 'seasonal'
  image_url?: string
  spotify_url?: string
  apple_music_url?: string
  youtube_url?: string
  featured: boolean
  sort_order: number
  created_at?: string
  updated_at?: string
}

export interface PlaylistTranslation {
  id?: number
  playlist_id: number
  language: 'en' | 'fr' | 'de'
  title: string
  description?: string
  created_at?: string
  updated_at?: string
}

export interface PlaylistTrack {
  id?: number
  playlist_id: number
  release_id: number
  track_number?: number
  track_title?: string
  sort_order: number
  created_at?: string
}

export interface Composer {
  id: number
  slug: string
  name: string
  birth_year?: number
  death_year?: number
  nationality?: string
  period?: 'medieval' | 'renaissance' | 'baroque' | 'classical' | 'romantic' | 'modern' | 'contemporary'
  image_url?: string
  spotify_artist_id?: string
  apple_music_artist_id?: string
  featured: boolean
  sort_order: number
  created_at?: string
  updated_at?: string
}

export interface ComposerTranslation {
  id?: number
  composer_id: number
  language: 'en' | 'fr' | 'de'
  biography?: string
  created_at?: string
  updated_at?: string
}

export interface ReleaseComposer {
  id?: number
  release_id: number
  composer_id: number
  created_at?: string
}

export interface SiteSetting {
  id: number
  key: string
  value: unknown // JSONB in database
  description?: string
  created_at?: string
  updated_at?: string
}

export interface StaticPage {
  id: number
  slug: string
  title: string
  content?: string
  meta_title?: string
  meta_description?: string
  status: 'draft' | 'published'
  created_at?: string
  updated_at?: string
}

export interface StaticPageTranslation {
  id?: number
  page_id: number
  language: 'en' | 'fr' | 'de'
  title: string
  content?: string
  meta_title?: string
  meta_description?: string
  created_at?: string
  updated_at?: string
}

export interface SearchIndex {
  id: number
  entity_type: 'artist' | 'release' | 'video' | 'news' | 'composer' | 'playlist'
  entity_id: number
  language: 'en' | 'fr' | 'de'
  searchable_text?: unknown // tsvector in database
  title?: string
  description?: string
  url?: string
  image_url?: string
  created_at?: string
  updated_at?: string
}

export interface PageView {
  id: string
  page_url: string
  entity_type?: string
  entity_id?: number
  visitor_id?: string
  session_id?: string
  ip_address?: string
  user_agent?: string
  referrer?: string
  language?: string
  created_at?: string
}

// Helper types for joined queries
export interface ArtistWithTranslations extends Artist {
  translations?: ArtistTranslation[]
}

export interface ReleaseWithRelations extends Release {
  translations?: ReleaseTranslation[]
  artists?: Artist[]
  composers?: Composer[]
  reviews?: Review[]
}

export interface VideoWithDescriptions extends Video {
  descriptions?: VideoDescription[]
}

export interface NewsWithTranslations extends News {
  translations?: NewsTranslation[]
}

export interface PlaylistWithTracks extends Playlist {
  translations?: PlaylistTranslation[]
  tracks?: (PlaylistTrack & { release?: Release })[]
}

export interface ComposerWithTranslations extends Composer {
  translations?: ComposerTranslation[]
}

// Template-compatible types (for API responses)
export interface TemplateArtist {
  id: string
  name: string
  instrument: string
  imageUrl: string
  bio: string
}

export interface TemplateRelease {
  id: string
  title: string
  artist: string
  format: string
  imageUrl: string
  description: string
}

export interface TemplateVideo {
  id: string
  title: string
  artist: string
  thumbnailUrl: string
}