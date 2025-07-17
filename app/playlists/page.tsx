import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlayIcon, ExternalLinkIcon } from "lucide-react"
import { Suspense } from "react"

interface Playlist {
  id: number
  slug: string
  title: string
  description?: string
  category: 'by_artist' | 'by_composer'
  image_url?: string
  spotify_url?: string
  apple_music_url?: string
  youtube_url?: string
  featured: boolean
  track_count: number
  tracks: Array<{
    id: number
    release_id: number
    release_title?: string
    release_image?: string
  }>
}

async function getPlaylists(): Promise<{
  byArtist: Playlist[]
  byComposer: Playlist[]
  featured: Playlist[]
}> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    
    // Fetch all playlists
    const response = await fetch(`${baseUrl}/api/playlists?lang=en`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    
    if (!response.ok) {
      console.error('Failed to fetch playlists:', response.status)
      return { byArtist: [], byComposer: [], featured: [] }
    }
    
    const playlists: Playlist[] = await response.json()
    
    return {
      byArtist: playlists.filter(p => p.category === 'by_artist'),
      byComposer: playlists.filter(p => p.category === 'by_composer'),
      featured: playlists.filter(p => p.featured)
    }
  } catch (error) {
    console.error('Error fetching playlists:', error)
    return { byArtist: [], byComposer: [], featured: [] }
  }
}

function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        {playlist.image_url ? (
          <img
            src={playlist.image_url}
            alt={playlist.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <PlayIcon className="w-12 h-12 text-white" />
          </div>
        )}
        
        {/* Overlay with streaming links */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            {playlist.spotify_url && (
              <a
                href={playlist.spotify_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors"
              >
                <ExternalLinkIcon className="w-4 h-4" />
              </a>
            )}
            {playlist.apple_music_url && (
              <a
                href={playlist.apple_music_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 hover:bg-gray-800 text-white p-2 rounded-full transition-colors"
              >
                <ExternalLinkIcon className="w-4 h-4" />
              </a>
            )}
            {playlist.youtube_url && (
              <a
                href={playlist.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
              >
                <ExternalLinkIcon className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
        
        {/* Featured Badge */}
        {playlist.featured && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            FEATURED
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
          {playlist.title}
        </h3>
        
        {playlist.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
            {playlist.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {playlist.track_count} tracks
          </span>
          
          <Link 
            href={`/playlists/${playlist.slug}`}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium text-sm hover:underline"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  )
}

function PlaylistSection({ 
  title, 
  subtitle, 
  playlists, 
  gradientFrom, 
  gradientTo 
}: { 
  title: string
  subtitle: string
  playlists: Playlist[]
  gradientFrom: string
  gradientTo: string
}) {
  if (playlists.length === 0) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className={`text-center p-12 rounded-2xl bg-gradient-to-r ${gradientFrom} ${gradientTo}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h2>
            <p className="text-xl text-white opacity-90 mb-8">{subtitle}</p>
            <p className="text-white opacity-80">Coming soon...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <div className={`text-center p-12 rounded-2xl bg-gradient-to-r ${gradientFrom} ${gradientTo} mb-16`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h2>
          <p className="text-xl text-white opacity-90 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        {/* Playlists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedPlaylistsHero({ playlists }: { playlists: Playlist[] }) {
  const featuredPlaylist = playlists[0]
  
  return (
    <section className="relative py-20 md:py-32 lg:py-40 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            DISCOVER
            <br />
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              CLASSICAL
            </span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-12 opacity-90">
            Curated playlists by legendary artists and timeless composers. 
            Experience classical music like never before.
          </p>
          
          {featuredPlaylist && (
            <div className="max-w-md mx-auto bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
              <div className="flex items-center space-x-4 mb-4">
                {featuredPlaylist.image_url && (
                  <img
                    src={featuredPlaylist.image_url}
                    alt={featuredPlaylist.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="text-left">
                  <p className="text-sm opacity-70">Featured Playlist</p>
                  <h3 className="text-lg font-bold">{featuredPlaylist.title}</h3>
                  <p className="text-sm opacity-70">{featuredPlaylist.track_count} tracks</p>
                </div>
              </div>
              <Link 
                href={`/playlists/${featuredPlaylist.slug}`}
                className="block w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Listen Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default async function PlaylistsPage() {
  const { byArtist, byComposer, featured } = await getPlaylists()
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Featured Playlist */}
      <FeaturedPlaylistsHero playlists={featured} />
      
      {/* Playlists By Artist Section */}
      <PlaylistSection
        title="PLAYLISTS BY ARTIST"
        subtitle="Discover curated collections from the world's most celebrated classical musicians and performers"
        playlists={byArtist}
        gradientFrom="from-blue-600"
        gradientTo="to-purple-600"
      />
      
      {/* Playlists By Composer Section */}
      <PlaylistSection
        title="PLAYLISTS BY COMPOSER"
        subtitle="Explore the timeless works of history's greatest composers, from Bach to Beethoven and beyond"
        playlists={byComposer}
        gradientFrom="from-purple-600"
        gradientTo="to-pink-600"
      />
    </div>
  )
}