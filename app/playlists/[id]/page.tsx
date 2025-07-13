import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Play } from "lucide-react"

interface Playlist {
  id: string
  title: string
  imageUrl: string
  description: string
  tracks: { title: string; artist: string; duration: string }[]
}

// Dummy data for a single playlist detail
const dummyPlaylists: Playlist[] = [
  {
    id: "nr1",
    title: "OH MUSIC: NEW RELEASES",
    imageUrl: "/placeholder.svg?height=600&width=600&text=New+Releases+Playlist",
    description:
      "Stay up-to-date with the latest and greatest classical music releases from Avanti Classic. This playlist features a curated selection of our newest albums and tracks, showcasing groundbreaking performances and fresh interpretations from our roster of talented artists. Discover your next favorite piece here.",
    tracks: [
      { title: "Track 1: Title of New Piece", artist: "Artist Name", duration: "4:30" },
      { title: "Track 2: Another New Work", artist: "Another Artist", duration: "5:15" },
      { title: "Track 3: Contemporary Composition", artist: "Modern Ensemble", duration: "3:45" },
      { title: "Track 4: Reimagined Classic", artist: "Virtuoso Performer", duration: "6:00" },
    ],
  },
  {
    id: "cfy1",
    title: "ZEN INSPIRATION",
    imageUrl: "/placeholder.svg?height=600&width=600&text=Zen+Inspiration+Playlist",
    description:
      "Find your inner peace with this serene collection of classical music. Perfect for meditation, relaxation, or simply unwinding after a long day. Let the gentle melodies and harmonious compositions transport you to a state of calm and tranquility.",
    tracks: [
      { title: "Clair de Lune", artist: "Claude Debussy", duration: "5:00" },
      { title: "Gymnopédie No. 1", artist: "Erik Satie", duration: "3:30" },
      { title: "Spiegel im Spiegel", artist: "Arvo Pärt", duration: "8:00" },
      { title: "Canon in D", artist: "Johann Pachelbel", duration: "4:45" },
    ],
  },
  {
    id: "ep1",
    title: "JULIE ROSET",
    imageUrl: "/placeholder.svg?height=600&width=600&text=Julie+Roset+Playlist",
    description:
      "A curated selection of highlights from the acclaimed soprano Julie Roset. Experience her captivating voice and expressive interpretations across a range of repertoire, from Baroque arias to contemporary works. This playlist showcases the versatility and artistry of one of classical music's most exciting voices.",
    tracks: [
      { title: "Vivaldi: Nulla in mundo pax sincera", artist: "Julie Roset", duration: "7:20" },
      { title: "Handel: Lascia ch'io pianga", artist: "Julie Roset", duration: "4:50" },
      { title: "Mozart: Exsultate, jubilate", artist: "Julie Roset", duration: "5:30" },
      { title: "Contemporary Aria", artist: "Julie Roset", duration: "6:10" },
    ],
  },
]

export default function PlaylistDetailPage({ params }: { params: { id: string } }) {
  const playlist = dummyPlaylists.find((p) => p.id === params.id)

  if (!playlist) {
    return (
      <div className="container px-4 md:px-6 py-12 md:py-24 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Playlist Not Found</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">The playlist you are looking for does not exist.</p>
        <Button asChild className="mt-8">
          <Link href="/playlists">Back to Playlists</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-12 md:py-16">
      <div className="mb-8">
        <Button
          asChild
          variant="ghost"
          className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
        >
          <Link href="/playlists">
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back to Playlists
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-1 flex flex-col items-center space-y-4">
          <Image
            src={playlist.imageUrl || "/placeholder.svg"}
            width={400}
            height={400}
            alt={playlist.title}
            className="rounded-lg object-cover aspect-square shadow-lg"
          />
          <Button className="w-full max-w-[400px] bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <Play className="h-5 w-5 mr-2 fill-current" />
            Listen on Spotify
          </Button>
          <Button
            variant="outline"
            className="w-full max-w-[400px] text-primary border-primary hover:bg-primary hover:text-primary-foreground dark:text-primary-foreground dark:border-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground bg-transparent"
          >
            Add to Library
          </Button>
        </div>
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50">{playlist.title}</h1>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {playlist.description}
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-50">Tracks</h2>
          <div className="border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            {playlist.tracks.map((track, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border-b last:border-b-0 border-gray-200 dark:border-gray-700"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-50">{track.title}</p>
                  <p className="text-sm text-muted-foreground">{track.artist}</p>
                </div>
                <span className="text-sm text-muted-foreground">{track.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
