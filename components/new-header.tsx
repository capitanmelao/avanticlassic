"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu, Search, User, ShoppingCart, Facebook, Youtube } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useTranslations } from "@/lib/translations"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function NewHeader() {
  const { language, setLanguage } = useLanguage()
  const t = useTranslations(language)

  const languageMap = {
    en: 'EN',
    fr: 'FR',
    de: 'DE'
  }
  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      {/* Top Bar */}
      <div className="hidden md:flex justify-end items-center h-10 px-6 border-b border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
        <span className="mr-4">{t.navigation.followUs}</span>
        <div className="flex gap-3 mr-4">
          <Link href="#" aria-label="Facebook">
            <Facebook className="h-4 w-4 hover:text-primary transition-colors" />
          </Link>
          <Link href="#" aria-label="YouTube">
            <Youtube className="h-4 w-4 hover:text-primary transition-colors" />
          </Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
            >
              {languageMap[language]} -
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLanguage('en')}>
              {t.navigation.language.english} {language === 'en' && '✓'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('de')}>
              {t.navigation.language.deutsch} {language === 'de' && '✓'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('fr')}>
              {t.navigation.language.francais} {language === 'fr' && '✓'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Navigation Bar */}
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center">
          <Image 
            src="/images/logo.jpeg" 
            alt="Avanti Classic" 
            width={200}
            height={48}
            className="h-12 w-auto"
            priority
          />
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/releases"
            className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors font-playfair"
          >
            {t.navigation.releases}
          </Link>
          <Link
            href="/artists"
            className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors font-playfair"
          >
            {t.navigation.artists}
          </Link>
          <Link
            href="/playlists"
            className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors font-playfair"
          >
            {t.navigation.playlists}
          </Link>
          <Link
            href="/shop"
            className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors font-playfair"
          >
            {t.navigation.shop}
          </Link>
          <Link
            href="/videos"
            className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors font-playfair"
          >
            {t.navigation.videos}
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors font-playfair"
          >
            {t.navigation.aboutUs}
          </Link>
        </nav>
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">{t.navigation.search}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
          >
            <User className="h-5 w-5" />
            <span className="sr-only">{t.navigation.myAccount}</span>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">{t.navigation.toggleMenu}</span>
                </Button>
              </div>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white dark:bg-gray-950">
              <div className="grid gap-6 py-6">
                <Link
                  href="/releases"
                  className="text-lg font-semibold text-gray-800 hover:text-primary dark:text-gray-200 dark:hover:text-primary font-playfair"
                >
                  {t.navigation.releases}
                </Link>
                <Link
                  href="/artists"
                  className="text-lg font-semibold text-gray-800 hover:text-primary dark:text-gray-200 dark:hover:text-primary font-playfair"
                >
                  {t.navigation.artists}
                </Link>
                <Link
                  href="/playlists"
                  className="text-lg font-semibold text-gray-800 hover:text-primary dark:text-gray-200 dark:hover:text-primary font-playfair"
                >
                  {t.navigation.playlists}
                </Link>
                <Link
                  href="/shop"
                  className="text-lg font-semibold text-gray-800 hover:text-primary dark:text-gray-200 dark:hover:text-primary font-playfair"
                >
                  {t.navigation.shop}
                </Link>
                <Link
                  href="/videos"
                  className="text-lg font-semibold text-gray-800 hover:text-primary dark:text-gray-200 dark:hover:text-primary font-playfair"
                >
                  {t.navigation.videos}
                </Link>
                <Link
                  href="/about"
                  className="text-lg font-semibold text-gray-800 hover:text-primary dark:text-gray-200 dark:hover:text-primary font-playfair"
                >
                  {t.navigation.aboutUs}
                </Link>
                <div className="flex gap-4 mt-4 justify-center">
                  <Link href="#" aria-label="Facebook">
                    <Facebook className="h-6 w-6 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary" />
                  </Link>
                  <Link href="#" aria-label="YouTube">
                    <Youtube className="h-6 w-6 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary" />
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
