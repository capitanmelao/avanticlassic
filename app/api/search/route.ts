import { NextRequest, NextResponse } from 'next/server'
import { supabase, getLanguageFromHeaders, getYouTubeThumbnail } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') || 'all' // all, artists, releases, videos, news, composers, playlists
    const limit = parseInt(searchParams.get('limit') || '10')
    const lang = searchParams.get('lang') as 'en' | 'fr' | 'de' || getLanguageFromHeaders(request.headers)
    
    if (!query) {
      return NextResponse.json({ results: [] })
    }

    const results: any = {
      artists: [],
      releases: [],
      videos: [],
      news: [],
      composers: [],
      playlists: []
    }

    // Search Artists
    if (type === 'all' || type === 'artists') {
      const { data: artists } = await supabase
        .from('artists')
        .select(`
          id,
          url,
          name,
          image_url,
          instrument,
          artist_translations!inner(
            language,
            description
          )
        `)
        .eq('artist_translations.language', lang)
        .ilike('name', `%${query}%`)
        .limit(limit)

      results.artists = artists?.map(artist => ({
        type: 'artist',
        id: artist.id.toString(),
        title: artist.name,
        subtitle: artist.instrument || 'Performer',
        description: artist.artist_translations?.[0]?.description?.substring(0, 150) + '...' || '',
        imageUrl: artist.image_url || `/images/artists/${artist.id}-800.jpeg`,
        url: `/artists/${artist.url}`
      })) || []
    }

    // Search Releases
    if (type === 'all' || type === 'releases') {
      const { data: releases } = await supabase
        .from('releases')
        .select(`
          id,
          url,
          title,
          image_url,
          release_translations!inner(
            language,
            description
          ),
          release_artists(
            artist:artists(name)
          )
        `)
        .eq('release_translations.language', lang)
        .ilike('title', `%${query}%`)
        .limit(limit)

      results.releases = releases?.map(release => ({
        type: 'release',
        id: release.id.toString(),
        title: release.title,
        subtitle: release.release_artists?.map((ra: any) => ra.artist?.name).join(', ') || 'Various Artists',
        description: release.release_translations?.[0]?.description?.substring(0, 150) + '...' || '',
        imageUrl: release.image_url || `/images/releases/${release.id}.jpeg`,
        url: `/releases/${release.url}`
      })) || []
    }

    // Search Videos
    if (type === 'all' || type === 'videos') {
      const { data: videos } = await supabase
        .from('videos')
        .select(`
          id,
          url,
          title,
          artist_name,
          youtube_id,
          thumbnail_url,
          video_descriptions!inner(
            language,
            description
          )
        `)
        .eq('video_descriptions.language', lang)
        .or(`title.ilike.%${query}%,artist_name.ilike.%${query}%`)
        .limit(limit)

      results.videos = videos?.map(video => ({
        type: 'video',
        id: video.id.toString(),
        title: video.title,
        subtitle: video.artist_name,
        description: video.video_descriptions?.[0]?.description?.substring(0, 150) + '...' || '',
        imageUrl: video.thumbnail_url || getYouTubeThumbnail(video.youtube_id),
        url: `/videos/${video.url}`
      })) || []
    }

    // Search News
    if (type === 'all' || type === 'news') {
      const { data: news } = await supabase
        .from('news')
        .select(`
          id,
          slug,
          featured_image,
          published_date,
          news_translations!inner(
            language,
            title,
            excerpt
          )
        `)
        .eq('news_translations.language', lang)
        .eq('status', 'published')
        .ilike('news_translations.title', `%${query}%`)
        .limit(limit)

      results.news = news?.map(article => ({
        type: 'news',
        id: article.id.toString(),
        title: article.news_translations?.[0]?.title || '',
        subtitle: new Date(article.published_date).toLocaleDateString(),
        description: article.news_translations?.[0]?.excerpt || '',
        imageUrl: article.featured_image || '/images/news-placeholder.jpg',
        url: `/news/${article.slug}`
      })) || []
    }

    // Search Composers
    if (type === 'all' || type === 'composers') {
      const { data: composers } = await supabase
        .from('composers')
        .select(`
          id,
          slug,
          name,
          period,
          image_url,
          composer_translations!inner(
            language,
            biography
          )
        `)
        .eq('composer_translations.language', lang)
        .ilike('name', `%${query}%`)
        .limit(limit)

      results.composers = composers?.map(composer => ({
        type: 'composer',
        id: composer.id.toString(),
        title: composer.name,
        subtitle: composer.period ? composer.period.charAt(0).toUpperCase() + composer.period.slice(1) : '',
        description: composer.composer_translations?.[0]?.biography?.substring(0, 150) + '...' || '',
        imageUrl: composer.image_url || '/images/composer-placeholder.jpg',
        url: `/composers/${composer.slug}`
      })) || []
    }

    // Search Playlists
    if (type === 'all' || type === 'playlists') {
      const { data: playlists } = await supabase
        .from('playlists')
        .select(`
          id,
          slug,
          category,
          image_url,
          playlist_translations!inner(
            language,
            title,
            description
          )
        `)
        .eq('playlist_translations.language', lang)
        .ilike('playlist_translations.title', `%${query}%`)
        .limit(limit)

      results.playlists = playlists?.map(playlist => ({
        type: 'playlist',
        id: playlist.id.toString(),
        title: playlist.playlist_translations?.[0]?.title || '',
        subtitle: playlist.category ? playlist.category.replace(/_/g, ' ').charAt(0).toUpperCase() + playlist.category.replace(/_/g, ' ').slice(1) : '',
        description: playlist.playlist_translations?.[0]?.description || '',
        imageUrl: playlist.image_url || '/images/playlist-placeholder.jpg',
        url: `/playlists/${playlist.slug}`
      })) || []
    }

    // Combine all results for 'all' search
    if (type === 'all') {
      const allResults = [
        ...results.artists,
        ...results.releases,
        ...results.videos,
        ...results.news,
        ...results.composers,
        ...results.playlists
      ].slice(0, limit * 2) // Return more results for combined search

      return NextResponse.json({ 
        results: allResults,
        counts: {
          artists: results.artists.length,
          releases: results.releases.length,
          videos: results.videos.length,
          news: results.news.length,
          composers: results.composers.length,
          playlists: results.playlists.length
        }
      })
    }

    // Return type-specific results
    return NextResponse.json({ results: results[type] || [] })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}