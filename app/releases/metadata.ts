import type { Metadata } from "next"
import { generateMetadata } from "@/lib/seo"

export const metadata: Metadata = generateMetadata({
  title: "Classical Music Releases & Albums",
  description: "Explore premium classical music releases and albums from Avanti Classic. High-quality recordings featuring world-renowned artists, available in CD and Hybrid SACD formats. Discover exceptional classical performances.",
  keywords: [
    "classical music releases",
    "classical albums",
    "classical recordings",
    "classical CDs",
    "hybrid SACD",
    "classical music collection",
    "premium classical recordings",
    "new classical releases",
    "classical music catalog",
    "orchestral recordings",
    "chamber music albums",
    "piano recordings"
  ],
  canonical: "/releases",
  type: "website"
})