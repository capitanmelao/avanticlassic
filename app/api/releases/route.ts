import { NextRequest, NextResponse } from 'next/server'
import { supabase, getLanguageFromHeaders } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const format = searchParams.get('format') || ''
    const featured = searchParams.get('featured') === 'true'
    const lang = searchParams.get('lang') as 'en' | 'fr' | 'de' || getLanguageFromHeaders(request.headers)
    
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('releases')
      .select(`
        id,
        url,
        title,
        format,
        image_url,
        release_date,
        catalog_number,
        featured,
        shop_url,
        spotify_url,
        apple_music_url,
        release_translations!inner(
          language,
          description,
          tracklist
        ),
        release_artists(
          artist:artists(
            id,
            name
          )
        )
      `, { count: 'exact' })
      .eq('release_translations.language', lang)
      .order('featured', { ascending: false })
      .order('sort_order', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (search) {
      query = query.ilike('title', `%${search}%`)
    }
    
    if (format) {
      query = query.eq('format', format)
    }
    
    if (featured) {
      query = query.eq('featured', true)
    }

    const { data: releases, error, count } = await query

    if (error) {
      console.error('Error fetching releases:', error)
      return NextResponse.json({ error: 'Failed to fetch releases' }, { status: 500 })
    }

    // Transform data to match template format
    const transformedReleases = releases?.map(release => ({
      id: release.id.toString(),
      url: release.url,
      title: release.title,
      artists: release.release_artists?.map((ra: any) => ra.artist?.name).join(', ') || 'Various Artists',
      format: release.format || 'CD',
      imageUrl: `/images/releases/${release.id}.jpeg`,
      description: release.release_translations?.[0]?.description || '',
      releaseDate: release.release_date,
      catalogNumber: release.catalog_number,
      shopUrl: release.shop_url,
      spotifyUrl: release.spotify_url,
      appleMusicUrl: release.apple_music_url
    })) || []

    return NextResponse.json({
      releases: transformedReleases,
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

// Get single release by ID or slug
export async function GET_RELEASE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const lang = request.nextUrl.searchParams.get('lang') as 'en' | 'fr' | 'de' || getLanguageFromHeaders(request.headers)
    const { id } = params

    // Try to fetch by ID first, then by URL slug
    const isNumeric = !isNaN(parseInt(id))
    
    const { data: release, error } = await supabase
      .from('releases')
      .select(`
        *,
        release_translations!inner(
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
        ),
        release_composers(
          composer:composers(
            id,
            name,
            slug
          )
        ),
        reviews(
          id,
          publication,
          reviewer_name,
          review_date,
          rating,
          review_url,
          review_translations!inner(
            language,
            review_text
          )
        )
      `)
      .eq('release_translations.language', lang)
      .eq('reviews.review_translations.language', lang)
      .eq(isNumeric ? 'id' : 'url', id)
      .single()

    if (error || !release) {
      return NextResponse.json({ error: 'Release not found' }, { status: 404 })
    }

    // Transform to template format
    const transformed = {
      id: release.id.toString(),
      title: release.title,
      artist: release.release_artists?.map((ra: any) => ra.artist?.name).join(', ') || 'Various Artists',
      artists: release.release_artists?.map((ra: any) => ({
        id: ra.artist.id.toString(),
        name: ra.artist.name,
        url: ra.artist.url
      })) || [],
      composers: release.release_composers?.map((rc: any) => ({
        id: rc.composer.id.toString(),
        name: rc.composer.name,
        url: rc.composer.slug
      })) || [],
      format: release.format || 'CD',
      imageUrl: `/images/releases/${release.id}.jpeg`,
      description: release.release_translations?.[0]?.description || '',
      tracklist: release.release_translations?.[0]?.tracklist || '',
      releaseDate: release.release_date,
      catalogNumber: release.catalog_number,
      shopUrl: release.shop_url,
      spotifyUrl: release.spotify_url,
      appleMusicUrl: release.apple_music_url,
      youtubeMusicUrl: release.youtube_music_url,
      amazonMusicUrl: release.amazon_music_url,
      bandcampUrl: release.bandcamp_url,
      soundcloudUrl: release.soundcloud_url,
      reviews: release.reviews?.map((review: any) => ({
        id: review.id.toString(),
        publication: review.publication,
        reviewerName: review.reviewer_name,
        reviewDate: review.review_date,
        rating: review.rating,
        reviewText: review.review_translations?.[0]?.review_text || '',
        reviewUrl: review.review_url
      })) || []
    }

    return NextResponse.json(transformed)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}