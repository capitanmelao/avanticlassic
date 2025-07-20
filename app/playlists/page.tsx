"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Loader2, ArrowUp, ExternalLinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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

// Fallback playlists for testing
const fallbackPlaylists: Playlist[] = [
  {
    id: 999,
    slug: "fallback-test",
    title: "Fallback Test Playlist",
    description: "This is a fallback playlist for testing",
    category: "by_artist",
    image_url: "/images/placeholder-album.jpg",
    spotify_url: "https://open.spotify.com/playlist/example",
    apple_music_url: null,
    youtube_url: null,
    featured: false,
    track_count: 5
  }
]

// Fetch all playlists from API
async function getAllPlaylists(): Promise<Playlist[]> {
  try {
    // Use relative URL for API calls to work in all environments
    const response = await fetch(`/api/playlists?lang=en`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      console.error('API response not ok:', response.status, response.statusText)
      return fallbackPlaylists
    }
    
    const playlists: Playlist[] = await response.json()
    return playlists.length > 0 ? playlists : fallbackPlaylists
  } catch (error) {
    console.error('Error fetching playlists:', error)
    return fallbackPlaylists
  }
}

// Unified playlist card component
function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <Card className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800">
      <CardContent className="p-0">
        <div className="relative w-full aspect-square">
          {playlist.image_url ? (
            <Image
              src={playlist.image_url}
              width={400}
              height={400}
              alt={playlist.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-2 right-2">
            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              {playlist.category.replace('by_', '').replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2 min-h-[2.5em] text-gray-900 dark:text-gray-50 group-hover:text-primary transition-colors text-center mb-2">
            {playlist.title}
          </h3>
          {playlist.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5em] text-center mb-3">
              {playlist.description}
            </p>
          )}
          
          {/* Track count */}
          <div className="text-center mb-3">
            <span className="text-xs text-muted-foreground">
              {playlist.track_count > 0 ? `${playlist.track_count} tracks` : 'No tracks'}
            </span>
          </div>
          
          {/* Streaming service buttons */}
          <div className="flex justify-center gap-2">
            {playlist.spotify_url && (
              <Link
                href={playlist.spotify_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 max-w-[100px] bg-green-500 hover:bg-green-600 text-white text-xs py-2 px-3 rounded-md transition-colors text-center"
                aria-label={`Listen to ${playlist.title} on Spotify`}
              >
                Spotify
              </Link>
            )}
            {playlist.apple_music_url && (
              <Link
                href={playlist.apple_music_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 max-w-[100px] bg-gray-800 hover:bg-gray-900 text-white text-xs py-2 px-3 rounded-md transition-colors text-center"
                aria-label={`Listen to ${playlist.title} on Apple Music`}
              >
                Apple Music
              </Link>
            )}
            {playlist.youtube_url && (
              <Link
                href={playlist.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 max-w-[100px] bg-red-500 hover:bg-red-600 text-white text-xs py-2 px-3 rounded-md transition-colors text-center"
                aria-label={`Listen to ${playlist.title} on YouTube`}
              >
                YouTube
              </Link>
            )}
          </div>
          
          {/* Show message if no streaming links */}
          {!playlist.spotify_url && !playlist.apple_music_url && !playlist.youtube_url && (
            <div className="text-center">
              <span className="text-xs text-muted-foreground">No streaming links available</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function PlaylistsPage() {
  // State management
  const [allPlaylists, setAllPlaylists] = useState<Playlist[]>([])
  const [displayedPlaylists, setDisplayedPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [showScrollTop, setShowScrollTop] = useState(false)
  
  // Refs
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const playlistsPerLoad = 16
  
  // Fetch all playlists
  const fetchPlaylists = useCallback(async () => {
    try {
      setLoading(true)
      const playlists = await getAllPlaylists()
      setAllPlaylists(playlists)
    } catch (error) {
      console.error('Error in fetchPlaylists:', error)
      setAllPlaylists(fallbackPlaylists)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initialize displayed playlists when allPlaylists changes
  useEffect(() => {
    if (allPlaylists.length > 0) {
      setDisplayedPlaylists(allPlaylists.slice(0, playlistsPerLoad))
      setHasMore(allPlaylists.length > playlistsPerLoad)
    }
  }, [allPlaylists])
  
  // Load more playlists
  const loadMorePlaylists = useCallback(() => {
    if (loadingMore || !hasMore) return
    
    setLoadingMore(true)
    
    setTimeout(() => {
      const currentLength = displayedPlaylists.length
      const nextBatch = allPlaylists.slice(currentLength, currentLength + playlistsPerLoad)
      setDisplayedPlaylists(prev => [...prev, ...nextBatch])
      setHasMore(currentLength + playlistsPerLoad < allPlaylists.length)
      setLoadingMore(false)
    }, 100) // Reduced delay for faster loading
  }, [allPlaylists, displayedPlaylists, loadingMore, hasMore])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMorePlaylists()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [loadMorePlaylists, hasMore, loadingMore])

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Initial load
  useEffect(() => {
    fetchPlaylists()
  }, [fetchPlaylists])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2 text-lg">Loading playlists...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-12 md:py-16">
      <section className="py-8">
        {displayedPlaylists.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {displayedPlaylists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
            
            {/* Loading more indicator */}
            <div ref={loadMoreRef} className="py-8">
              {loadingMore && (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading more playlists...</span>
                </div>
              )}
              {!hasMore && displayedPlaylists.length > playlistsPerLoad && (
                <div className="text-center text-muted-foreground">
                  You've seen all {allPlaylists.length} playlists
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold mb-4">No playlists found</h3>
            <p className="text-muted-foreground mb-6">
              Playlists will appear here when they become available
            </p>
          </div>
        )}
      </section>

      {/* Scroll to top button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 rounded-full p-3 shadow-lg"
          size="icon"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}