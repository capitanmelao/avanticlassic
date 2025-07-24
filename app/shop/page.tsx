"use client"

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Loader2, ArrowUp } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/browser'

// Release interface for simplified shop
interface Release {
  id: number
  title: string
  url: string
  image_url: string
  catalog_number: string
  featured: boolean
  sort_order: number
  price: number | null
  stripe_payment_link: string | null
  release_artists: Array<{
    artists: {
      name: string
    }
  }>
}

// Fetch all releases with payment info from API
async function getAllReleases(): Promise<Release[]> {
  try {
    const supabase = createClient()
    
    const { data: releases, error } = await supabase
      .from('releases')
      .select(`
        id,
        title,
        url,
        image_url,
        catalog_number,
        featured,
        sort_order,
        price,
        stripe_payment_link,
        release_artists!inner(
          artists!inner(
            name
          )
        )
      `)
      .order('featured', { ascending: false }) // Featured first
      .order('sort_order', { ascending: true })
    
    if (error) {
      console.error('Error fetching releases:', error)
      return []
    }
    
    return releases || []
  } catch (error) {
    console.error('Error in getAllReleases:', error)
    return []
  }
}

function ReleaseCard({ release }: { release: Release }) {
  const handleBuyNow = () => {
    if (release.stripe_payment_link) {
      // Redirect directly to Stripe Payment Link
      window.open(release.stripe_payment_link, '_blank')
    }
  }
  
  const renderActionButton = () => {
    if (release.stripe_payment_link && release.price) {
      // Has both price and payment link - show Buy Now
      return (
        <Button 
          size="sm" 
          className="bg-primary hover:bg-primary/90"
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
      )
    } else if (release.price && !release.stripe_payment_link) {
      // Has price but no payment link - show Coming Soon
      return (
        <Button 
          size="sm" 
          variant="outline"
          disabled
        >
          Coming Soon
        </Button>
      )
    } else {
      // No price set - show Contact Us
      return (
        <Button 
          size="sm" 
          variant="outline"
          disabled
        >
          Contact Us
        </Button>
      )
    }
  }
  
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="p-0">
        <Link href={`/releases/${release.url}`}>
          <div className="relative aspect-square overflow-hidden rounded-t-lg cursor-pointer">
            <img
              src={release.image_url || '/images/placeholder-album.jpg'}
              alt={release.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            {release.featured && (
              <Badge className="absolute top-2 left-2 bg-yellow-500 text-black">
                Featured
              </Badge>
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <Link href={`/releases/${release.url}`}>
            <h3 className="font-playfair font-semibold text-lg leading-tight group-hover:text-primary transition-colors cursor-pointer">
              {release.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-600">{release.release_artists?.[0]?.artists?.name || 'Unknown Artist'}</p>
          <p className="text-xs text-gray-500">{release.catalog_number}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {release.price ? (
                <span className="text-lg font-bold text-primary">
                  €{release.price.toFixed(2)}
                </span>
              ) : (
                <span className="text-sm text-gray-500">
                  Price TBA
                </span>
              )}
            </div>
            {renderActionButton()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ShopPage() {
  // State management
  const [allReleases, setAllReleases] = useState<Release[]>([])
  const [displayedReleases, setDisplayedReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [showScrollTop, setShowScrollTop] = useState(false)
  
  // Refs
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const releasesPerLoad = 12
  
  // Fetch all releases from API
  const fetchReleases = useCallback(async () => {
    try {
      setLoading(true)
      const releases = await getAllReleases()
      setAllReleases(releases)
    } catch (error) {
      console.error('Error fetching releases:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initialize displayed releases when allReleases changes
  useEffect(() => {
    if (allReleases.length > 0) {
      setDisplayedReleases(allReleases.slice(0, releasesPerLoad))
      setHasMore(allReleases.length > releasesPerLoad)
    }
  }, [allReleases])
  
  // Load more releases
  const loadMoreReleases = useCallback(() => {
    if (loadingMore || !hasMore) return
    
    setLoadingMore(true)
    
    setTimeout(() => {
      const currentLength = displayedReleases.length
      const nextBatch = allReleases.slice(currentLength, currentLength + releasesPerLoad)
      setDisplayedReleases(prev => [...prev, ...nextBatch])
      setHasMore(currentLength + releasesPerLoad < allReleases.length)
      setLoadingMore(false)
    }, 100) // Reduced delay for faster loading
  }, [allReleases, displayedReleases, loadingMore, hasMore])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreReleases()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [loadMoreReleases, hasMore, loadingMore])

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Initial load
  useEffect(() => {
    fetchReleases()
  }, [fetchReleases])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2 text-lg">Loading releases...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Releases Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {displayedReleases.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {displayedReleases.map((release) => (
                  <ReleaseCard key={release.id} release={release} />
                ))}
              </div>
              
              {/* Loading more indicator */}
              <div ref={loadMoreRef} className="py-8">
                {loadingMore && (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading more releases...</span>
                  </div>
                )}
                {!hasMore && displayedReleases.length > releasesPerLoad && (
                  <div className="text-center text-muted-foreground">
                    You've seen all {allReleases.length} releases
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold mb-4">No releases found</h3>
              <p className="text-muted-foreground mb-6">
                Check back soon for new releases from our artists
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Scroll to top button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 rounded-full p-3 shadow-lg"
          size="icon"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}