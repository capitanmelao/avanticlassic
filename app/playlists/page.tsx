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
  console.log('getAllPlaylists called')
  try {
    console.log('Fetching playlists from /api/playlists?lang=en')
    // Use relative URL for API calls to work in all environments
    const response = await fetch(`/api/playlists?lang=en`, {
      cache: 'no-store'
    })
    
    console.log('Response received:', response.status, response.ok)
    
    if (!response.ok) {
      console.error('API response not ok:', response.status, response.statusText)
      console.log('Returning fallback playlists due to bad response')
      return fallbackPlaylists
    }
    
    const playlists: Playlist[] = await response.json()
    console.log('Raw API response:', playlists)
    console.log('Returning playlists, length:', playlists.length)
    return playlists.length > 0 ? playlists : fallbackPlaylists
  } catch (error) {
    console.error('Error fetching playlists:', error)
    console.log('Returning fallback playlists due to error')
    return fallbackPlaylists
  }
}

// Unified playlist card component
function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <Card className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 cursor-pointer hover:scale-105">
      <CardContent className="p-0">
        <div className="relative w-full aspect-square">
          {playlist.image_url ? (
            <Image
              src={playlist.image_url}
              width={400}
              height={400}
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
                  className="bg-green-500/80 hover:bg-green-500 backdrop-blur-sm text-white p-2 rounded-full transition-colors"
                  aria-label={`Listen to ${playlist.title} on Spotify`}
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                </Link>
              )}
              {playlist.apple_music_url && (
                <Link
                  href={playlist.apple_music_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black/80 hover:bg-black backdrop-blur-sm text-white p-2 rounded-full transition-colors"
                  aria-label={`Listen to ${playlist.title} on Apple Music`}
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                </Link>
              )}
              {playlist.youtube_url && (
                <Link
                  href={playlist.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-500/80 hover:bg-red-500 backdrop-blur-sm text-white p-2 rounded-full transition-colors"
                  aria-label={`Listen to ${playlist.title} on YouTube`}
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="p-4 text-center">
          <h3 className="font-semibold text-lg line-clamp-2 min-h-[2.5em] text-gray-900 dark:text-gray-50 group-hover:text-primary transition-colors">
            {playlist.title}
          </h3>
          {playlist.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5em] mt-2">
              {playlist.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {playlist.track_count} tracks • {playlist.category.replace('by_', '').replace('_', ' ')}
          </p>
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
    console.log('fetchPlaylists called')
    try {
      console.log('Setting loading to true')
      setLoading(true)
      console.log('Calling getAllPlaylists')
      const playlists = await getAllPlaylists()
      console.log('getAllPlaylists returned:', playlists.length, playlists)
      console.log('Setting allPlaylists')
      setAllPlaylists(playlists)
      console.log('allPlaylists set')
    } catch (error) {
      console.error('Error in fetchPlaylists:', error)
      console.log('Setting fallback playlists due to error')
      setAllPlaylists(fallbackPlaylists)
    } finally {
      console.log('Setting loading to false')
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
          <span className="ml-2 text-lg">Loading playlists... (Debug: allPlaylists.length = {allPlaylists.length})</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-12 md:py-16">
      <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded">
        DEBUG: loading={loading ? 'true' : 'false'}, allPlaylists.length={allPlaylists.length}, displayedPlaylists.length={displayedPlaylists.length}
      </div>
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