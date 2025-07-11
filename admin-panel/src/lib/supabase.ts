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
  facebook?: string
  biography?: {
    en?: string
    fr?: string
    de?: string
  }
  created_at?: string
  updated_at?: string
}

export interface Release {
  id: number
  url: string
  title: string
  artist_id: number
  artist_name: string
  year: number
  label?: string
  catalog_number?: string
  tracklist?: {
    en?: string
    fr?: string
    de?: string
  }
  created_at?: string
  updated_at?: string
}

export interface Video {
  id: number
  url: string
  title: string
  artist_name: string
  youtube_id: string
  description?: {
    en?: string
    fr?: string
    de?: string
  }
  created_at?: string
  updated_at?: string
}

export interface Distributor {
  id: number
  name: string
  website?: string
  logo?: string
  created_at?: string
  updated_at?: string
}