"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import SearchFilter from "@/components/shared/search-filter"
import PaginationControls from "@/components/shared/pagination-controls"

interface Artist {
  id: string
  name: string
  instrument: string
  imageUrl: string
  bio: string
  url?: string
  facebook?: string
  instagram?: string
  twitter?: string
  youtube?: string
  website?: string
}

async function getArtists() {
  try {
    // Use relative URL to avoid port issues
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_SITE_URL 
      : '';
    const res = await fetch(`${baseUrl}/api/artists?limit=24`, {
      cache: 'no-store'
    })
    if (!res.ok) return { artists: [] }
    return await res.json()
  } catch (error) {
    console.error('Error fetching artists:', error)
    return { artists: [] }
  }
}

const fallbackArtists: Artist[] = [
  {
    id: "1",
    name: "Martha Argerich",
    instrument: "Piano",
    imageUrl: "/images/artists/1-800.jpeg",
    url: "Martha-Argerich",
    bio: "Martha Argerich is an Argentine classical concert pianist. She is widely considered one of the greatest pianists of all time. Her repertoire is vast, ranging from Bach and Mozart to Chopin, Liszt, Ravel, and Prokofiev. Known for her fiery temperament and dazzling technique, she has captivated audiences worldwide for decades.",
    facebook: "https://www.facebook.com/groups/107946371992/"
  },
  {
    id: "2",
    name: "Evgeni Bozhanov",
    instrument: "Piano",
    imageUrl: "/images/artists/2-800.jpeg",
    url: "Evgeni-Bozhanov",
    bio: "Evgeni Bozhanov is a Bulgarian classical pianist known for his profound musical sensitivity and technical excellence. His interpretations combine intellectual depth with emotional intensity, making him one of the most compelling pianists of his generation.",
    facebook: "https://www.facebook.com/Evgeni-Bozhanov-Pianist-1744307882540703/"
  },
  {
    id: "3",
    name: "Pedro Burmester",
    instrument: "Piano",
    imageUrl: "/images/artists/3-800.jpeg",
    url: "Pedro-Burmester",
    bio: "Pedro Burmester is a Portuguese classical pianist renowned for his poetic interpretations and refined technique. He has performed with major orchestras worldwide and is particularly acclaimed for his interpretations of Romantic and contemporary repertoire.",
    facebook: "https://www.facebook.com/pedroburmester1/"
  },
  {
    id: "4",
    name: "Manu Comté",
    instrument: "Bandoneon",
    imageUrl: "/images/artists/4-800.jpeg",
    url: "Manu-Comté",
    bio: "Manu Comté is a French bandoneon player who brings contemporary innovation to traditional tango music. His collaborations span classical, jazz, and world music, creating a unique sound that bridges cultures and genres.",
    facebook: "https://www.facebook.com/manu.comte"
  },
  {
    id: "5",
    name: "Myriam Fuks",
    instrument: "Vocals",
    imageUrl: "/images/artists/5-800.jpeg",
    url: "Myriam-Fuks",
    bio: "Myriam Fuks is a celebrated vocalist specializing in Yiddish and Jewish traditional music. Her passionate performances preserve and celebrate cultural heritage while bringing these timeless songs to new audiences worldwide.",
    facebook: "https://www.facebook.com/Myriam-Fuks-344297292180"
  },
  {
    id: "6",
    name: "Adriel Gomez-Mansur",
    instrument: "Piano",
    imageUrl: "/images/artists/6-800.jpeg",
    url: "Adriel-Gomez-Mansur",
    bio: "Adriel Gomez-Mansur is a rising star in the classical piano world, known for his sensitive interpretations and remarkable technical abilities. His performances showcase a mature musical understanding beyond his years.",
    facebook: "https://www.facebook.com/Adriel-Gomez-Mansur-365569273133"
  },
  {
    id: "7",
    name: "Alexander Gurning",
    instrument: "Piano",
    imageUrl: "/images/artists/7-800.jpeg",
    url: "Alexander-Gurning",
    bio: "Alexander Gurning is an Indonesian-Belgian classical pianist, recognized for his powerful and nuanced playing. He has won numerous international competitions and performs regularly as a soloist and chamber musician. Gurning's repertoire spans from Baroque to contemporary works.",
    facebook: "https://www.facebook.com/agurning"
  },
  {
    id: "8",
    name: "Dietrich Henschel",
    instrument: "Baritone",
    imageUrl: "/images/artists/8-800.jpeg",
    url: "Baritone-Dietrich-Henschel",
    bio: "Dietrich Henschel is a German baritone, renowned for his versatility across opera, oratorio, and Lieder. He is particularly acclaimed for his interpretations of contemporary works and his compelling stage presence. Henschel has appeared at leading opera houses and concert halls worldwide."
  },
  {
    id: "9",
    name: "Alexander Kniazev",
    instrument: "Cello",
    imageUrl: "/images/artists/9-800.jpeg",
    url: "Alexander-Kniazev",
    bio: "Alexander Kniazev is a Russian cellist of exceptional artistry, known for his profound musical interpretations and technical mastery. He performs regularly with leading orchestras and in chamber music collaborations worldwide.",
    facebook: "https://www.facebook.com/alexander.knyazev.125"
  },
  {
    id: "10",
    name: "Roby Lakatos",
    instrument: "Violin",
    imageUrl: "/images/artists/10-800.jpeg",
    url: "Roby-Lakatos",
    bio: "Roby Lakatos is a Hungarian Romani violinist, known for his unique blend of classical, jazz, and traditional Romani music. He is often referred to as 'the Devil's violinist' due to his extraordinary virtuosity and improvisational skills. Lakatos has performed with many of the world's leading orchestras and musicians.",
    facebook: "https://www.facebook.com/roby.lakatos.9"
  },
  {
    id: "11",
    name: "Karin Lechner",
    instrument: "Piano",
    imageUrl: "/images/artists/11-800.jpeg",
    url: "Karin-Lechner",
    bio: "Karin Lechner is an accomplished pianist known for her collaborative work in chamber music and piano duos. Her musical partnerships have produced some of the most compelling two-piano recordings in recent years.",
    facebook: "https://www.facebook.com/karin.lechner.161"
  },
  {
    id: "12",
    name: "Polina Leschenko",
    instrument: "Piano",
    imageUrl: "/images/artists/12-800.jpeg",
    url: "Polina-Leschenko",
    bio: "Polina Leschenko is a rising star in the classical piano world, known for her sensitive and insightful performances. She has garnered critical acclaim for her interpretations of Romantic and 20th-century repertoire, performing in major concert venues across Europe and North America.",
    facebook: "https://www.facebook.com/Polina-Leschenko-340738827483/"
  },
  {
    id: "13",
    name: "Lily Maisky",
    instrument: "Piano",
    imageUrl: "/images/artists/13-800.jpeg",
    url: "Lily-Maisky",
    bio: "Lily Maisky is a talented pianist who has made her mark in both solo and chamber music performances. Her musical collaborations showcase a deep understanding of ensemble playing and musical dialogue.",
    facebook: "https://www.facebook.com/lilymaisky/"
  },
  {
    id: "14",
    name: "Francesco Piemontesi",
    instrument: "Piano",
    imageUrl: "/images/artists/14-800.jpeg",
    url: "Francesco-Piemontesi",
    bio: "Francesco Piemontesi is a Swiss classical pianist acclaimed for his refined technique and thoughtful interpretations. He is particularly renowned for his performances of Mozart, Beethoven, and Romantic repertoire.",
    facebook: "https://www.facebook.com/PiemontesiFrancesco/"
  },
  {
    id: "15",
    name: "Philippe Quint",
    instrument: "Violin",
    imageUrl: "/images/artists/15-800.jpeg",
    url: "Philippe-Quint",
    bio: "Philippe Quint is an American classical violinist, praised for his passionate and charismatic performances. He is a Grammy-nominated artist who has performed with many of the world's leading orchestras and conductors. Quint is also known for his innovative programming and commitment to new music.",
    facebook: "https://www.facebook.com/philippequint/"
  },
  {
    id: "16",
    name: "Dora Schwarzberg",
    instrument: "Violin",
    imageUrl: "/images/artists/16-800.jpeg",
    url: "Dora-Schwarzberg",
    bio: "Dora Schwarzberg is a distinguished violinist known for her expressive playing and chamber music collaborations. Her performances demonstrate both technical excellence and deep musical understanding.",
    facebook: "https://www.facebook.com/Dora-Schwarzberg-337188444982/"
  },
  {
    id: "17",
    name: "Steven Sloane",
    instrument: "Conductor",
    imageUrl: "/images/artists/17-800.jpeg",
    url: "Steven-Sloane",
    bio: "Steven Sloane is an accomplished conductor known for his work with leading orchestras worldwide. His interpretations bring fresh insights to both classical and contemporary repertoire."
  },
  {
    id: "18",
    name: "Sergio Tiempo",
    instrument: "Piano",
    imageUrl: "/images/artists/18-800.jpeg",
    url: "Sergio-Tiempo",
    bio: "Sergio Tiempo is an Argentine classical pianist, celebrated for his passionate and poetic interpretations. A protégé of Martha Argerich, he has established himself as a formidable artist on the international stage, performing with major orchestras and in prestigious recital series.",
    facebook: "https://www.facebook.com/sergio.tiempo/"
  },
  {
    id: "19",
    name: "Kasparas Uinskas",
    instrument: "Piano",
    imageUrl: "/images/artists/19-800.jpeg",
    url: "Kasparas-Uinskas",
    bio: "Kasparas Uinskas is a talented pianist known for his chamber music collaborations and solo performances. His musical sensitivity and technical skills make him a sought-after collaborator.",
    facebook: "https://www.facebook.com/kasparas.uinskas"
  }
]

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInstrument, setSelectedInstrument] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  
  const artistsPerPage = 12
  const totalPages = Math.ceil(filteredArtists.length / artistsPerPage)
  const startIndex = (currentPage - 1) * artistsPerPage
  const endIndex = startIndex + artistsPerPage
  const currentArtists = filteredArtists.slice(startIndex, endIndex)

  const filterOptions = [
    { value: "all", label: "All Instruments" },
    { value: "piano", label: "Piano" },
    { value: "violin", label: "Violin" },
    { value: "baritone", label: "Baritone" },
    { value: "cello", label: "Cello" },
    { value: "bandoneon", label: "Bandoneon" },
    { value: "vocals", label: "Vocals" },
    { value: "conductor", label: "Conductor" },
  ]

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const { artists: apiArtists } = await getArtists()
        const artistsToUse = apiArtists.length > 0 ? apiArtists : fallbackArtists
        setArtists(artistsToUse)
        setFilteredArtists(artistsToUse)
      } catch (error) {
        console.error('Error fetching artists:', error)
        setArtists(fallbackArtists)
        setFilteredArtists(fallbackArtists)
      } finally {
        setLoading(false)
      }
    }

    fetchArtists()
  }, [])

  useEffect(() => {
    let filtered = artists

    // Filter by instrument
    if (selectedInstrument && selectedInstrument !== "all") {
      filtered = filtered.filter(artist =>
        artist.instrument.toLowerCase().includes(selectedInstrument.toLowerCase())
      )
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(artist =>
        artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.instrument.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredArtists(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [artists, selectedInstrument, searchTerm])

  const handleSearchChange = (search: string) => {
    setSearchTerm(search)
  }

  const handleFilterChange = (filter: string) => {
    setSelectedInstrument(filter)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">Our Artists</h1>
        <div className="text-center py-8">Loading artists...</div>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-12 md:py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">Our Artists</h1>
      <SearchFilter
        searchPlaceholder="Search artists..."
        filterOptions={filterOptions}
        filterPlaceholder="Filter by Instrument"
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        searchValue={searchTerm}
        filterValue={selectedInstrument}
      />
      <section className="py-8">
        {currentArtists.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {currentArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            No artists found matching your search criteria.
          </div>
        )}
      </section>
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <Link href={`/artists/${artist.url || artist.id}`} className="block">
      <Card className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
        <CardContent className="p-0">
          <Image
            src={artist.imageUrl || "/placeholder.svg"}
            width={200}
            height={200}
            alt={artist.name}
            className="w-full h-auto object-cover aspect-square"
          />
          <div className="p-3 text-center">
            <h3 className="font-semibold text-base line-clamp-1 text-gray-900 dark:text-gray-50">{artist.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1">{artist.instrument}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
