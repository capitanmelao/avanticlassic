import type { Metadata } from "next"

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  noIndex?: boolean
  canonical?: string
  type?: "website" | "article" | "music.song" | "music.album" | "profile"
}

const baseUrl = "https://avanticlassic.vercel.app"

export function generateMetadata({
  title,
  description,
  keywords = [],
  image,
  noIndex = false,
  canonical,
  type = "website"
}: SEOProps = {}): Metadata {
  const metaTitle = title ? `${title} | Avanti Classic` : "Avanti Classic - Modern Classical Music Label"
  const metaDescription = description || "Discover exceptional classical music from Avanti Classic. Explore world-renowned artists, premium releases, curated playlists, and immersive video performances."
  const metaImage = image || "/images/og-image.jpg"
  const fullImageUrl = metaImage.startsWith("http") ? metaImage : `${baseUrl}${metaImage}`

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [
      "classical music",
      "classical music label", 
      "avanti classic",
      ...keywords
    ],
    alternates: {
      canonical: canonical ? `${baseUrl}${canonical}` : undefined,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonical ? `${baseUrl}${canonical}` : baseUrl,
      siteName: "Avanti Classic",
      type,
      locale: "en_US",
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title || "Avanti Classic - Classical Music Label",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [fullImageUrl],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

// Helper function to generate artist metadata
export function generateArtistMetadata(artist: {
  name: string
  bio?: string
  image?: string
  instrument?: string
}) {
  const title = `${artist.name} - Classical Musician`
  const description = artist.bio 
    ? `${artist.bio.slice(0, 150)}...` 
    : `Discover ${artist.name}, talented ${artist.instrument || 'classical musician'} featured on Avanti Classic. Explore recordings, performances, and musical excellence.`
  
  return generateMetadata({
    title,
    description,
    keywords: [
      artist.name.toLowerCase(),
      "classical musician",
      artist.instrument?.toLowerCase() || "",
      "classical artist",
      "classical performer"
    ].filter(Boolean),
    image: artist.image,
    canonical: `/artists/${encodeURIComponent(artist.name.toLowerCase().replace(/\s+/g, '-'))}`,
    type: "profile"
  })
}

// Helper function to generate release metadata
export function generateReleaseMetadata(release: {
  title: string
  artist?: string
  description?: string
  image?: string
  format?: string
  releaseDate?: string
}) {
  const title = `${release.title}${release.artist ? ` - ${release.artist}` : ''}`
  const description = release.description 
    ? `${release.description.slice(0, 150)}...`
    : `Listen to ${release.title}${release.artist ? ` by ${release.artist}` : ''} on Avanti Classic. High-quality ${release.format || 'classical'} recording featuring exceptional musical performances.`
  
  return generateMetadata({
    title,
    description,
    keywords: [
      release.title.toLowerCase(),
      release.artist?.toLowerCase() || "",
      "classical album",
      "classical recording",
      release.format?.toLowerCase() || "",
      "classical music release"
    ].filter(Boolean),
    image: release.image,
    canonical: `/releases/${encodeURIComponent(release.title.toLowerCase().replace(/\s+/g, '-'))}`,
    type: "music.album"
  })
}

// Helper function to generate playlist metadata
export function generatePlaylistMetadata(playlist: {
  title: string
  description?: string
  category?: string
  trackCount?: number
  image?: string
}) {
  const title = `${playlist.title} - Classical Music Playlist`
  const description = playlist.description 
    ? `${playlist.description.slice(0, 150)}...`
    : `Discover ${playlist.title}, a curated classical music playlist${playlist.trackCount ? ` featuring ${playlist.trackCount} tracks` : ''} from Avanti Classic. Perfect for classical music enthusiasts.`
  
  return generateMetadata({
    title,
    description,
    keywords: [
      playlist.title.toLowerCase(),
      "classical playlist",
      "classical music collection",
      playlist.category?.replace('by_', '').replace('_', ' ') || "",
      "curated classical music"
    ].filter(Boolean),
    image: playlist.image,
    canonical: `/playlists/${encodeURIComponent(playlist.title.toLowerCase().replace(/\s+/g, '-'))}`,
    type: "website"
  })
}

// Helper function to generate shop product metadata
export function generateProductMetadata(product: {
  title: string
  description?: string
  price?: number
  currency?: string
  image?: string
  format?: string
  inStock?: boolean
}) {
  const title = `${product.title} - Buy Classical Music ${product.format || 'Album'}`
  const description = product.description 
    ? `${product.description.slice(0, 150)}...`
    : `Buy ${product.title} ${product.format || 'album'} from Avanti Classic${product.price ? ` for ${product.currency || '€'}${product.price}` : ''}. High-quality classical music recordings available now.`
  
  return generateMetadata({
    title,
    description,
    keywords: [
      product.title.toLowerCase(),
      "buy classical music",
      "classical music cd",
      "classical music shop",
      product.format?.toLowerCase() || "",
      "classical music store"
    ].filter(Boolean),
    image: product.image,
    canonical: `/shop/products/${encodeURIComponent(product.title.toLowerCase().replace(/\s+/g, '-'))}`,
    type: "website"
  })
}