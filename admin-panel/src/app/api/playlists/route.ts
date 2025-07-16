import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      slug,
      title,
      description,
      category,
      image_url,
      spotify_url,
      apple_music_url,
      youtube_url,
      featured,
      sort_order,
      translations,
      selectedReleases
    } = body

    // Validate required fields
    if (!slug || !title) {
      return NextResponse.json(
        { error: 'Slug and title are required' },
        { status: 400 }
      )
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Admin client not configured' },
        { status: 500 }
      )
    }

    // Create playlist
    const { data: playlist, error: playlistError } = await supabaseAdmin
      .from('playlists')
      .insert({
        slug,
        title,
        description,
        category,
        image_url,
        spotify_url,
        apple_music_url,
        youtube_url,
        featured,
        sort_order,
      })
      .select()
      .single()

    if (playlistError) {
      console.error('Playlist creation error:', playlistError)
      return NextResponse.json(
        { error: playlistError.message },
        { status: 500 }
      )
    }

    // Add translations
    if (translations) {
      const translationsToInsert = []
      for (const [lang, content] of Object.entries(translations)) {
        if (content && typeof content === 'object' && 'title' in content) {
          const translationContent = content as { title: string; description: string }
          if (translationContent.title || translationContent.description) {
            translationsToInsert.push({
              playlist_id: playlist.id,
              language: lang,
              title: translationContent.title || title,
              description: translationContent.description || description
            })
          }
        }
      }

      if (translationsToInsert.length > 0) {
        const { error: translationsError } = await supabaseAdmin
          .from('playlist_translations')
          .insert(translationsToInsert)
        
        if (translationsError) {
          console.error('Translation creation error:', translationsError)
          // Don't fail the whole request for translation errors
        }
      }
    }

    // Add tracks
    if (selectedReleases && Array.isArray(selectedReleases) && selectedReleases.length > 0) {
      const tracks = selectedReleases.map((releaseId: number, index: number) => ({
        playlist_id: playlist.id,
        release_id: releaseId,
        sort_order: index
      }))

      const { error: tracksError } = await supabaseAdmin
        .from('playlist_tracks')
        .insert(tracks)
      
      if (tracksError) {
        console.error('Track creation error:', tracksError)
        // Don't fail the whole request for track errors
      }
    }

    return NextResponse.json({ playlist })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}