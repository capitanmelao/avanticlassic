// Metadata retrieval system for streaming services
export interface PlaylistMetadata {
  title: string
  description?: string
  image_url?: string
  artist?: string
  track_count?: number
  duration?: number
}

export interface MetadataResult {
  success: boolean
  data?: PlaylistMetadata
  error?: string
}

// Spotify API integration
async function getSpotifyMetadata(url: string): Promise<MetadataResult> {
  try {
    // Extract playlist/album ID from URL
    const spotifyMatch = url.match(/(?:playlist|album)\/([a-zA-Z0-9]+)/);
    if (!spotifyMatch) {
      return { success: false, error: 'Invalid Spotify URL' };
    }

    const id = spotifyMatch[1];
    const isPlaylist = url.includes('/playlist/');
    
    // Note: This requires Spotify Web API credentials
    // For now, we'll use oEmbed or webpage scraping as a fallback
    const response = await fetch(`https://open.spotify.com/embed/${isPlaylist ? 'playlist' : 'album'}/${id}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to fetch Spotify data' };
    }

    const html = await response.text();
    
    // Extract metadata from HTML
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    const descriptionMatch = html.match(/<meta property="og:description" content="([^"]+)"/);
    const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
    
    const title = titleMatch?.[1]?.replace(' - Spotify', '') || 'Untitled Playlist';
    const description = descriptionMatch?.[1];
    const image_url = imageMatch?.[1];

    return {
      success: true,
      data: {
        title,
        description,
        image_url
      }
    };

  } catch {
    return { success: false, error: 'Failed to retrieve Spotify metadata' };
  }
}

// Apple Music API integration
async function getAppleMusicMetadata(url: string): Promise<MetadataResult> {
  try {
    // Extract album/playlist ID from URL
    const appleMatch = url.match(/(?:album|playlist)\/[^\/]+\/(\d+)/);
    if (!appleMatch) {
      return { success: false, error: 'Invalid Apple Music URL' };
    }

    // Use web scraping approach for Apple Music
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to fetch Apple Music data' };
    }

    const html = await response.text();
    
    // Extract metadata from HTML
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    const descriptionMatch = html.match(/<meta property="og:description" content="([^"]+)"/);
    const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
    
    const title = titleMatch?.[1]?.replace(' - Apple Music', '') || 'Untitled Album';
    const description = descriptionMatch?.[1];
    const image_url = imageMatch?.[1];

    return {
      success: true,
      data: {
        title,
        description,
        image_url
      }
    };

  } catch {
    return { success: false, error: 'Failed to retrieve Apple Music metadata' };
  }
}

// YouTube API integration
async function getYouTubeMetadata(url: string): Promise<MetadataResult> {
  try {
    // Extract playlist ID from URL
    const youtubeMatch = url.match(/[?&]list=([^&]+)/);
    if (!youtubeMatch) {
      return { success: false, error: 'Invalid YouTube playlist URL' };
    }

    const playlistId = youtubeMatch[1];
    
    // Use YouTube oEmbed API
    const oembedResponse = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/playlist?list=${playlistId}&format=json`
    );

    if (!oembedResponse.ok) {
      return { success: false, error: 'Failed to fetch YouTube data' };
    }

    const oembedData = await oembedResponse.json();
    
    return {
      success: true,
      data: {
        title: oembedData.title || 'Untitled Playlist',
        description: oembedData.description,
        image_url: oembedData.thumbnail_url,
        artist: oembedData.author_name
      }
    };

  } catch {
    return { success: false, error: 'Failed to retrieve YouTube metadata' };
  }
}

// Main metadata retrieval function
export async function retrievePlaylistMetadata(urls: {
  spotify_url?: string
  apple_music_url?: string
  youtube_url?: string
}): Promise<MetadataResult> {
  
  // Try to get metadata from available URLs in order of preference
  const urlsToTry = [
    { url: urls.spotify_url, fetcher: getSpotifyMetadata },
    { url: urls.apple_music_url, fetcher: getAppleMusicMetadata },
    { url: urls.youtube_url, fetcher: getYouTubeMetadata }
  ];

  for (const { url, fetcher } of urlsToTry) {
    if (url) {
      const result = await fetcher(url);
      if (result.success) {
        return result;
      }
    }
  }

  return { success: false, error: 'No valid metadata found from any source' };
}

// API endpoint helper
export async function handleMetadataRequest(request: {
  spotify_url?: string
  apple_music_url?: string
  youtube_url?: string
}): Promise<MetadataResult> {
  
  // Validate that at least one URL is provided
  if (!request.spotify_url && !request.apple_music_url && !request.youtube_url) {
    return { success: false, error: 'At least one streaming service URL is required' };
  }

  return await retrievePlaylistMetadata(request);
}