import type React from "react"
import type { Metadata } from "next"
import { Mona_Sans as FontSans, Playfair_Display } from "next/font/google"
import "./globals.css"

import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import NewHeader from "@/components/new-header" // Using the new header
import Footer from "@/components/footer"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: {
    default: "Avanti Classic - Modern Classical Music Label",
    template: "%s | Avanti Classic"
  },
  description: "Discover exceptional classical music from Avanti Classic. Explore world-renowned artists, premium releases, curated playlists, and immersive video performances from our distinguished classical music label.",
  keywords: [
    "classical music",
    "classical music label",
    "classical recordings",
    "classical artists",
    "orchestral music",
    "chamber music",
    "piano classical",
    "violin classical",
    "classical albums",
    "classical CDs",
    "SACD classical",
    "high-quality classical recordings",
    "modern classical music",
    "contemporary classical",
    "classical music videos",
    "classical playlists"
  ],
  authors: [{ name: "Avanti Classic" }],
  creator: "Avanti Classic",
  publisher: "Avanti Classic",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://avanticlassic.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Avanti Classic - Modern Classical Music Label",
    description: "Discover exceptional classical music from Avanti Classic. Explore world-renowned artists, premium releases, curated playlists, and immersive video performances.",
    url: "https://avanticlassic.vercel.app",
    siteName: "Avanti Classic",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Avanti Classic - Classical Music Label",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Avanti Classic - Modern Classical Music Label",
    description: "Discover exceptional classical music from Avanti Classic. Explore world-renowned artists, premium releases, and curated playlists.",
    images: ["/images/twitter-card.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable, playfairDisplay.variable)}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <div className="flex flex-col min-h-screen">
              <NewHeader /> {/* Render the new header */}
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
