"use client" // Added 'use client' directive

import Link from "next/link"
import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Category {
  name: string
  href: string
}

interface CategoryNavigationProps {
  categories: Category[]
}

export default function CategoryNavigation({ categories }: CategoryNavigationProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200 // Adjust as needed
      if (direction === "left") {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      } else {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
      }
    }
  }

  return (
    <nav className="relative w-full bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4">
      <div className="container px-4 md:px-6 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll("left")}
          className="hidden md:flex shrink-0 text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div
          ref={scrollRef}
          className="flex-1 overflow-x-auto scrollbar-hide whitespace-nowrap px-2 md:px-0"
          style={{ scrollBehavior: "smooth" }}
        >
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="inline-block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll("right")}
          className="hidden md:flex shrink-0 text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  )
}
