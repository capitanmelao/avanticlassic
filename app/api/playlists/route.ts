import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')
    const lang = searchParams.get('lang') || 'en'

    let query = supabase
      .from('playlists')
      .select(`
        *,
        playlist_translations!inner (
          title,
          description,
          language
        ),
        playlist_tracks (
          id,
          release_id,
          releases (
            title,
            image_url
          )
        )
      `)
      .eq('playlist_translations.language', lang)
      .order('sort_order', { ascending: false })

    // Filter by category if provided
    if (category) {
      query = query.eq('category', category)
    }

    // Filter by featured status if provided
    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    // Apply limit if provided
    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data: playlists, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch playlists' }, { status: 500 })
    }

    // Transform the data to match the expected format
    const transformedPlaylists = playlists?.map(playlist => ({
      id: playlist.id,
      slug: playlist.slug,
      title: playlist.playlist_translations?.[0]?.title || playlist.title,
      description: playlist.playlist_translations?.[0]?.description || playlist.description,
      category: playlist.category,
      image_url: playlist.image_url,
      spotify_url: playlist.spotify_url,
      apple_music_url: playlist.apple_music_url,
      youtube_url: playlist.youtube_url,
      featured: playlist.featured,
      track_count: playlist.playlist_tracks?.length || 0,
      tracks: playlist.playlist_tracks?.map(track => ({
        id: track.id,
        release_id: track.release_id,
        release_title: track.releases?.title,
        release_image: track.releases?.image_url
      })) || []
    })) || []

    return NextResponse.json(transformedPlaylists)

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}