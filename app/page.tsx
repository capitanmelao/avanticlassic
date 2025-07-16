import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HeroVideoSection } from "@/components/hero-video-section"
import { supabase } from "@/lib/supabase"

// Revalidate the page every 5 minutes to pick up featured release changes
export const revalidate = 300

async function getFeaturedReleases() {
  try {
    const { data: releases, error } = await supabase
      .from('releases')
      .select(`
        id,
        url,
        title,
        format,
        image_url,
        release_date,
        catalog_number,
        featured,
        shop_url,
        spotify_url,
        apple_music_url,
        release_artists(
          artist:artists(
            id,
            name
          )
        )
      `)
      .eq('featured', true)
      .order('sort_order', { ascending: false })
      .limit(3)

    if (error) {
      console.error('Error fetching featured releases:', error)
      return []
    }

    console.log('Featured releases found:', releases?.length || 0)
    if (releases?.length) {
      console.log('Featured releases:', releases.map(r => ({ id: r.id, title: r.title, featured: r.featured })))
    }

    return releases?.map(release => ({
      id: release.id.toString(),
      url: release.url,
      title: release.title,
      artists: release.release_artists?.map((ra: any) => ra.artist?.name).join(', ') || 'Various Artists',
      format: release.format || 'CD',
      imageUrl: `/images/releases/${release.id}.jpeg`,
      releaseDate: release.release_date,
      catalogNumber: release.catalog_number,
      shopUrl: release.shop_url,
      spotifyUrl: release.spotify_url,
      appleMusicUrl: release.apple_music_url
    })) || []
  } catch (error) {
    console.error('Error fetching featured releases:', error)
    return []
  }
}

export default async function HomePage() {
  const featuredReleases = await getFeaturedReleases()
  
  return (
    <div className="flex flex-col">
      <HeroVideoSection />

      {/* Featured Releases Section */}
      <section className="pt-8 md:pt-12 pb-16 md:pb-24 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-gray-50 font-playfair">
            Featured Releases
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredReleases.length > 0 ? (
              featuredReleases.map((release: any) => (
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
