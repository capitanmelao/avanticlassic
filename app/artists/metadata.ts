import type { Metadata } from "next"
import { generateMetadata } from "@/lib/seo"

export const metadata: Metadata = generateMetadata({
  title: "Classical Musicians & Artists",
  description: "Discover exceptional classical musicians and artists featured on Avanti Classic. Explore world-renowned performers, their biographies, instruments, and musical contributions to the classical music world.",
  keywords: [
    "classical musicians",
    "classical artists", 
    "classical performers",
    "piano artists",
    "violin artists",
    "orchestra musicians",
    "chamber musicians",
    "classical soloists",
    "classical music talent",
    "world-renowned musicians"
  ],
  canonical: "/artists",
  type: "website"
})