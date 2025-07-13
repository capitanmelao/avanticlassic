import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface Release {
  id: string
  title: string
  artist: string
  format: string
  imageUrl: string
}

const dummyReleases: Release[] = [
  {
    id: "1",
    title: "WORLD TANGOS ODYSSEY",
    artist: "ROBY LAKATOS & GANG TANGO",
    format: "CD",
    imageUrl: "/placeholder.svg?height=200&width=200&text=World+Tangos+Odyssey",
  },
  {
    id: "2",
    title: "Yendou - vox with Martha Argerich",
    artist: "- Volume 1 (CD2)",
    format: "CD2",
    imageUrl: "/placeholder.svg?height=200&width=200&text=Yendou+Vol+1",
  },
  {
    id: "3",
    title: "Sergio Tiempo",
    artist: "HOMMAGE - Sergio Tiempo (CD)",
    format: "CD",
    imageUrl: "/placeholder.svg?height=200&width=200&text=Sergio+Tiempo",
  },
  {
    id: "4",
    title: "Martha Argerich plays Beethoven & Ravel",
    artist: "JPO - Lalo Shifrin (CD)",
    format: "CD",
    imageUrl: "/placeholder.svg?height=200&width=200&text=Martha+Argerich",
  },
  {
    id: "5",
    title: "WUNDERHORN",
    artist: "Wunderhorn - Dietrich Henschel - Bochumer Symphoniker - Steven Sloane (2 CD)",
    format: "2 CD",
    imageUrl: "/placeholder.svg?height=200&width=200&text=Wunderhorn",
  },
  {
    id: "6",
    title: "Sonatas Op. 120 - Four Serious Songs Op. 121 - American Khazars",
    artist: "Eugenia Briseva (CD)",
    format: "CD",
    imageUrl: "/placeholder.svg?height=200&width=200&text=Sonatas+Op+120",
  },
  {
    id: "7",
    title: "Yendou vox with Martha Argerich",
    artist: "- Volume II (CD)",
    format: "CD",
    imageUrl: "/placeholder.svg?height=200&width=200&text=Yendou+Vol+2",
  },
  {
    id: "8",
    title: "PEACOCK",
    artist: "Peacock - D. L. Subramaniam - Roby Lakatos (CD)",
    format: "CD",
    imageUrl: "/placeholder.svg?height=200&width=200&text=Peacock",
  },
  {
    id: "9",
    title: "Ningen - Eugen Bocharnov",
    artist: "- (CD)",
    format: "CD",
    imageUrl: "/placeholder.svg?height=200&width=200&text=Ningen",
  },
  {
    id: "10",
    title: "Yendou vox with Martha Argerich",
    artist: "- Martha Argerich (CD3)",
    format: "CD3",
    imageUrl: "/placeholder.svg?height=200&width=200&text=Yendou+Vol+3",
  },
  {
    id: "11",
    title: "Tribute to Stephane & Django",
    artist: "Roby Lakatos & Biréli Lagrène (Hybrid SACD)",
    format: "Hybrid SACD",
    imageUrl: "/placeholder.svg?height=200&width=200&text=Tribute+to+Stephane",
  },
  {
    id: "12",
    title: "Legato - Sergio Tiempo (Hybrid SACD)",
    artist: "Sergio Tiempo (Hybrid SACD)",
    format: "Hybrid SACD",
    imageUrl: "/placeholder.svg?height=200&width=200&text=Legato",
  },
]

export default function ReleaseGrid() {
  return (
    <section className="py-8 md:py-12 lg:py-16">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {dummyReleases.map((release) => (
            <ReleaseCard key={release.id} release={release} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ReleaseCard({ release }: { release: Release }) {
  return (
    <Card className="group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-0">
        <Image
          src={release.imageUrl || "/placeholder.svg"}
          width={200}
          height={200}
          alt={release.title}
          className="w-full h-auto object-cover aspect-square"
        />
        <div className="p-3 text-center">
          <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5em]">{release.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5em]">{release.artist}</p>
          <p className="text-xs text-muted-foreground mt-1">{release.format}</p>
        </div>
      </CardContent>
    </Card>
  )
}
