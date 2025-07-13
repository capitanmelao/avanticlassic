import { NextRequest, NextResponse } from 'next/server'
import { supabase, getLanguageFromHeaders, getYouTubeThumbnail } from '@/lib/supabase'

export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const lang = request.nextUrl.searchParams.get('lang') as 'en' | 'fr' | 'de' || getLanguageFromHeaders(request.headers)
    const { id } = params

    // URL decode the parameter to handle special characters
    const decodedId = decodeURIComponent(id)

    // Try to fetch by ID
    const isNumeric = !isNaN(parseInt(decodedId))
    
    const { data: video, error } = await supabase
      .from('videos')
      .select(`
        *,
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
      `)
      .eq(isNumeric ? 'id' : 'youtube_id', decodedId)
      .single()

    if (error || !video) {
      console.error('Error fetching video:', error)
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // Get translation for the requested language, fallback to English
    const translation = video.video_translations?.find((t: any) => t.language === lang) ||
                       video.video_translations?.find((t: any) => t.language === 'en') ||
                       video.video_translations?.[0]

    const artists = video.video_artists?.map((va: any) => va.artist?.name).join(', ') || 'Various Artists'

    // Transform to match the expected format
    const transformed = {
      id: video.id.toString(),
      title: video.title || `Video ${video.id}`,
      artist: artists,
      artistList: video.video_artists?.map((va: any) => ({
        id: va.artist.id.toString(),
        name: va.artist.name,
        url: va.artist.url
      })) || [],
      thumbnailUrl: getYouTubeThumbnail(video.youtube_id),
      youtubeId: video.youtube_id,
      youtubeUrl: video.youtube_url,
      embedUrl: `https://www.youtube.com/embed/${video.youtube_id}`,
      description: translation?.description || ''
    }

    return NextResponse.json(transformed)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}