import { NextRequest, NextResponse } from 'next/server'
import { supabase, getLanguageFromHeaders, getYouTubeThumbnail } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const artist = searchParams.get('artist') || ''
    const featured = searchParams.get('featured') === 'true'
    const lang = searchParams.get('lang') as 'en' | 'fr' | 'de' || getLanguageFromHeaders(request.headers)
    
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('videos')
      .select(`
        id,
        title,
        youtube_id,
        youtube_url,
        featured,
        sort_order,
        video_translations(
          language,
          description
        ),
        video_artists(
          artist:artists(
            id,
            name,
            url
          )
        )
      `, { count: 'exact' })
      .order('featured', { ascending: false })
      .order('sort_order')
      .range(offset, offset + limit - 1)

    // Apply filters
    if (search) {
      query = query.ilike('title', `%${search}%`)
    }
    
    if (featured) {
      query = query.eq('featured', true)
    }

    const { data: videos, error, count } = await query

    if (error) {
      console.error('Error fetching videos:', error)
      return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
    }

    // Transform data to match template format
    const transformedVideos = videos?.map(video => {
      const translation = video.video_translations?.find((t: any) => t.language === lang) ||
                         video.video_translations?.find((t: any) => t.language === 'en') ||
                         video.video_translations?.[0]
      
      const artists = video.video_artists?.map((va: any) => va.artist?.name).join(', ') || 'Various Artists'
      
      return {
        id: video.id.toString(),
        title: video.title || `Video ${video.id}`,
        artist: artists,
        thumbnailUrl: getYouTubeThumbnail(video.youtube_id),
        youtubeId: video.youtube_id,
        youtubeUrl: video.youtube_url,
        embedUrl: `https://www.youtube.com/embed/${video.youtube_id}`,
        description: translation?.description || ''
      }
    }) || []

    return NextResponse.json({
      videos: transformedVideos,
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

