import Link from "next/link"
import Image from "next/image"
import { Play } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SearchFilter from "@/components/shared/search-filter"
import PaginationControls from "@/components/shared/pagination-controls"

// Legacy videos from old SSG site with real titles from YouTube
const legacyVideos = [
  { id: "legacy-1", youtubeId: "aHsF6g6iHy4", title: "Roby Lakatos Biréli Lagrène - Tribute to Stéphane & Django", artistName: "Avanticlassic" },
  { id: "legacy-2", youtubeId: "iYSvHYKX4Ms", title: "HOMILIA - New Album! Manu Comté & B'Strings Quintet feat. Tomás Gubitsch", artistName: "Manu Comté" },
  { id: "legacy-3", youtubeId: "tjGkbx1JA6Q", title: "ROBY LAKATOS plays « Du Schwarzer Zigeuner » from the new album 'LA PASSION'", artistName: "Avanticlassic" },
  { id: "legacy-4", youtubeId: "RsJY-BIcLhg", title: "Trailer to the upcoming album of Duo Lechner Tiempo \"Tango Rhapsody\"", artistName: "Avanticlassic" },
  { id: "legacy-5", youtubeId: "rWXaVSD9mwE", title: "Alexander Gurning on Bach's Goldberg Variations", artistName: "Avanticlassic" },
  { id: "legacy-6", youtubeId: "u_A7Tgg8zD4", title: "Duo Lechner Tiempo: La Muerte del Ángel by Ástor Piazzolla", artistName: "Avanticlassic" },
  { id: "legacy-7", youtubeId: "pTBbGE5iBEE", title: "Philippe Quint plays Bruch, Mendelssohn and Beethoven", artistName: "Avanticlassic" },
  { id: "legacy-8", youtubeId: "M7D6tCB9AqA", title: "Roby Lakatos - Romania from the album Klezmer Karma", artistName: "Avanticlassic" },
  { id: "legacy-9", youtubeId: "omuZF6oaCnw", title: "Duo Lechner Tiempo: Variations on a Theme by Paganini", artistName: "Avanticlassic" },
  { id: "legacy-10", youtubeId: "wc7Lksz1aBM", title: "Duo Lechner Tiempo: \"Slavonic Dance, Op. 72, No. 2 in E minor\" by Antonin Dvořák", artistName: "Avanticlassic" },
  { id: "legacy-11", youtubeId: "9U3F7yP6Mxk", title: "Roby Lakatos - Hejre Kati from the album Fire Dance", artistName: "Avanticlassic" },
  { id: "legacy-12", youtubeId: "8_oIqWuSu5o", title: "WUNDERHORN", artistName: "Avanticlassic" },
  { id: "legacy-13", youtubeId: "-rV5CcK1hd4", title: "RENDEZ-VOUS WITH MARTHA ARGERICH volume 3", artistName: "Avanticlassic" }
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
    <div className="container px-4 md:px-6 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-gray-900 dark:text-gray-50 tracking-tight">
          Our Videos
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
          Discover the artistry and passion of classical music through our curated video collection
        </p>
      </div>
      <SearchFilter
        searchPlaceholder="Search videos..."
        filterOptions={filterOptions}
        filterPlaceholder="Filter by Category"
      />
      <section className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
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
