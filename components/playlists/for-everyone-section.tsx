import { PlaylistCard } from "./playlist-card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Playlist {
  id: string
  title: string
  imageUrl: string
}

interface ForEveryoneSectionProps {
  id: string
  title: string
  playlists: Playlist[]
  viewAllLink?: string
}

export default function ForEveryoneSection({ id, title, playlists, viewAllLink }: ForEveryoneSectionProps) {
  return (
    <section id={id} className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-6 md:mb-0">{title}</h2>
          {viewAllLink && (
            <Button asChild variant="link" className="text-primary hover:underline">
              <Link href={viewAllLink}>
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </div>
    </section>
  )
}
