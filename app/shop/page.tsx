"use client"

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Loader2, ArrowUp } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/contexts/cart-context'
import { createClient } from '@/lib/supabase/browser'

// Product interface
interface Product {
  id: number
  name: string
  format: string
  status: string
  featured: boolean
  sort_order: number
  product_prices: Array<{
    id: number
    amount: number
    currency: string
  }>
  releases: {
    id: number
    title: string
    image_url: string
    catalog_number: string
    release_artists: Array<{
      artists: {
        name: string
      }
    }>
  }
}

// Fetch all products from API
async function getAllProducts(): Promise<Product[]> {
  try {
    const supabase = createClient()
    
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        product_prices(*),
        releases!inner(
          id,
          title,
          image_url,
          catalog_number,
          release_artists!inner(
            artists!inner(
              name
            )
          )
        )
      `)
      .eq('status', 'active')
      .order('featured', { ascending: false }) // Featured first
      .order('sort_order', { ascending: true })
    
    if (error) {
      console.error('Error fetching products:', error)
      return []
    }
    
    return products || []
  } catch (error) {
    console.error('Error in getAllProducts:', error)
    return []
  }
}

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  
  // Get the default price (first available price)
  const defaultPrice = product.product_prices?.[0]
  const release = product.releases
  
  if (!defaultPrice || !release) {
    return null
  }
  
  const handleAddToCart = () => {
    const artistName = release.release_artists?.[0]?.artists?.name || 'Unknown Artist'
    addItem({
      productId: product.id,
      priceId: defaultPrice.id,
      name: release.title,
      artist: artistName,
      format: product.format,
      image: release.image_url || '/images/placeholder-album.jpg',
      price: defaultPrice.amount / 100, // Convert from cents
      catalog: release.catalog_number,
      metadata: product.metadata // Include product metadata for tax/shipping overrides
    })
  }
  
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="p-0">
        <Link href={`/releases/${release.id}`}>
          <div className="relative aspect-square overflow-hidden rounded-t-lg cursor-pointer">
            <img
              src={release.image_url || '/images/placeholder-album.jpg'}
              alt={release.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            {product.featured && (
              <Badge className="absolute top-2 left-2 bg-yellow-500 text-black">
                Featured
              </Badge>
            )}
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-white/90 text-black">
                {product.format}
              </Badge>
            </div>
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <Link href={`/releases/${release.id}`}>
            <h3 className="font-playfair font-semibold text-lg leading-tight group-hover:text-primary transition-colors cursor-pointer">
              {release.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-600">{release.release_artists?.[0]?.artists?.name || 'Unknown Artist'}</p>
          <p className="text-xs text-gray-500">{release.catalog_number}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                €{(defaultPrice.amount / 100).toFixed(2)}
              </span>
            </div>
            <Button 
              size="sm" 
              className="bg-primary hover:bg-primary/90"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ShopPage() {
  // State management
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [showScrollTop, setShowScrollTop] = useState(false)
  
  // Refs
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const productsPerLoad = 12
  
  // Fetch all products from API
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const products = await getAllProducts()
      setAllProducts(products)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initialize displayed products when allProducts changes
  useEffect(() => {
    if (allProducts.length > 0) {
      setDisplayedProducts(allProducts.slice(0, productsPerLoad))
      setHasMore(allProducts.length > productsPerLoad)
    }
  }, [allProducts])
  
  // Load more products
  const loadMoreProducts = useCallback(() => {
    if (loadingMore || !hasMore) return
    
    setLoadingMore(true)
    
    setTimeout(() => {
      const currentLength = displayedProducts.length
      const nextBatch = allProducts.slice(currentLength, currentLength + productsPerLoad)
      setDisplayedProducts(prev => [...prev, ...nextBatch])
      setHasMore(currentLength + productsPerLoad < allProducts.length)
      setLoadingMore(false)
    }, 100) // Reduced delay for faster loading
  }, [allProducts, displayedProducts, loadingMore, hasMore])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreProducts()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [loadMoreProducts, hasMore, loadingMore])

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
    fetchProducts()
  }, [fetchProducts])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2 text-lg">Loading products...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {displayedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Loading more indicator */}
              <div ref={loadMoreRef} className="py-8">
                {loadingMore && (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading more products...</span>
                  </div>
                )}
                {!hasMore && displayedProducts.length > productsPerLoad && (
                  <div className="text-center text-muted-foreground">
                    You've seen all {allProducts.length} products
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold mb-4">No products available</h3>
              <p className="text-muted-foreground mb-6">
                Products will appear here when they become available
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