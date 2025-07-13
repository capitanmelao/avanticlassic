import { NextRequest, NextResponse } from 'next/server'
import { supabase, getLanguageFromHeaders } from '@/lib/supabase'

export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const lang = request.nextUrl.searchParams.get('lang') as 'en' | 'fr' | 'de' || getLanguageFromHeaders(request.headers)
    const { id } = params

    // URL decode the parameter to handle special characters
    const decodedId = decodeURIComponent(id)

    // Try to fetch by ID first, then by URL slug
    const isNumeric = !isNaN(parseInt(decodedId))
    
    const { data: artist, error } = await supabase
      .from('artists')
      .select(`
        *,
        artist_translations(
          language,
          description
        ),
        release_artists(
          release:releases(
            id,
            title,
            url,
            format,
            image_url,
            shop_url,
            release_date
          )
        )
      `)
      .eq(isNumeric ? 'id' : 'url', decodedId)
      .single()

    if (error || !artist) {
      console.error('Error fetching artist:', error)
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 })
    }

    // Get translation for the requested language, fallback to English
    const translation = artist.artist_translations?.find((t: any) => t.language === lang) ||
                       artist.artist_translations?.find((t: any) => t.language === 'en') ||
                       artist.artist_translations?.[0]

    // Transform to match the expected format
    const transformed = {
      id: artist.id.toString(),
      name: artist.name,
      url: artist.url,
      facebook: artist.facebook,
      imageUrl: artist.image_url || `/images/artists/${artist.id}-800.jpeg`,
      description: translation?.description || '',
      releases: artist.release_artists?.map((ra: any) => ({
        id: ra.release.id.toString(),
        title: ra.release.title,
        url: ra.release.url,
        format: ra.release.format,
        imageUrl: ra.release.image_url || `/images/releases/${ra.release.id}.jpeg`,
        shopUrl: ra.release.shop_url,
        releaseDate: ra.release.release_date
      })) || []
    }

    return NextResponse.json(transformed)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}