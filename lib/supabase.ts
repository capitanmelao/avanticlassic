import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to get YouTube thumbnail
export const getYouTubeThumbnail = (youtubeId: string): string => {
  return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
}

// Helper function to transform snake_case to camelCase
export const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase)
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      result[camelKey] = toCamelCase(obj[key])
      return result
    }, {} as any)
  }
  return obj
}

// Helper function to get current language from headers or default
export const getLanguageFromHeaders = (headers: Headers): 'en' | 'fr' | 'de' => {
  const acceptLanguage = headers.get('accept-language') || 'en'
  if (acceptLanguage.includes('fr')) return 'fr'
  if (acceptLanguage.includes('de')) return 'de'
  return 'en'
}