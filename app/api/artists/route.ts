import { NextRequest, NextResponse } from 'next/server'
import { supabase, getLanguageFromHeaders } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const instrument = searchParams.get('instrument') || ''
    const lang = searchParams.get('lang') as 'en' | 'fr' | 'de' || getLanguageFromHeaders(request.headers)
    
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('artists')
      .select(`
        id,
        url,
        name,
        image_url,
        instrument,
        featured,
        artist_translations!inner(
          language,
          description
        )
      `, { count: 'exact' })
      .eq('artist_translations.language', lang)
      .order('featured', { ascending: false })
      .order('sort_order')
      .order('name')
      .range(offset, offset + limit - 1)

    // Apply filters
    if (search) {
      query = query.ilike('name', `%${search}%`)
    }
    
    if (instrument) {
      query = query.eq('instrument', instrument)
    }

    const { data: artists, error, count } = await query

    if (error) {
      console.error('Error fetching artists:', error)
      return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 })
    }

    // Transform data to match template format
    const transformedArtists = artists?.map(artist => ({
      id: artist.id.toString(),
      url: artist.url,
      name: artist.name,
      instrument: artist.instrument || 'Performer',
      imageUrl: `/images/artists/${artist.id}-800.jpeg`,
      bio: artist.artist_translations?.[0]?.description || ''
    })) || []

    return NextResponse.json({
      artists: transformedArtists,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Get single artist by ID or slug
export async function GET_ARTIST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const lang = request.nextUrl.searchParams.get('lang') as 'en' | 'fr' | 'de' || getLanguageFromHeaders(request.headers)
    const { id } = params

    // Try to fetch by ID first, then by URL slug
    const isNumeric = !isNaN(parseInt(id))
    
    const { data: artist, error } = await supabase
      .from('artists')
      .select(`
        *,
        artist_translations!inner(
          language,
          description
        ),
        release_artists(
          release:releases(
            id,
            url,
            title,
            image_url,
            release_date,
            catalog_number
          )
        )
      `)
      .eq('artist_translations.language', lang)
      .eq(isNumeric ? 'id' : 'url', id)
      .single()

    if (error || !artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 })
    }

    // Transform to template format
    const transformed = {
      id: artist.id.toString(),
      name: artist.name,
      instrument: artist.instrument || 'Performer',
      imageUrl: `/images/artists/${artist.id}-800.jpeg`,
      bio: artist.artist_translations?.[0]?.description || '',
      facebook: artist.facebook,
      instagram: artist.instagram,
      twitter: artist.twitter,
      youtube: artist.youtube,
      website: artist.website,
      spotifyArtistId: artist.spotify_artist_id,
      appleMusicArtistId: artist.apple_music_artist_id,
      releases: artist.release_artists?.map((ra: any) => ({
        id: ra.release.id.toString(),
        title: ra.release.title,
        imageUrl: ra.release.image_url || `/images/releases/${ra.release.id}.jpeg`,
        releaseDate: ra.release.release_date,
        catalogNumber: ra.release.catalog_number,
        url: ra.release.url
      })) || []
    }

    return NextResponse.json(transformed)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}