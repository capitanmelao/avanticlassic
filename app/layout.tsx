import type React from "react"
import type { Metadata } from "next"
import { Mona_Sans as FontSans, Playfair_Display } from "next/font/google"
import "./globals.css"

import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { CartProvider } from "@/contexts/cart-context"
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
  title: "Avanti Classic - Modern Classical Music Label",
  description: "Discover modern classical music from Avanti Classic. Explore artists, releases, videos, and more.",
    generator: 'v0.dev'
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
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                <NewHeader /> {/* Render the new header */}
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </CartProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
