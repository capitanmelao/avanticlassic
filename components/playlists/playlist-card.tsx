import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface PlaylistCardProps {
  playlist: {
    id: string
    title: string
    imageUrl: string
  }
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <Link href={`/playlists/${playlist.id}`} className="block group">
      <Card className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
        <CardContent className="p-0">
          <Image
            src={playlist.imageUrl || "/placeholder.svg"}
            width={300}
            height={300}
            alt={playlist.title}
            className="w-full h-auto object-cover aspect-square"
          />
          <div className="p-4 text-center">
            <h3 className="font-semibold text-base md:text-lg line-clamp-2 min-h-[2.5em] text-gray-900 dark:text-gray-50">
              {playlist.title}
            </h3>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
