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

// Legacy videos from old SSG site
const legacyVideos: Video[] = [
  { id: "legacy-1", youtubeId: "aHsF6g6iHy4", title: "Roby Lakatos Biréli Lagrène - Tribute to Stéphane & Django", artistName: "Roby Lakatos" },
  { id: "legacy-2", youtubeId: "iYSvHYKX4Ms", title: "HOMILIA - New Album! Manu Comté & B'Strings Quintet feat. Tomás Gubitsch", artistName: "Manu Comté" },
  { id: "legacy-3", youtubeId: "tjGkbx1JA6Q", title: "ROBY LAKATOS plays « Du Schwarzer Zigeuner » from the new album 'LA PASSION'", artistName: "Roby Lakatos" },
  { id: "legacy-4", youtubeId: "RsJY-BIcLhg", title: "Trailer to the upcoming album of Duo Lechner Tiempo \"Tango Rhapsody\"", artistName: "Sergio Tiempo" },
  { id: "legacy-5", youtubeId: "rWXaVSD9mwE", title: "Alexander Gurning on Bach's Goldberg Variations", artistName: "Alexander Gurning" },
  { id: "legacy-6", youtubeId: "u_A7Tgg8zD4", title: "Duo Lechner Tiempo: La Muerte del Ángel by Ástor Piazzolla", artistName: "Sergio Tiempo" },
  { id: "legacy-7", youtubeId: "pTBbGE5iBEE", title: "Philippe Quint plays Bruch, Mendelssohn and Beethoven", artistName: "Philippe Quint" },
  { id: "legacy-8", youtubeId: "M7D6tCB9AqA", title: "Roby Lakatos - Romania from the album Klezmer Karma", artistName: "Roby Lakatos" },
  { id: "legacy-9", youtubeId: "omuZF6oaCnw", title: "Duo Lechner Tiempo: Variations on a Theme by Paganini", artistName: "Sergio Tiempo" },
  { id: "legacy-10", youtubeId: "wc7Lksz1aBM", title: "Duo Lechner Tiempo: \"Slavonic Dance, Op. 72, No. 2 in E minor\" by Antonin Dvořák", artistName: "Sergio Tiempo" },
  { id: "legacy-11", youtubeId: "9U3F7yP6Mxk", title: "Roby Lakatos - Hejre Kati from the album Fire Dance", artistName: "Roby Lakatos" },
  { id: "legacy-12", youtubeId: "8_oIqWuSu5o", title: "WUNDERHORN", artistName: "Dietrich Henschel" },
  { id: "legacy-13", youtubeId: "-rV5CcK1hd4", title: "RENDEZ-VOUS WITH MARTHA ARGERICH volume 3", artistName: "Martha Argerich" }
]

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
  const videosPerLoad = 12
  
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
        
        // Combine API videos with legacy videos
        const combinedVideos = [...apiVideos, ...legacyVideos]
        setAllVideos(combinedVideos)
      } else {
        // Fallback to legacy videos only
        setAllVideos(legacyVideos)
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
      setAllVideos(legacyVideos)
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
    }, 500) // Simulate loading delay for smooth UX
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
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-gray-900 dark:text-gray-50 tracking-tight">
            Our Videos
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Discover the artistry and passion of classical music through our curated video collection
          </p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2 text-lg">Loading videos...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-gray-900 dark:text-gray-50 tracking-tight">
          Our Videos
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
          Discover the artistry and passion of classical music through our curated video collection
        </p>
      </div>
      
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
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
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
  }

  const thumbnailUrl = video.youtubeId 
    ? getThumbnail(video.youtubeId) 
    : video.thumbnailUrl || "/placeholder.svg"

  return (
    <Card className="group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-500 hover:scale-105 bg-white dark:bg-gray-800">
      <CardContent className="p-0 relative">
        <div className="relative overflow-hidden">
          <Image
            src={thumbnailUrl}
            width={600}
            height={338} // 16:9 aspect ratio for larger videos
            alt={video.title}
            className="w-full h-auto object-cover aspect-video group-hover:scale-110 transition-transform duration-700"
          />
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all duration-300">
            <div className="transform transition-all duration-300 group-hover:scale-110">
              <Button
                variant="ghost"
                size="icon"
                className="h-20 w-20 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border border-white/30 shadow-xl"
              >
                <Play className="h-10 w-10 fill-current ml-1" />
                <span className="sr-only">Play video</span>
              </Button>
            </div>
          </div>

          {/* Title overlay on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="font-bold text-xl mb-2 drop-shadow-lg">
              {video.title}
            </h3>
            <p className="text-sm text-white/90 drop-shadow">
              {video.artistName || video.artist || 'Avanti Classic'}
            </p>
          </div>
        </div>
        
        {/* Default title (visible when not hovering) */}
        <div className="p-6 group-hover:opacity-0 transition-opacity duration-300">
          <h3 className="font-semibold text-xl line-clamp-2 mb-2 text-gray-900 dark:text-gray-50">
            {video.title}
          </h3>
          <p className="text-base text-muted-foreground">
            {video.artistName || video.artist || 'Avanti Classic'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
