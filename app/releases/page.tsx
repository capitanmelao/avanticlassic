"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import SearchFilter from "@/components/shared/search-filter"
import PaginationControls from "@/components/shared/pagination-controls"

interface Release {
  id: string
  title: string
  artists: string
  format: string
  imageUrl: string
  description: string
  url?: string
}

async function getReleases() {
  try {
    // Use relative URL to avoid port issues
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_SITE_URL 
      : '';
    const res = await fetch(`${baseUrl}/api/releases?limit=24`, {
      cache: 'no-store'
    })
    if (!res.ok) return { releases: [] }
    return await res.json()
  } catch (error) {
    console.error('Error fetching releases:', error)
    return { releases: [] }
  }
}

const fallbackReleases: Release[] = [
  {
    id: "1",
    title: "Fire Dance",
    artists: "Roby Lakatos",
    format: "1 CD",
    imageUrl: "/images/releases/1.jpeg",
    url: "Fire-Dance-Roby-Lakatos",
    description: "Embark on a captivating musical journey with ROBY LAKATOS as he delves into the soul-stirring rhythms of Tango.",
  },
  {
    id: "2",
    title: "The Prokofiev Project",
    artists: "Polina Leschenko",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/2.jpeg",
    url: "The-Prokofiev-Project-Polina-Leschenko",
    description: "A mesmerizing collaboration featuring the legendary Martha Argerich.",
  },
  {
    id: "3",
    title: "Recital Schumann • Liszt",
    artists: "Pedro Burmester",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/3.jpeg",
    url: "Recital-Schumann-Liszt-Pedro-Burmester",
    description: "A deeply personal and virtuosic tribute to the great composers.",
  },
  {
    id: "4",
    title: "Schumann: the Violin Sonatas and Fantasiestücke",
    artists: "Dora Schwarzberg, Polina Leschenko",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/4.jpeg",
    url: "Schumann-the-Violin-Sonatas-and-Fantasiestücke-Dora-Schwarzberg-Polina-Leschenko",
    description: "Masterful interpretations of Schumann's chamber music masterpieces.",
  },
  {
    id: "5",
    title: "Klezmer Karma",
    artists: "Roby Lakatos",
    format: "1 CD",
    imageUrl: "/images/releases/5.jpeg",
    url: "Klezmer-Karma-Roby-Lakatos",
    description: "A captivating exploration of Klezmer music traditions.",
  },
  {
    id: "6",
    title: "Recital Franck • Debussy • Schumann",
    artists: "Dora Schwarzberg, Martha Argerich",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/6.jpeg",
    url: "Recital-Franck-Debussy-Schumann-Dora-Schwarzberg-Martha-Argerich",
    description: "Stunning chamber music collaborations with Martha Argerich.",
  },
  {
    id: "7",
    title: "Liszt Recital",
    artists: "Polina Leschenko",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/7.jpeg",
    url: "Liszt-Recital-Polina-Leschenko",
    description: "Virtuosic interpretations of Liszt's piano masterworks.",
  },
  {
    id: "8",
    title: "Recital",
    artists: "Adriel Gomez-Mansur",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/8.jpeg",
    url: "Recital-Adriel-Gomez-Mansur",
    description: "A vibrant collection of piano recital pieces.",
  },
  {
    id: "9",
    title: "La Belle Epoque",
    artists: "Sergio Tiempo, Karin Lechner",
    format: "1 Hybrid SACD + Bonus DVD",
    imageUrl: "/images/releases/9.jpeg",
    url: "La Belle Epoque-Sergio-Tiempo-Karin-Lechner",
    description: "A musical journey through the Belle Époque period.",
  },
  {
    id: "10",
    title: "Roby Lakatos with Musical Friends",
    artists: "Roby Lakatos",
    format: "1 CD + 1 Bonus CD",
    imageUrl: "/images/releases/10.jpeg",
    url: "Roby-Lakatos-with-Musical-Friends-Roby-Lakatos",
    description: "Extraordinary collaborations with world-class musicians.",
  },
  {
    id: "11",
    title: "Anthology of a Yiddishe Mama",
    artists: "Myriam Fuks",
    format: "1 CD",
    imageUrl: "/images/releases/11.jpeg",
    url: "Anthology-of-a-Yiddishe-Mama-Myriam-Fuks",
    description: "A heartfelt tribute to Yiddish musical traditions.",
  },
  {
    id: "12",
    title: "Goldberg Variations",
    artists: "Alexander Gurning",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/12.jpeg",
    url: "Goldberg-Variations-Alexander-Gurning",
    description: "Bach's Goldberg Variations in masterful interpretation.",
  },
  {
    id: "13",
    title: "Liszt Totentanz • Tchaikovsky Piano Concerto",
    artists: "Sergio Tiempo",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/13.jpeg",
    url: "Liszt-Totentanz-Tchaikovsky-Piano-Concerto-Sergio-Tiempo",
    description: "Powerful interpretations of Romantic piano concertos.",
  },
  {
    id: "14",
    title: "Tango Rhapsody",
    artists: "Sergio Tiempo, Karin Lechner",
    format: "1 Hybrid SACD + Bonus DVD",
    imageUrl: "/images/releases/14.jpeg",
    url: "Tango-Rhapsody-Sergio-Tiempo-Karin-Lechner",
    description: "A passionate exploration of tango rhythms and melodies.",
  },
  {
    id: "15",
    title: "Forgotten Melodies",
    artists: "Polina Leschenko",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/15.jpeg",
    url: "Forgotten-Melodies-Polina-Leschenko",
    description: "Rediscovering lesser-known piano masterpieces.",
  },
  {
    id: "16",
    title: "Bruch & Mendelssohn Violin Concertos • Beethoven Romances",
    artists: "Philippe Quint",
    format: "1 Hybrid SACD + Bonus DVD",
    imageUrl: "/images/releases/16.jpeg",
    url: "Bruch&Mendelssohn-Violin-Concertos-Beethoven-Romances-Philippe-Quint",
    description: "Classic violin concertos in brilliant performances.",
  },
  {
    id: "17",
    title: "Recital Haendel • Brahms • Bach • Liszt",
    artists: "Francesco Piemontesi",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/17.jpeg",
    url: "Recital-Haendel-Brahms-Bach-Liszt-Francesco-Piemontesi",
    description: "A masterful journey through Baroque and Romantic piano literature.",
  },
  {
    id: "18",
    title: "La Passion",
    artists: "Roby Lakatos",
    format: "2 CD",
    imageUrl: "/images/releases/18.jpeg",
    url: "La Passion-Roby-Lakatos",
    description: "An emotional double album showcasing Lakatos's passionate artistry.",
  },
  {
    id: "19",
    title: "Opera Breve",
    artists: "Philippe Quint, Lily Maisky",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/19.jpeg",
    url: "Opera-Breve-Philippe-Quint-Lily-Maisky",
    description: "Opera transcriptions for violin and piano.",
  },
  {
    id: "20",
    title: "Ver Bin Ikh!",
    artists: "Myriam Fuks",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/20.jpeg",
    url: "Ver-Bin-Ikh!-Myriam-Fuks",
    description: "A deeply personal exploration of identity through music.",
  },
  {
    id: "21",
    title: "Tchaikovsky Violin Concerto • Arensky Quintet",
    artists: "Philippe Quint",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/21.jpeg",
    url: "Tchaikovsky-Violin-Concerto-Arensky-Quintet-Philippe-Quint",
    description: "Masterful performances of Russian chamber and concerto music.",
  },
  {
    id: "22",
    title: "The Four Seasons",
    artists: "Roby Lakatos",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/22.jpeg",
    url: "The-Four-Seasons-Roby-Lakatos",
    description: "Vivaldi's Four Seasons with contemporary interpretations.",
  },
  {
    id: "23",
    title: "Bach XXI",
    artists: "Matt Herskovitz Trio, Philippe Quint",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/23.jpeg",
    url: "Bach-XXI-Matt-Herskovitz-Trio-Philippe-Quint",
    description: "Bach's timeless music in contemporary arrangements.",
  },
  {
    id: "24",
    title: "Khachaturian & Glazunov Violin Concertos",
    artists: "Philippe Quint",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/24.jpeg",
    url: "Khachaturian&Glazunov-Violin-Concertos-Philippe-Quint",
    description: "Brilliant performances of 20th-century violin concertos.",
  },
  {
    id: "25",
    title: "Homilia",
    artists: "Manu Comté, B'Strings Quintet",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/25.jpeg",
    url: "Homilia-Manu-Comté-B'Strings-Quintet",
    description: "Contemporary tango compositions featuring bandoneon and strings.",
  },
  {
    id: "26",
    title: "Legacy",
    artists: "Sergio Tiempo",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/26.jpeg",
    url: "Legacy-Sergio-Tiempo",
    description: "A comprehensive collection spanning classical to contemporary repertoire.",
  },
  {
    id: "27",
    title: "Tribute to Stephane & Django",
    artists: "Roby Lakatos, Bireli Lagrene",
    format: "1 Hybrid SACD",
    imageUrl: "/images/releases/27.jpeg",
    url: "Tribute-to-Stephane&Django-Roby-Lakatos&Bireli-Lagrene",
    description: "A masterful tribute to the legendary gypsy jazz duo.",
  },
  {
    id: "28",
    title: "Rendez-vous with Martha Argerich",
    artists: "Martha Argerich",
    format: "7CD",
    imageUrl: "/images/releases/28.jpeg",
    url: "Rendez-vous-with-Martha-Argerich-Martha-Argerich",
    description: "An extraordinary 7-CD collection of collaborations with Martha Argerich.",
  },
  {
    id: "29",
    title: "Morgen",
    artists: "Evgeni Bozhanov",
    format: "1 CD",
    imageUrl: "/images/releases/29.jpeg",
    url: "Morgen-Evgeni-Bozhanov",
    description: "Sublime interpretations of Schubert and Brahms.",
  },
  {
    id: "30",
    title: "Peacock",
    artists: "Dr L. Subramaniam, Roby Lakatos",
    format: "1 CD",
    imageUrl: "/images/releases/30.jpeg",
    url: "Peacock-Dr-L.-Subramaniam-Roby-Lakatos",
    description: "An East-meets-West fusion of Indian classical and gypsy violin.",
  },
  {
    id: "31",
    title: "Rendez-vous with Martha Argerich - Volume 2",
    artists: "Martha Argerich",
    format: "6 CD",
    imageUrl: "/images/releases/31.jpeg",
    url: "Rendez-vous-with-Martha-Argerich-Volume-2",
    description: "The second volume of chamber music collaborations.",
  },
  {
    id: "32",
    title: "Sonatas Op. 120 - Four Serious Songs Op. 121",
    artists: "Alexander Kniazev, Kasparas Uinskas",
    format: "1 CD",
    imageUrl: "/images/releases/32.jpeg",
    url: "Sonatas-Op.-120-Four-Serious-Songs-Op.-121-Alexander-Kniazev-Kasparas-Uinskas",
    description: "Late Brahms masterworks for cello and piano.",
  },
  {
    id: "33",
    title: "Wunderhorn",
    artists: "Dietrich Henschel, Bochumer Symphoniker, Steven Sloane",
    format: "2 CD",
    imageUrl: "/images/releases/33.jpeg",
    url: "Wunderhorn-Dietrich-Henschel-Bochumer-Symphoniker-Steven-Sloane",
    description: "Mahler's complete Des Knaben Wunderhorn song cycle.",
  },
  {
    id: "34",
    title: "Martha Argerich plays Beethoven & Ravel",
    artists: "Martha Argerich",
    format: "1 CD",
    imageUrl: "/images/releases/34.jpeg",
    url: "Martha-Argerich-plays-Beethoven&Ravel-IPO-Lahav-Shani",
    description: "Iconic piano concertos with the Israel Philharmonic Orchestra.",
  },
  {
    id: "35",
    title: "HOMMAGE",
    artists: "Sergio Tiempo",
    format: "1 CD",
    imageUrl: "/images/releases/35.jpeg",
    url: "HOMMAGE-Sergio-Tiempo",
    description: "A heartfelt tribute featuring collaborations with great artists.",
  },
  {
    id: "36",
    title: "Rendez-vous with Martha Argerich - Volume 3",
    artists: "Martha Argerich",
    format: "7 CD",
    imageUrl: "/images/releases/36.jpeg",
    url: "Rendez-vous-with-Martha-Argerich-Volume-3",
    description: "The third comprehensive volume of chamber music collaborations.",
  },
  {
    id: "37",
    title: "World Tangos Odyssey",
    artists: "Roby Lakatos",
    format: "1 CD",
    imageUrl: "/images/releases/37.jpeg",
    url: "WORLD-TANGOS-ODYSSEY",
    description: "A global journey through tango traditions from around the world.",
  }
]

export default function ReleasesPage() {
  const [releases, setReleases] = useState<Release[]>([])
  const [filteredReleases, setFilteredReleases] = useState<Release[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedArtist, setSelectedArtist] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  
  const releasesPerPage = 12
  const totalPages = Math.ceil(filteredReleases.length / releasesPerPage)
  const startIndex = (currentPage - 1) * releasesPerPage
  const endIndex = startIndex + releasesPerPage
  const currentReleases = filteredReleases.slice(startIndex, endIndex)

  const filterOptions = [
    { value: "all", label: "All Artists" },
    { value: "Martha Argerich", label: "Martha Argerich" },
    { value: "Roby Lakatos", label: "Roby Lakatos" },
    { value: "Polina Leschenko", label: "Polina Leschenko" },
    { value: "Sergio Tiempo", label: "Sergio Tiempo" },
    { value: "Philippe Quint", label: "Philippe Quint" },
    { value: "Pedro Burmester", label: "Pedro Burmester" },
    { value: "Dora Schwarzberg", label: "Dora Schwarzberg" },
    { value: "Alexander Gurning", label: "Alexander Gurning" },
    { value: "Myriam Fuks", label: "Myriam Fuks" },
    { value: "Dietrich Henschel", label: "Dietrich Henschel" },
  ]

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const { releases: apiReleases } = await getReleases()
        const releasesToUse = apiReleases.length > 0 ? apiReleases : fallbackReleases
        setReleases(releasesToUse)
        setFilteredReleases(releasesToUse)
      } catch (error) {
        console.error('Error fetching releases:', error)
        setReleases(fallbackReleases)
        setFilteredReleases(fallbackReleases)
      } finally {
        setLoading(false)
      }
    }

    fetchReleases()
  }, [])

  useEffect(() => {
    let filtered = releases

    // Filter by artist
    if (selectedArtist && selectedArtist !== "all") {
      filtered = filtered.filter(release =>
        release.artists.toLowerCase().includes(selectedArtist.toLowerCase())
      )
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(release =>
        release.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        release.artists.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredReleases(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [releases, selectedArtist, searchTerm])

  const handleSearchChange = (search: string) => {
    setSearchTerm(search)
  }

  const handleFilterChange = (filter: string) => {
    setSelectedArtist(filter)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">Our Releases</h1>
        <div className="text-center py-8">Loading releases...</div>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-12 md:py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-900 dark:text-gray-50">Our Releases</h1>
      <SearchFilter
        searchPlaceholder="Search releases..."
        filterOptions={filterOptions}
        filterPlaceholder="Filter by Artist"
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        searchValue={searchTerm}
        filterValue={selectedArtist}
      />
      <section className="py-8">
        {currentReleases.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {currentReleases.map((release) => (
              <ReleaseCard key={release.id} release={release} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            No releases found matching your search criteria.
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

function ReleaseCard({ release }: { release: Release }) {
  return (
    <Link href={`/releases/${release.url || release.id}`} className="block">
      <Card className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 cursor-pointer hover:scale-105">
        <CardContent className="p-0">
          <Image
            src={release.imageUrl || "/placeholder.svg"}
            width={200}
            height={200}
            alt={release.title}
            className="w-full h-auto object-cover aspect-square"
          />
          <div className="p-3 text-center">
            <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5em] text-gray-900 dark:text-gray-50 group-hover:text-primary transition-colors">
              {release.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5em]">{release.artists}</p>
            <p className="text-xs text-muted-foreground mt-1">{release.format}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
