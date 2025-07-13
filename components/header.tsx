"use client"

import Link from "next/link"
import { Menu, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/90">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center font-serif text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50"
        >
          Avanti<span className="text-primary">Classic</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/artists"
            className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
          >
            OUR ARTISTS
          </Link>
          <Link
            href="/releases"
            className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
          >
            RELEASES
          </Link>
          <Link
            href="/news-and-more"
            className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
          >
            VIDEOS & MORE
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
          >
            ABOUT
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
              >
                <Globe className="h-5 w-5" />
                <span className="sr-only">Select language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>Deutsch</DropdownMenuItem>
              <DropdownMenuItem>Français</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white dark:bg-gray-950">
              <div className="grid gap-6 py-6">
                <Link
                  href="/artists"
                  className="text-lg font-semibold text-gray-800 hover:text-primary dark:text-gray-200 dark:hover:text-primary"
                >
                  OUR ARTISTS
                </Link>
                <Link
                  href="/releases"
                  className="text-lg font-semibold text-gray-800 hover:text-primary dark:text-gray-200 dark:hover:text-primary"
                >
                  RELEASES
                </Link>
                <Link
                  href="/news-and-more"
                  className="text-lg font-semibold text-gray-800 hover:text-primary dark:text-gray-200 dark:hover:text-primary"
                >
                  VIDEOS & MORE
                </Link>
                <Link
                  href="/about"
                  className="text-lg font-semibold text-gray-800 hover:text-primary dark:text-gray-200 dark:hover:text-primary"
                >
                  ABOUT
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
