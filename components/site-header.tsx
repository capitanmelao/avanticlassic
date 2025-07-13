"use client"

import Link from "next/link"
import { Menu, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center font-bold text-lg">
          avanti<span className="text-primary">classic</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
            OUR ARTISTS
          </Link>
          <Link href="/releases" className="text-sm font-medium hover:underline underline-offset-4">
            RELEASES
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
            VIDEOS
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
            ABOUT
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
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
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-4 py-6">
                <Link href="#" className="text-lg font-semibold">
                  OUR ARTISTS
                </Link>
                <Link href="/releases" className="text-lg font-semibold">
                  RELEASES
                </Link>
                <Link href="#" className="text-lg font-semibold">
                  VIDEOS
                </Link>
                <Link href="#" className="text-lg font-semibold">
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
