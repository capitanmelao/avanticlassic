// JSON-LD Structured Data for Classical Music Content
// Schema.org types for enhanced search engine understanding

const baseUrl = "https://avanticlassic.vercel.app"

// Organization schema for Avanti Classic
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Avanti Classic",
    "url": baseUrl,
    "logo": `${baseUrl}/images/logo.png`,
    "description": "Modern classical music label featuring world-renowned artists and premium recordings",
    "foundingDate": "2020",
    "industry": "Music",
    "sameAs": [
      // Add social media URLs when available
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["English", "French", "German"]
    }
  }
}

// MusicGroup schema for classical artists
export function generateMusicGroupSchema(artist: {
  name: string
  bio?: string
  image?: string
  instrument?: string
  genre?: string[]
  website?: string
  birthDate?: string
  nationality?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "name": artist.name,
    "description": artist.bio,
    "image": artist.image ? (artist.image.startsWith('http') ? artist.image : `${baseUrl}${artist.image}`) : undefined,
    "genre": artist.genre || ["Classical Music", "Classical"],
    "url": `${baseUrl}/artists/${encodeURIComponent(artist.name.toLowerCase().replace(/\s+/g, '-'))}`,
    "instrument": artist.instrument,
    "foundingDate": artist.birthDate,
    "foundingLocation": artist.nationality ? {
      "@type": "Country",
      "name": artist.nationality
    } : undefined,
    "sameAs": artist.website ? [artist.website] : undefined
  }
}

// Person schema for individual classical musicians
export function generatePersonSchema(artist: {
  name: string
  bio?: string
  image?: string
  instrument?: string
  birthDate?: string
  nationality?: string
  website?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": artist.name,
    "description": artist.bio,
    "image": artist.image ? (artist.image.startsWith('http') ? artist.image : `${baseUrl}${artist.image}`) : undefined,
    "url": `${baseUrl}/artists/${encodeURIComponent(artist.name.toLowerCase().replace(/\s+/g, '-'))}`,
    "jobTitle": "Classical Musician",
    "knowsAbout": artist.instrument ? [`${artist.instrument} Performance`, "Classical Music"] : ["Classical Music"],
    "birthDate": artist.birthDate,
    "nationality": artist.nationality,
    "sameAs": artist.website ? [artist.website] : undefined
  }
}

// MusicAlbum schema for classical releases
export function generateMusicAlbumSchema(release: {
  title: string
  artist?: string
  description?: string
  image?: string
  format?: string
  releaseDate?: string
  catalogNumber?: string
  tracks?: Array<{ title: string; duration?: string; composer?: string }>
  duration?: string
  label?: string
}) {
  const albumUrl = `${baseUrl}/releases/${encodeURIComponent(release.title.toLowerCase().replace(/\s+/g, '-'))}`
  
  return {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    "name": release.title,
    "description": release.description,
    "image": release.image ? (release.image.startsWith('http') ? release.image : `${baseUrl}${release.image}`) : undefined,
    "url": albumUrl,
    "datePublished": release.releaseDate,
    "duration": release.duration,
    "albumProductionType": "StudioAlbum",
    "albumReleaseType": "AlbumRelease",
    "genre": ["Classical Music", "Classical"],
    "recordLabel": {
      "@type": "Organization",
      "name": release.label || "Avanti Classic"
    },
    "byArtist": release.artist ? {
      "@type": "MusicGroup",
      "name": release.artist
    } : undefined,
    "identifier": release.catalogNumber,
    "tracks": release.tracks?.map((track, index) => ({
      "@type": "MusicRecording",
      "name": track.title,
      "position": index + 1,
      "duration": track.duration,
      "composer": track.composer ? {
        "@type": "Person",
        "name": track.composer
      } : undefined,
      "genre": ["Classical Music"],
      "inAlbum": {
        "@type": "MusicAlbum",
        "name": release.title
      }
    }))
  }
}

// MusicRecording schema for individual tracks
export function generateMusicRecordingSchema(track: {
  title: string
  artist?: string
  album?: string
  duration?: string
  composer?: string
  releaseDate?: string
  position?: number
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    "name": track.title,
    "duration": track.duration,
    "genre": ["Classical Music"],
    "datePublished": track.releaseDate,
    "position": track.position,
    "byArtist": track.artist ? {
      "@type": "MusicGroup",
      "name": track.artist
    } : undefined,
    "inAlbum": track.album ? {
      "@type": "MusicAlbum",
      "name": track.album
    } : undefined,
    "composer": track.composer ? {
      "@type": "Person",
      "name": track.composer
    } : undefined,
    "recordLabel": {
      "@type": "Organization",
      "name": "Avanti Classic"
    }
  }
}

// Product schema for shop items
export function generateProductSchema(product: {
  title: string
  description?: string
  image?: string
  price?: number
  currency?: string
  format?: string
  inStock?: boolean
  condition?: string
  sku?: string
  category?: string
}) {
  const productUrl = `${baseUrl}/shop/products/${encodeURIComponent(product.title.toLowerCase().replace(/\s+/g, '-'))}`
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": product.image ? (product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`) : undefined,
    "url": productUrl,
    "category": product.category || "Classical Music",
    "brand": {
      "@type": "Brand",
      "name": "Avanti Classic"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": product.currency || "EUR",
      "availability": product.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": product.condition === "used" ? "https://schema.org/UsedCondition" : "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "Avanti Classic"
      }
    },
    "sku": product.sku,
    "additionalProperty": product.format ? {
      "@type": "PropertyValue",
      "name": "Format",
      "value": product.format
    } : undefined
  }
}

// ItemList schema for collections (releases, artists, playlists)
export function generateItemListSchema(collection: {
  name: string
  description?: string
  url: string
  items: Array<{
    name: string
    url: string
    image?: string
    description?: string
  }>
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": collection.name,
    "description": collection.description,
    "url": `${baseUrl}${collection.url}`,
    "numberOfItems": collection.items.length,
    "itemListElement": collection.items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Thing",
        "name": item.name,
        "url": `${baseUrl}${item.url}`,
        "image": item.image ? (item.image.startsWith('http') ? item.image : `${baseUrl}${item.image}`) : undefined,
        "description": item.description
      }
    }))
  }
}

// Website schema for main pages
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Avanti Classic",
    "alternateName": "Avanti Classic Music Label",
    "url": baseUrl,
    "description": "Modern classical music label featuring world-renowned artists and premium recordings",
    "publisher": {
      "@type": "Organization",
      "name": "Avanti Classic"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  }
}

// BreadcrumbList schema for navigation
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${baseUrl}${crumb.url}`
    }))
  }
}

// FAQ schema for common questions (good for AI search optimization)
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}