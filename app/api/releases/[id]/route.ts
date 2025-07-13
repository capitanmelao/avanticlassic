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
    
    const { data: release, error } = await supabase
      .from('releases')
      .select(`
        *,
        release_translations(
          language,
          description,
          tracklist
        ),
        release_artists(
          artist:artists(
            id,
            name,
            url
          )
        )
      `)
      .eq(isNumeric ? 'id' : 'url', decodedId)
      .single()

    if (error || !release) {
      console.error('Error fetching release:', error)
      return NextResponse.json({ error: 'Release not found' }, { status: 404 })
    }

    // Get translation for the requested language, fallback to English
    const translation = release.release_translations?.find((t: any) => t.language === lang) ||
                       release.release_translations?.find((t: any) => t.language === 'en') ||
                       release.release_translations?.[0]

    // Transform to match the expected format
    const transformed = {
      id: release.id.toString(),
      title: release.title,
      artists: release.release_artists?.map((ra: any) => ra.artist?.name).join(', ') || 'Various Artists',
      artistList: release.release_artists?.map((ra: any) => ({
        id: ra.artist.id.toString(),
        name: ra.artist.name,
        url: ra.artist.url
      })) || [],
      format: release.format || 'CD',
      imageUrl: release.image_url || `/images/releases/${release.id}.jpeg`,
      description: translation?.description || '',
      tracklist: translation?.tracklist || '',
      url: release.url,
      releaseDate: release.release_date,
      catalogNumber: release.catalog_number,
      shopUrl: release.shop_url,
      totalTime: release.total_time
    }

    return NextResponse.json(transformed)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}