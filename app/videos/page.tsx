import Image from "next/image"
import { Play } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SearchFilter from "@/components/shared/search-filter"
import PaginationControls from "@/components/shared/pagination-controls"

interface Video {
  id: string
  title: string
  artist: string
  thumbnailUrl: string
}

const dummyVideos: Video[] = [
  {
    id: "1",
    title: "WUNDERHORN - Album Trailer",
    artist: "Dietrich Henschel",
    thumbnailUrl: "/placeholder.svg?height=200&width=300&text=Video+Thumbnail+1",
  },
  {
    id: "2",
    title: "ROBY LAKATOS plays Duo",
    artist: "Roby Lakatos",
    thumbnailUrl: "/placeholder.svg?height=200&width=300&text=Video+Thumbnail+2",
  },
  {
    id: "3",
    title: "Philippe Quint plays Bach",
    artist: "Philippe Quint",
    thumbnailUrl: "/placeholder.svg?height=200&width=300&text=Video+Thumbnail+3",
  },
  {
    id: "4",
    title: "HOMILIA - New Album",
    artist: "Artist Name",
    thumbnailUrl: "/placeholder.svg?height=200&width=300&text=Video+Thumbnail+4",
  },
  {
    id: "5",
    title: "Trailer to the upcoming album",
    artist: "Artist Name",
    thumbnailUrl: "/placeholder.svg?height=200&width=300&text=Video+Thumbnail+5",
  },
  {
    id: "6",
    title: "Duo Lehner Tiempo",
    artist: "Duo Lehner Tiempo",
    thumbnailUrl: "/placeholder.svg?height=200&width=300&text=Video+Thumbnail+6",
  },
  {
    id: "7",
    title: "Alexander Gurning on Bach",
    artist: "Alexander Gurning",
    thumbnailUrl: "/placeholder.svg?height=200&width=300&text=Video+Thumbnail+7",
  },
  {
    id: "8",
    title: "World Tangos Odyssey - Live",
    artist: "Roby Lakatos & Gang Tango",
    thumbnailUrl: "/placeholder.svg?height=200&width=300&text=Video+Thumbnail+8",
  },
]

export default function VideosPage() {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>
      <PaginationControls />
    </div>
  )
}

function VideoCard({ video }: { video: Video }) {
  return (
    <Card className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
      <CardContent className="p-0 relative">
        <Image
          src={video.thumbnailUrl || "/placeholder.svg"}
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
          <p className="text-sm text-muted-foreground line-clamp-1">{video.artist}</p>
        </div>
      </CardContent>
    </Card>
  )
}
