import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Music, Headphones } from "lucide-react" // Using Music for Spotify, Headphones for Apple Music

interface Composer {
  id: string
  name: string
  description: string
  imageUrl: string
  spotifyLink: string
  appleMusicLink: string
}

interface ComposerSectionProps {
  composer: Composer
}

export default function ComposerSection({ composer }: ComposerSectionProps) {
  return (
    <Card className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
      <CardContent className="p-0">
        <div className="relative w-full aspect-square">
          <Image
            src={composer.imageUrl || "/placeholder.svg"}
            width={300}
            height={300}
            alt={composer.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
            <h3 className="text-2xl font-bold text-white">{composer.name}</h3>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4 min-h-[5em] mb-4">
            {composer.description}
          </p>
          <div className="flex flex-col gap-2">
            <Button
              asChild
              className="w-full bg-gray-900 text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300 transition-colors"
            >
              <Link href={composer.spotifyLink} target="_blank" rel="noopener noreferrer">
                <Music className="h-4 w-4 mr-2" /> Listen on Spotify
              </Link>
            </Button>
            <Button
              asChild
              className="w-full bg-gray-900 text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300 transition-colors"
            >
              <Link href={composer.appleMusicLink} target="_blank" rel="noopener noreferrer">
                <Headphones className="h-4 w-4 mr-2" /> Listen on Apple Music
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
