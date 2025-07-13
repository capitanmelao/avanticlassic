import Link from "next/link"
import { Button } from "@/components/ui/button"
import CategoryNavigation from "@/components/playlists/category-navigation"
import PlaylistSection from "@/components/playlists/playlist-section"
import ComposerSection from "@/components/playlists/composer-section" // New import
import ForEveryoneSection from "@/components/playlists/for-everyone-section" // New import

// Dummy data for playlists (existing)
const newReleasesPlaylists = [
  {
    id: "nr1",
    title: "OH MUSIC: NEW RELEASES",
    imageUrl: "/placeholder.svg?height=300&width=300&text=New+Releases+1",
  },
  {
    id: "nr2",
    title: "ALPHA: NEW RELEASES",
    imageUrl: "/placeholder.svg?height=300&width=300&text=New+Releases+2",
  },
  {
    id: "nr3",
    title: "LINN: NEW RELEASES",
    imageUrl: "/placeholder.svg?height=300&width=300&text=New+Releases+3",
  },
]

const createdForYouPlaylists = [
  {
    id: "cfy1",
    title: "ZEN INSPIRATION",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Zen+Inspiration",
  },
  {
    id: "cfy2",
    title: "QUIET WITH AVANTI",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Quiet+With+Avanti",
  },
  {
    id: "cfy3",
    title: "SWEET HOME OFFICE",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Sweet+Home+Office",
  },
  {
    id: "cfy4",
    title: "EPIC ORCHESTRAL",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Epic+Orchestral",
  },
  {
    id: "cfy5",
    title: "SOUNDS OF SPAIN",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Sounds+of+Spain",
  },
  {
    id: "cfy6",
    title: "PIANO DAY",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Piano+Day",
  },
  {
    id: "cfy7",
    title: "SPLENDEURS DE VERSAILLES",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Versailles",
  },
]

// New dummy data for composers
const dummyComposers = [
  {
    id: "beethoven",
    name: "Ludwig van Beethoven",
    description:
      "A German composer and pianist whose music ranks among the most performed of the classical music repertoire. He remains one of the most admired composers in the history of Western music.",
    imageUrl: "/placeholder.svg?height=150&width=150&text=Beethoven",
    spotifyLink: "https://open.spotify.com/artist/2wOqMjp9TyABvtHdOSFGHI",
    appleMusicLink: "https://music.apple.com/us/artist/ludwig-van-beethoven/146000",
  },
  {
    id: "mozart",
    name: "Wolfgang Amadeus Mozart",
    description:
      "A prolific and influential composer of the Classical period. Mozart's works are among the most enduringly popular of the classical repertoire, and he is one of the greatest composers of all time.",
    imageUrl: "/placeholder.svg?height=150&width=150&text=Mozart",
    spotifyLink: "https://open.spotify.com/artist/4NJhFmfXMNi0GASFX0mSjY",
    appleMusicLink: "https://music.apple.com/us/artist/wolfgang-amadeus-mozart/146001",
  },
  {
    id: "chopin",
    name: "Frédéric Chopin",
    description:
      "A Polish composer and virtuoso pianist of the Romantic era, who wrote primarily for the solo piano. He is widely regarded as one of the greatest masters of Romantic music.",
    imageUrl: "/placeholder.svg?height=150&width=150&text=Chopin",
    spotifyLink: "https://open.spotify.com/artist/7y97mc3bZRFXzT2szRM4L4",
    appleMusicLink: "https://music.apple.com/us/artist/fr%C3%A9d%C3%A9ric-chopin/146002",
  },
  {
    id: "schubert",
    name: "Franz Schubert",
    description:
      "An Austrian composer of the late Classical and early Romantic eras. Despite his short life, Schubert left behind a vast oeuvre of over 600 secular vocal works, seven complete symphonies, sacred music, operas, and a large body of chamber and piano music.",
    imageUrl: "/placeholder.svg?height=150&width=150&text=Schubert",
    spotifyLink: "https://open.spotify.com/artist/2pIpQjfoFOkYyxdSFzGMMk",
    appleMusicLink: "https://music.apple.com/us/artist/franz-schubert/146003",
  },
]

// New dummy data for "For Everyone" curated selection
const forEveryonePlaylists = [
  {
    id: "fe1",
    title: "CLASSICAL FOCUS",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Classical+Focus",
  },
  {
    id: "fe2",
    title: "MORNING CLASSICS",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Morning+Classics",
  },
  {
    id: "fe3",
    title: "EVENING RELAXATION",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Evening+Relaxation",
  },
  {
    id: "fe4",
    title: "WORKOUT CLASSICS",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Workout+Classics",
  },
  {
    id: "fe5",
    title: "TRAVEL SOUNDTRACK",
    imageUrl: "/placeholder.svg?height=300&width=300&text=Travel+Soundtrack",
  },
]

export default function PlaylistsPage() {
  const categories = [
    { name: "NEW RELEASES", href: "#new-releases" },
    { name: "FOR EVERYONE", href: "#for-everyone" }, // Updated category
    { name: "COMPOSERS", href: "#composers" }, // New category
    { name: "MOODS", href: "#created-for-you" },
    { name: "THEMES", href: "#created-for-you" },
    { name: "KIDS", href: "#created-for-you" },
    { name: "SEASONAL", href: "#created-for-you" },
  ]

  const createdForYouFilters = [
    { value: "moods", label: "MOODS" },
    { value: "themes", label: "THEMES" },
    { value: "kids", label: "KIDS" },
    { value: "seasonal", label: "SEASONAL" },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section for Playlists */}
      <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 text-center relative overflow-hidden">
        {/* Decorative lines - purely visual, not functional */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <svg className="absolute top-1/4 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M0,70 C30,100 70,0 100,30"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
              opacity="0.2"
            />
          </svg>
          <svg className="absolute bottom-0 right-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M0,30 C30,0 70,100 100,70"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
              opacity="0.2"
            />
          </svg>
        </div>
        <div className="container px-4 md:px-6 relative z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-gray-900 dark:text-gray-50">
            OUR PLAYLISTS,
            <br />
            YOUR MOMENT
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto text-gray-700 dark:text-gray-300 leading-relaxed">
            Thousands of artists, works and instruments ready to accompany you, wherever you go.
          </p>
          <Button
            asChild
            className="mt-10 px-8 py-3 text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Link href="#explore-playlists">Explore Playlists</Link>
          </Button>
        </div>
      </section>

      {/* Category Navigation */}
      <CategoryNavigation categories={categories} />

      {/* New Releases Section */}
      <PlaylistSection id="new-releases" title="NEW RELEASES" playlists={newReleasesPlaylists} />

      {/* For Everyone Section */}
      <ForEveryoneSection id="for-everyone" title="FOR EVERYONE" playlists={forEveryonePlaylists} />

      {/* Composers Section */}
      <section id="composers" className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-12">COMPOSERS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {dummyComposers.map((composer) => (
              <ComposerSection key={composer.id} composer={composer} />
            ))}
          </div>
        </div>
      </section>

      {/* Playlists Created Just For You Section (retained for other filters) */}
      <PlaylistSection
        id="created-for-you"
        title="PLAYLISTS CREATED JUST FOR YOU"
        playlists={createdForYouPlaylists}
        filters={createdForYouFilters}
        filterType="vertical"
        viewAllLink="#"
      />
    </div>
  )
}
