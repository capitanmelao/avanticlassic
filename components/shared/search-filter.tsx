"use client"

import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface SearchFilterProps {
  searchPlaceholder: string
  filterOptions?: { value: string; label: string }[]
  filterPlaceholder?: string
  onSearchChange?: (search: string) => void
  onFilterChange?: (filter: string) => void
  searchValue?: string
  filterValue?: string
}

// Sample autocomplete data - in a real app this would come from an API
const releaseAutocomplete = [
  "Fire Dance",
  "The Prokofiev Project", 
  "Recital Schumann",
  "Klezmer Karma",
  "Liszt Recital",
  "Martha Argerich",
  "Roby Lakatos",
  "Polina Leschenko",
  "Sergio Tiempo",
  "Philippe Quint",
  "Goldberg Variations",
  "La Belle Epoque",
  "Forgotten Melodies"
]

export default function SearchFilter({ 
  searchPlaceholder, 
  filterOptions, 
  filterPlaceholder,
  onSearchChange,
  onFilterChange,
  searchValue = "",
  filterValue = ""
}: SearchFilterProps) {
  const [searchInput, setSearchInput] = useState(searchValue)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (searchInput.length > 1) {
      const filtered = releaseAutocomplete.filter(item =>
        item.toLowerCase().includes(searchInput.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5))
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
      setSuggestions([])
    }
  }, [searchInput])

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
    onSearchChange?.(value)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchInput(suggestion)
    setShowSuggestions(false)
    onSearchChange?.(suggestion)
  }

  const handleSearch = () => {
    onSearchChange?.(searchInput)
    setShowSuggestions(false)
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-8 px-4 md:px-6">
      {filterOptions && filterOptions.length > 0 && (
        <Select value={filterValue} onValueChange={onFilterChange}>
          <SelectTrigger className="w-full md:w-[180px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
            <SelectValue placeholder={filterPlaceholder} />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      <div className="relative w-full md:max-w-md" ref={searchRef}>
        <Input
          type="search"
          placeholder={searchPlaceholder}
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
          className="pr-10 w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
        />
        <Button
          type="submit"
          size="icon"
          onClick={handleSearch}
          className="absolute right-1 top-1/2 -translate-y-1/2 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
        
        {/* Autocomplete Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 first:rounded-t-md last:rounded-b-md"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}