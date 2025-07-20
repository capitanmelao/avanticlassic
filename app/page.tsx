import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HeroVideoSection } from "@/components/hero-video-section"
import { JsonLdScript } from "@/components/json-ld"
import { HomePageClient } from "@/components/home-page-client"
import { supabase } from "@/lib/supabase"
import { generateOrganizationSchema, generateWebsiteSchema, generateItemListSchema } from "@/lib/structured-data"

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
  
  // Generate structured data for the homepage
  const organizationSchema = generateOrganizationSchema()
  const websiteSchema = generateWebsiteSchema()
  const featuredReleasesSchema = generateItemListSchema({
    name: "Featured Classical Music Releases",
    description: "Curated selection of exceptional classical music releases from Avanti Classic",
    url: "/",
    items: featuredReleases.map(release => ({
      name: release.title,
      url: `/releases/${release.url || release.id}`,
      image: release.imageUrl,
      description: `${release.title} by ${release.artists}`
    }))
  })

  const schemas = [organizationSchema, websiteSchema, featuredReleasesSchema]
  
  return (
    <div className="flex flex-col">
      <JsonLdScript data={schemas} />
      <HeroVideoSection />
      <HomePageClient featuredReleases={featuredReleases} />
    </div>
  )
}
