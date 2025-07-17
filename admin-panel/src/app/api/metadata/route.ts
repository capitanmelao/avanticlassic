import { NextRequest, NextResponse } from 'next/server'
import { handleMetadataRequest } from '@/lib/metadata-retrieval'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { spotify_url, apple_music_url, youtube_url } = body

    const result = await handleMetadataRequest({
      spotify_url,
      apple_music_url,
      youtube_url
    })

    if (result.success) {
      return NextResponse.json(result.data)
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Metadata API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}