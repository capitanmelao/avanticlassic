import { createClient as createSupabaseClient } from '@supabase/supabase-js'

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
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations (only if service key exists)
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Wrapper function to create client (for compatibility with new code)
export function createClient() {
  return supabase
}

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
  release_id?: number
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
  country_id?: string | number
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
  category?: 'by_artist' | 'by_composer' | 'by_theme'
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

// E-commerce types
export interface Product {
  id: number
  stripe_product_id: string
  release_id?: number
  name: string
  description?: string
  type: 'physical' | 'digital'
  format: 'cd' | 'sacd' | 'vinyl' | 'digital_download'
  status: 'active' | 'inactive' | 'archived'
  images: string[]
  metadata?: unknown // JSONB
  tax_code?: string
  inventory_quantity: number
  inventory_tracking: boolean
  weight_grams?: number
  dimensions_cm?: unknown // JSONB
  featured: boolean
  sort_order: number
  created_at?: string
  updated_at?: string
}

export interface ProductPrice {
  id: number
  product_id: number
  stripe_price_id: string
  currency: string
  amount: number
  type: 'one_time' | 'recurring'
  billing_period?: 'day' | 'week' | 'month' | 'year'
  billing_interval?: number
  adaptive_pricing_enabled: boolean
  market_specific_pricing?: unknown // JSONB
  active: boolean
  created_at?: string
  updated_at?: string
}

export interface Customer {
  id: number
  stripe_customer_id?: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  date_of_birth?: string
  preferred_language: 'en' | 'fr' | 'de'
  preferred_currency: string
  preferred_payment_methods: string[]
  checkout_personalization_data?: unknown // JSONB
  marketing_consent: boolean
  marketing_consent_date?: string
  email_verified: boolean
  account_status: 'active' | 'suspended' | 'deleted'
  last_login?: string
  created_at?: string
  updated_at?: string
}

export interface CustomerAddress {
  id: number
  customer_id: number
  type: 'billing' | 'shipping' | 'both'
  is_default: boolean
  first_name: string
  last_name: string
  company?: string
  address_line_1: string
  address_line_2?: string
  city: string
  state_province?: string
  postal_code: string
  country: string
  phone?: string
  created_at?: string
  updated_at?: string
}

export interface CartItem {
  id: number
  session_id?: string
  customer_id?: number
  product_id: number
  price_id: number
  quantity: number
  unit_amount: number
  currency: string
  discounts?: unknown // JSONB
  personalization_data?: unknown // JSONB
  created_at?: string
  updated_at?: string
}

export interface Order {
  id: number
  order_number: string
  stripe_checkout_session_id?: string
  stripe_payment_intent_id?: string
  customer_id?: number
  customer_email: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
  fulfillment_status: 'unfulfilled' | 'partial' | 'fulfilled'
  subtotal_amount: number
  tax_amount: number
  shipping_amount: number
  discount_amount: number
  total_amount: number
  currency: string
  billing_address: unknown // JSONB
  shipping_address?: unknown // JSONB
  payment_method_types: string[]
  adaptive_pricing_applied: boolean
  tax_details?: unknown // JSONB
  shipping_method?: string
  tracking_number?: string
  tracking_url?: string
  shipped_at?: string
  delivered_at?: string
  notes?: string
  customer_notes?: string
  metadata?: unknown // JSONB
  created_at?: string
  updated_at?: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id?: number
  price_id?: number
  quantity: number
  unit_amount: number
  total_amount: number
  tax_amount: number
  discount_amount: number
  product_name: string
  product_format: string
  product_images: string[]
  fulfillment_status: 'unfulfilled' | 'fulfilled' | 'returned'
  fulfilled_at?: string
  created_at?: string
}

export interface ProductCategory {
  id: number
  name: string
  slug: string
  description?: string
  parent_id?: number
  image_url?: string
  sort_order: number
  active: boolean
  created_at?: string
  updated_at?: string
}

export interface ProductCategoryRelation {
  id: number
  product_id: number
  category_id: number
  created_at?: string
}

export interface DiscountCode {
  id: number
  code: string
  name: string
  description?: string
  type: 'percentage' | 'fixed_amount' | 'free_shipping'
  value: number
  currency: string
  usage_limit?: number
  usage_count: number
  usage_limit_per_customer: number
  valid_from: string
  valid_until?: string
  minimum_order_amount: number
  applicable_product_ids: number[]
  applicable_category_ids: number[]
  active: boolean
  created_at?: string
  updated_at?: string
}

export interface DiscountUsage {
  id: number
  discount_code_id: number
  order_id: number
  customer_id?: number
  discount_amount: number
  used_at: string
}

export interface StripeWebhookEvent {
  id: number
  stripe_event_id: string
  event_type: string
  processed: boolean
  processing_status: 'pending' | 'success' | 'failed' | 'retrying'
  retry_count: number
  max_retries: number
  data: unknown // JSONB
  error_message?: string
  processed_at?: string
  created_at?: string
}

// E-commerce helper types for joined queries
export interface ProductWithPrices extends Product {
  product_prices?: ProductPrice[]
  release?: Release
  categories?: ProductCategory[]
}

export interface CartItemWithProduct extends CartItem {
  product?: ProductWithPrices
  price?: ProductPrice
}

export interface OrderWithItems extends Order {
  order_items?: (OrderItem & {
    product?: Product
    price?: ProductPrice
  })[]
  customer?: Customer
}