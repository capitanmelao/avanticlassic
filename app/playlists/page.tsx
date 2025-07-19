import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLinkIcon } from "lucide-react"

interface Playlist {
  id: number
  slug: string
  title: string
  description?: string
  category: 'by_artist' | 'by_composer' | 'by_theme'
  image_url?: string
  spotify_url?: string
  apple_music_url?: string
  youtube_url?: string
  featured: boolean
  track_count: number
}

// Category navigation component
function CategoryNavigation() {
  const categories = [
    { name: "BY ARTIST", href: "#by-artist" },
    { name: "BY COMPOSERS", href: "#by-composers" },
    { name: "BY THEME", href: "#by-theme" },
  ]

  return (
    <nav className="w-full bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4">
      <div className="container px-4 md:px-6">
        <div className="flex justify-center space-x-8">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

// Artist playlist card component
function ArtistPlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <Card className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
      <CardContent className="p-0">
        <div className="relative w-full aspect-square">
          {playlist.image_url ? (
            <Image
              src={playlist.image_url}
              width={300}
              height={300}
              alt={playlist.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
            <h3 className="text-xl font-bold text-white">{playlist.title}</h3>
          </div>
        </div>
        <div className="p-4">
          {playlist.description && (
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 min-h-[2.5em] mb-4">
              {playlist.description}
            </p>
          )}
          <div className="flex justify-center gap-4">
            {playlist.spotify_url && (
              <Link
                href={playlist.spotify_url}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-opacity bg-gray-100 dark:bg-gray-700 p-2 rounded-full"
                aria-label={`Listen to ${playlist.title} on Spotify`}
              >
                <ExternalLinkIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </Link>
            )}
            {playlist.apple_music_url && (
              <Link
                href={playlist.apple_music_url}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-opacity bg-gray-100 dark:bg-gray-700 p-2 rounded-full"
                aria-label={`Listen to ${playlist.title} on Apple Music`}
              >
                <ExternalLinkIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </Link>
            )}
            {playlist.youtube_url && (
              <Link
                href={playlist.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-opacity bg-gray-100 dark:bg-gray-700 p-2 rounded-full"
                aria-label={`Listen to ${playlist.title} on YouTube`}
              >
                <ExternalLinkIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Simple playlist card for composers and themes
function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <Card className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
      <CardContent className="p-0">
        <div className="relative w-full aspect-square">
          {playlist.image_url ? (
            <Image
              src={playlist.image_url}
              width={300}
              height={300}
              alt={playlist.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {playlist.spotify_url && (
                <Link
                  href={playlist.spotify_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-colors"
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                </Link>
              )}
              {playlist.apple_music_url && (
                <Link
                  href={playlist.apple_music_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-colors"
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                </Link>
              )}
              {playlist.youtube_url && (
                <Link
                  href={playlist.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-colors"
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">
            {playlist.title}
          </h3>
          {playlist.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {playlist.description}
            </p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {playlist.track_count} tracks
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

async function getPlaylists(): Promise<{
  byArtist: Playlist[]
  byComposer: Playlist[]
  byTheme: Playlist[]
}> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/playlists?lang=en`, {
      next: { revalidate: 3600 }
    })
    
    if (!response.ok) {
      console.error('Failed to fetch playlists:', response.status)
      return { byArtist: [], byComposer: [], byTheme: [] }
    }
    
    const playlists: Playlist[] = await response.json()
    
    return {
      byArtist: playlists.filter(p => p.category === 'by_artist'),
      byComposer: playlists.filter(p => p.category === 'by_composer'),
      byTheme: playlists.filter(p => p.category === 'by_theme')
    }
  } catch (error) {
    console.error('Error fetching playlists:', error)
    return { byArtist: [], byComposer: [], byTheme: [] }
  }
}

export default async function PlaylistsPage() {
  const { byArtist, byComposer, byTheme } = await getPlaylists()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-8 md:py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 text-center relative overflow-hidden">
        <div className="container px-4 md:px-6 relative z-10">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-gray-900 dark:text-gray-50">
            OUR PLAYLISTS,
            <br />
            YOUR MOMENT
          </h1>
          <Button
            asChild
            className="mt-8 px-6 py-2 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Link href="#by-artist">Explore Playlists</Link>
          </Button>
        </div>
      </section>

      {/* Category Navigation */}
      <CategoryNavigation />

      {/* By Artist Section */}
      <section id="by-artist" className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-12">BY ARTIST</h2>
          {byArtist.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
              {byArtist.map((playlist) => (
                <ArtistPlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No artist playlists available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* By Composers Section */}
      <section id="by-composers" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-12">BY COMPOSERS</h2>
          {byComposer.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {byComposer.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No composer playlists available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* By Theme Section */}
      <section id="by-theme" className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-12">BY THEME</h2>
          {byTheme.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {byTheme.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No theme playlists available yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}