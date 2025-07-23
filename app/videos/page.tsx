"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Play, Loader2, ArrowUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import VideoSearchFilter from "@/components/videos/video-search-filter"

// Video interface
interface Video {
  id: string
  title: string
  artist?: string
  artistName?: string
  youtubeId?: string
  thumbnailUrl?: string
  youtubeUrl?: string
  embedUrl?: string
  description?: string
}


export default function VideosPage() {
  // State management
  const [allVideos, setAllVideos] = useState<Video[]>([])
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([])
  const [displayedVideos, setDisplayedVideos] = useState<Video[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedArtist, setSelectedArtist] = useState("all")
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [showScrollTop, setShowScrollTop] = useState(false)
  
  // Refs
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const videosPerLoad = 16
  
  // Fetch all videos from API
  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true)
      
      // Fetch from API with high limit to get all videos
      const response = await fetch('/api/videos?limit=1000', {
        cache: 'no-store'
      })
      
      if (response.ok) {
        const data = await response.json()
        const apiVideos = data.videos || []
        setAllVideos(apiVideos)
      } else {
        console.error('Failed to fetch videos from API')
        setAllVideos([])
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
      setAllVideos([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Extract unique artists for filter dropdown
  const artistOptions = useCallback(() => {
    const artists = new Set<string>()
    artists.add("all")
    
    allVideos.forEach(video => {
      const artist = video.artist || video.artistName
      if (artist && artist !== 'Avanti Classic' && artist !== 'Avanticlassic') {
        artists.add(artist)
      }
    })
    
    return Array.from(artists).map(artist => ({
      value: artist,
      label: artist === "all" ? "All Artists" : artist
    }))
  }, [allVideos])

  // Filter videos based on search and artist
  useEffect(() => {
    let filtered = allVideos

    // Filter by artist
    if (selectedArtist && selectedArtist !== "all") {
      filtered = filtered.filter(video => {
        const artist = video.artist || video.artistName || ""
        return artist.toLowerCase().includes(selectedArtist.toLowerCase())
      })
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(video => {
        const title = video.title.toLowerCase()
        const artist = (video.artist || video.artistName || "").toLowerCase()
        const searchLower = searchTerm.toLowerCase()
        return title.includes(searchLower) || artist.includes(searchLower)
      })
    }

    setFilteredVideos(filtered)
    // Reset displayed videos when filters change
    setDisplayedVideos(filtered.slice(0, videosPerLoad))
    setHasMore(filtered.length > videosPerLoad)
  }, [allVideos, selectedArtist, searchTerm])

  // Load more videos
  const loadMoreVideos = useCallback(() => {
    if (loadingMore || !hasMore) return
    
    setLoadingMore(true)
    
    setTimeout(() => {
      const currentLength = displayedVideos.length
      const nextBatch = filteredVideos.slice(currentLength, currentLength + videosPerLoad)
      setDisplayedVideos(prev => [...prev, ...nextBatch])
      setHasMore(currentLength + videosPerLoad < filteredVideos.length)
      setLoadingMore(false)
    }, 100) // Reduced delay for faster loading
  }, [filteredVideos, displayedVideos, loadingMore, hasMore])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreVideos()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [loadMoreVideos, hasMore, loadingMore])

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
    fetchVideos()
  }, [fetchVideos])

  const handleSearchChange = (search: string) => {
    setSearchTerm(search)
  }

  const handleFilterChange = (filter: string) => {
    setSelectedArtist(filter)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="container px-4 md:px-6 py-12 md:py-20">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2 text-lg">Loading videos...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-12 md:py-20">
      
      <VideoSearchFilter
        videos={allVideos}
        searchPlaceholder="Search videos and artists..."
        filterOptions={artistOptions()}
        filterPlaceholder="Filter by Artist"
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        searchValue={searchTerm}
        filterValue={selectedArtist}
      />
      
      <section className="py-12">
        {displayedVideos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {displayedVideos.map((video) => (
                <div key={video.id}>
                  {video.id.toString().startsWith('legacy-') ? (
                    <a
                      href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <VideoCard video={video} />
                    </a>
                  ) : (
                    <Link href={`/videos/${video.id}`}>
                      <VideoCard video={video} />
                    </Link>
                  )}
                </div>
              ))}
            </div>
            
            {/* Loading more indicator */}
            <div ref={loadMoreRef} className="py-8">
              {loadingMore && (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading more videos...</span>
                </div>
              )}
              {!hasMore && displayedVideos.length > videosPerLoad && (
                <div className="text-center text-muted-foreground">
                  You've seen all {filteredVideos.length} videos
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold mb-4">No videos found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button 
              onClick={() => {
                setSearchTerm("")
                setSelectedArtist("all")
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
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

function VideoCard({ video }: { video: any }) {
  const getThumbnail = (youtubeId: string) => {
    return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
  }

  const thumbnailUrl = video.youtubeId 
    ? getThumbnail(video.youtubeId) 
    : video.thumbnailUrl || "/placeholder.svg"

  return (
    <div className="group relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={thumbnailUrl}
          alt={video.title}
          width={400}
          height={225}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 text-gray-900 ml-0.5" fill="currentColor" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-50 mb-2 line-clamp-2">
          {video.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {video.artistName || video.artist || 'Avanti Classic'}
        </p>
      </div>
    </div>
  )
}
