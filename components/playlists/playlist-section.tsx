import { PlaylistCard } from "./playlist-card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Playlist {
  id: string
  title: string
  imageUrl: string
}

interface FilterOption {
  value: string
  label: string
}

interface PlaylistSectionProps {
  id: string
  title: string
  playlists: Playlist[]
  filters?: FilterOption[]
  filterType?: "horizontal" | "vertical"
  viewAllLink?: string
}

export default function PlaylistSection({
  id,
  title,
  playlists,
  filters,
  filterType,
  viewAllLink,
}: PlaylistSectionProps) {
  return (
    <section id={id} className="py-16 md:py-24 bg-white dark:bg-gray-950">
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

        <div className="flex flex-col md:flex-row gap-8">
          {filters && filterType === "vertical" && (
            <div className="w-full md:w-1/4 lg:w-1/5 flex flex-col gap-2">
              {filters.map((filter) => (
                <Link
                  key={filter.value}
                  href="#"
                  className="flex items-center gap-2 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  {filter.label} <ArrowRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          )}

          <div
            className={`grid gap-6 ${
              filters && filterType === "vertical"
                ? "w-full md:w-3/4 lg:w-4/5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            }`}
          >
            {filters && filterType === "horizontal" && (
              <div className="col-span-full flex flex-wrap gap-3 mb-6">
                {filters.map((filter) => (
                  <Button
                    key={filter.value}
                    variant="outline"
                    className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary bg-transparent"
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            )}
            {playlists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
