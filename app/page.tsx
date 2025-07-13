import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

async function getFeaturedReleases() {
  try {
    // Use relative URL to avoid port issues
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_SITE_URL 
      : '';
    const res = await fetch(`${baseUrl}/api/releases?featured=true&limit=3`, {
      cache: 'no-store'
    })
    if (!res.ok) return { releases: [] }
    return await res.json()
  } catch (error) {
    console.error('Error fetching releases:', error)
    return { releases: [] }
  }
}

export default async function HomePage() {
  const { releases } = await getFeaturedReleases()
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
        <Image
          src="/images/carousel1.jpg"
          alt="Hero Background"
          fill
          className="object-cover z-0"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 drop-shadow-lg">
            Experience the Art of Sound
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl max-w-3xl mb-8 drop-shadow-md">
            Avanti Classic brings you timeless classical music with a contemporary vision.
          </p>
          <Button
            asChild
            className="px-8 py-3 text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Link href="/releases">Explore Releases</Link>
          </Button>
        </div>
      </section>

      {/* Featured Releases Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-gray-50">
            Featured Releases
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {releases.length > 0 ? (
              releases.map((release: any) => (
                <Card key={release.id} className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
                  <Image
                    src={release.imageUrl}
                    width={400}
                    height={400}
                    alt={release.title}
                    className="w-full h-auto object-cover aspect-square"
                  />
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-50">{release.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{release.artists}</p>
                    <Button
                      asChild
                      variant="outline"
                      className="mt-4 text-primary border-primary hover:bg-primary hover:text-primary-foreground dark:text-primary-foreground dark:border-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground bg-transparent"
                    >
                      <Link href={`/releases/${release.url || release.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              /* Fallback releases */
              <>
                <Card className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
                  <Image
                    src="/images/releases/1.jpeg"
                    width={400}
                    height={400}
                    alt="Fire Dance"
                    className="w-full h-auto object-cover aspect-square"
                  />
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-50">Fire Dance</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Roby Lakatos</p>
                    <Button
                      asChild
                      variant="outline"
                      className="mt-4 text-primary border-primary hover:bg-primary hover:text-primary-foreground dark:text-primary-foreground dark:border-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground bg-transparent"
                    >
                      <Link href="/releases/Fire-Dance-Roby-Lakatos">View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
                  <Image
                    src="/images/releases/2.jpeg"
                    width={400}
                    height={400}
                    alt="The Prokofiev Project"
                    className="w-full h-auto object-cover aspect-square"
                  />
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-50">The Prokofiev Project</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Polina Leschenko</p>
                    <Button
                      asChild
                      variant="outline"
                      className="mt-4 text-primary border-primary hover:bg-primary hover:text-primary-foreground dark:text-primary-foreground dark:border-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground bg-transparent"
                    >
                      <Link href="/releases/The-Prokofiev-Project-Polina-Leschenko">View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
                  <Image
                    src="/images/releases/5.jpeg"
                    width={400}
                    height={400}
                    alt="Klezmer Karma"
                    className="w-full h-auto object-cover aspect-square"
                  />
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-50">Klezmer Karma</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Roby Lakatos</p>
                    <Button
                      asChild
                      variant="outline"
                      className="mt-4 text-primary border-primary hover:bg-primary hover:text-primary-foreground dark:text-primary-foreground dark:border-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground bg-transparent"
                    >
                      <Link href="/releases/Klezmer-Karma-Roby-Lakatos">View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
          <div className="text-center mt-12">
            <Button
              asChild
              className="px-8 py-3 text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Link href="/releases">View All Releases</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-gray-50">About Avanti Classic</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            Avanti Classic and AvantiJazz were created with the aim of re-establishing a relationship between artist and
            record company that, in the current music industry, practically no longer exists. We are dedicated to
            supporting artists and delivering the highest quality recordings to music lovers worldwide.
          </p>
          <Button
            asChild
            variant="outline"
            className="px-8 py-3 text-lg text-primary border-primary hover:bg-primary hover:text-primary-foreground dark:text-primary-foreground dark:border-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground bg-transparent"
          >
            <Link href="/about">Learn More About Us</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
