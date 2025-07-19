import { NextRequest, NextResponse } from 'next/server'
import { supabase, getLanguageFromHeaders } from '@/lib/supabase'

export async function GET(
  request: NextRequest, 
  { params }: { params: { artistId: string } }
) {
  try {
    const lang = request.nextUrl.searchParams.get('lang') as 'en' | 'fr' | 'de' || getLanguageFromHeaders(request.headers)
    const { artistId } = params
    const currentReleaseId = request.nextUrl.searchParams.get('exclude')

    // URL decode the parameter to handle special characters
    const decodedArtistId = decodeURIComponent(artistId)
    
    // Determine if we're searching by ID or name
    const isNumeric = !isNaN(parseInt(decodedArtistId))
    
    // First, find the artist to get the artist ID
    let artistId: number | null = null
    
    if (isNumeric) {
      artistId = parseInt(decodedArtistId)
    } else {
      // Find artist by name
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('id')
        .or(`name.ilike.%${decodedArtistId}%,url.eq.${decodedArtistId}`)
        .single()
        
      if (artistError || !artistData) {
        console.log('Artist not found:', decodedArtistId)
        return NextResponse.json({ releases: [] })
      }
      
      artistId = artistData.id
    }

    // Build the query to get releases by artist
    let query = supabase
      .from('release_artists')
      .select(`
        release:releases(
          id,
          title,
          url,
          format,
          image_url,
          catalog_number,
          release_date,
          release_translations(
            language,
            description
          )
        )
      `)
      .eq('artist_id', artistId)
      .order('release(release_date)', { ascending: false })
      .limit(8)

    // Exclude current release if specified
    if (currentReleaseId) {
      query = query.neq('release.id', parseInt(currentReleaseId))
    }

    const { data: releaseArtists, error } = await query

    if (error) {
      console.error('Error fetching releases by artist:', error)
      return NextResponse.json({ error: 'Failed to fetch releases' }, { status: 500 })
    }

    if (!releaseArtists || releaseArtists.length === 0) {
      return NextResponse.json({ releases: [] })
    }

    // Transform releases to match expected format
    const transformedReleases = releaseArtists
      .filter(ra => ra.release) // Make sure the release exists
      .map(ra => {
        const release = ra.release
        
        // Get translation for the requested language, fallback to English
        const translation = release.release_translations?.find((t: any) => t.language === lang) ||
                           release.release_translations?.find((t: any) => t.language === 'en') ||
                           release.release_translations?.[0]

        return {
          id: release.id.toString(),
          title: release.title,
          artists: decodedArtistId, // Use the artist name we're searching for
          format: release.format || 'CD',
          imageUrl: release.image_url || `/images/releases/${release.id}.jpeg`,
          url: release.url,
          catalogNumber: release.catalog_number,
          releaseDate: release.release_date,
          description: translation?.description || ''
        }
      })

    return NextResponse.json({ releases: transformedReleases })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}