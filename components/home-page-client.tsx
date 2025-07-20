"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { useTranslations } from "@/lib/translations"

interface Release {
  id: string
  url: string
  title: string
  artists: string
  format: string
  imageUrl: string
  releaseDate: string
  catalogNumber: string
  shopUrl: string
  spotifyUrl: string
  appleMusicUrl: string
}

interface HomePageClientProps {
  featuredReleases: Release[]
}

export function HomePageClient({ featuredReleases }: HomePageClientProps) {
  const { language } = useLanguage()
  const t = useTranslations(language)

  return (
    <>
      {/* Featured Releases Section */}
      <section className="pt-8 md:pt-12 pb-16 md:pb-24 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-gray-50 font-playfair">
            {t.home.featuredReleases}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredReleases.length > 0 ? (
              featuredReleases.map((release: Release) => (
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
                      <Link href={`/releases/${release.url || release.id}`}>{t.home.viewDetails}</Link>
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
                      <Link href="/releases/Fire-Dance-Roby-Lakatos">{t.home.viewDetails}</Link>
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
                      <Link href="/releases/The-Prokofiev-Project-Polina-Leschenko">{t.home.viewDetails}</Link>
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
                      <Link href="/releases/Klezmer-Karma-Roby-Lakatos">{t.home.viewDetails}</Link>
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
              <Link href="/releases">{t.home.viewAllReleases}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}