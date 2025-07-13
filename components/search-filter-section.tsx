"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function SearchFilterSection() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-8">
      <Select>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Artists" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Artists</SelectItem>
          <SelectItem value="artist1">Artist Name 1</SelectItem>
          <SelectItem value="artist2">Artist Name 2</SelectItem>
          <SelectItem value="artist3">Artist Name 3</SelectItem>
        </SelectContent>
      </Select>
      <div className="relative w-full md:max-w-md">
        <Input type="search" placeholder="Search releases..." className="pr-10" />
        <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </div>
  )
}
