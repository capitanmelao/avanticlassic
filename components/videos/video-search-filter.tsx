"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface Video {
  id: string
  title: string
  artist?: string
  artistName?: string
}

interface VideoSearchFilterProps {
  videos: Video[]
  searchPlaceholder: string
  filterOptions: { value: string; label: string }[]
  filterPlaceholder?: string
  onSearchChange: (search: string) => void
  onFilterChange: (filter: string) => void
  searchValue: string
  filterValue: string
}

export default function VideoSearchFilter({ 
  videos,
  searchPlaceholder, 
  filterOptions, 
  filterPlaceholder,
  onSearchChange,
  onFilterChange,
  searchValue,
  filterValue
}: VideoSearchFilterProps) {
  const [searchInput, setSearchInput] = useState(searchValue)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  // Generate autocomplete suggestions from video data
  const autocompleteData = useMemo(() => {
    const items = new Set<string>()
    
    videos.forEach(video => {
      // Add video titles
      if (video.title) {
        items.add(video.title)
        
        // Add individual words from titles (for partial matching)
        const words = video.title.split(' ').filter(word => 
          word.length > 3 && !['and', 'the', 'with', 'from'].includes(word.toLowerCase())
        )
        words.forEach(word => items.add(word))
      }
      
      // Add artist names
      const artist = video.artist || video.artistName
      if (artist && artist !== 'Avanti Classic' && artist !== 'Avanticlassic') {
        items.add(artist)
        
        // Add individual artist names for collaborations
        const artistNames = artist.split(/[,&]/).map(name => name.trim())
        artistNames.forEach(name => {
          if (name.length > 2) items.add(name)
        })
      }
    })
    
    return Array.from(items).sort()
  }, [videos])

  // Update search input when searchValue prop changes
  useEffect(() => {
    setSearchInput(searchValue)
  }, [searchValue])

  // Generate suggestions based on input
  useEffect(() => {
    if (searchInput.length > 1) {
      const filtered = autocompleteData.filter(item =>
        item.toLowerCase().includes(searchInput.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 8)) // Show max 8 suggestions
      setShowSuggestions(filtered.length > 0 && !filtered.some(item => item === searchInput))
    } else {
      setShowSuggestions(false)
      setSuggestions([])
    }
  }, [searchInput, autocompleteData])

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    onSearchChange(value)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchInput(suggestion)
    setShowSuggestions(false)
    onSearchChange(suggestion)
  }

  const handleSearch = () => {
    onSearchChange(searchInput)
    setShowSuggestions(false)
  }

  const clearSearch = () => {
    setSearchInput("")
    onSearchChange("")
    setShowSuggestions(false)
  }

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-6 py-8 px-4 md:px-6">
      {/* Artist Filter */}
      {filterOptions && filterOptions.length > 0 && (
        <Select value={filterValue} onValueChange={onFilterChange}>
          <SelectTrigger className="w-full lg:w-[200px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
            <SelectValue placeholder={filterPlaceholder} />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 max-h-60 overflow-y-auto">
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      {/* Search Input with Autocomplete */}
      <div className="relative w-full lg:max-w-lg" ref={searchRef}>
        <div className="relative">
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch()
              } else if (e.key === 'Escape') {
                setShowSuggestions(false)
              }
            }}
            onFocus={() => {
              if (searchInput.length > 1 && suggestions.length > 0) {
                setShowSuggestions(true)
              }
            }}
            className="pr-20 w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchInput && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={clearSearch}
                className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <span className="text-lg">×</span>
              </Button>
            )}
            <Button
              type="submit"
              size="icon"
              onClick={handleSearch}
              className="h-8 w-8 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </div>
        
        {/* Autocomplete Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 first:rounded-t-md last:rounded-b-md border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
              >
                <span className="text-sm font-medium">{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground lg:min-w-[120px] text-center lg:text-left">
        {videos.length} video{videos.length !== 1 ? 's' : ''} found
      </div>
    </div>
  )
}