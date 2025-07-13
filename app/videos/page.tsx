import Link from "next/link"
import Image from "next/image"
import { Play } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SearchFilter from "@/components/shared/search-filter"
import PaginationControls from "@/components/shared/pagination-controls"

// Legacy videos from old SSG site
const legacyVideos = [
  { id: "legacy-1", youtubeId: "aHsF6g6iHy4", title: "Performance 1" },
  { id: "legacy-2", youtubeId: "iYSvHYKX4Ms", title: "Performance 2" },
  { id: "legacy-3", youtubeId: "tjGkbx1JA6Q", title: "Performance 3" },
  { id: "legacy-4", youtubeId: "RsJY-BIcLhg", title: "Performance 4" },
  { id: "legacy-5", youtubeId: "rWXaVSD9mwE", title: "Performance 5" },
  { id: "legacy-6", youtubeId: "u_A7Tgg8zD4", title: "Performance 6" },
  { id: "legacy-7", youtubeId: "pTBbGE5iBEE", title: "Performance 7" },
  { id: "legacy-8", youtubeId: "M7D6tCB9AqA", title: "Performance 8" },
  { id: "legacy-9", youtubeId: "omuZF6oaCnw", title: "Performance 9" },
  { id: "legacy-10", youtubeId: "wc7Lksz1aBM", title: "Performance 10" },
  { id: "legacy-11", youtubeId: "9U3F7yP6Mxk", title: "Performance 11" },
  { id: "legacy-12", youtubeId: "8_oIqWuSu5o", title: "Performance 12" },
  { id: "legacy-13", youtubeId: "-rV5CcK1hd4", title: "Performance 13" }
]

// Fetch videos from API
async function getVideos() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/videos`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })
    if (!response.ok) throw new Error('Failed to fetch videos')
    const apiVideos = await response.json()
    
    // Combine API videos with legacy videos
    const allVideos = [...apiVideos, ...legacyVideos]
    return allVideos
  } catch (error) {
    console.error('Error fetching videos:', error)
    // Return just legacy videos if API fails
    return legacyVideos
  }
}

export default async function VideosPage() {
  const videos = await getVideos()
  
  const filterOptions = [
    { value: "all", label: "All Categories" },
    { value: "performances", label: "Performances" },
    { value: "interviews", label: "Interviews" },
    { value: "trailers", label: "Trailers" },
  ]

  return (
    <div className="container px-4 md:px-6 py-12 md:py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">Our Videos</h1>
      <SearchFilter
        searchPlaceholder="Search videos..."
        filterOptions={filterOptions}
        filterPlaceholder="Filter by Category"
      />
      <section className="py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video: any) => (
            <div key={video.id}>
              {video.id.toString().startsWith('legacy-') ? (
                // For legacy videos, use direct YouTube link
                <a
                  href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <VideoCard video={video} />
                </a>
              ) : (
                // For API videos, use internal link
                <Link href={`/videos/${video.id}`}>
                  <VideoCard video={video} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>
      <PaginationControls />
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
    <Card className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
      <CardContent className="p-0 relative">
        <Image
          src={thumbnailUrl}
          width={400}
          height={225} // 16:9 aspect ratio for videos
          alt={video.title}
          className="w-full h-auto object-cover aspect-video"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-colors duration-300">
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-full bg-white/30 text-white hover:bg-white/50 backdrop-blur-sm"
          >
            <Play className="h-8 w-8 fill-current" />
            <span className="sr-only">Play video</span>
          </Button>
        </div>
        <div className="p-4 text-center">
          <h3 className="font-semibold text-lg line-clamp-2 min-h-[2.5em] text-gray-900 dark:text-gray-50">
            {video.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {video.artistName || video.artist || 'Avanti Classic'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
