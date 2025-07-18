"use client"

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/contexts/cart-context'
import { createClient } from '@/lib/supabase/browser'

// Fetch featured products from API
async function getFeaturedProducts() {
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
      .eq('featured', true)
      .order('sort_order', { ascending: true })
      .limit(3)
    
    if (error) {
      console.error('Error fetching featured products:', error)
      return []
    }
    
    return products || []
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error)
    return []
  }
}


function ProductCard({ product }: { product: any }) {
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
      catalog: release.catalog_number
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
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const products = await getFeaturedProducts()
        setFeaturedProducts(products)
      } catch (error) {
        console.error('Error loading shop data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-black text-white">
        <div className="relative container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center">
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                <Link href="/shop/products">
                  Browse All
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
              Featured Releases
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked selections from our catalog, featuring the finest classical music recordings
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardHeader className="p-0">
                    <div className="aspect-square bg-gray-300 rounded-t-lg"></div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                      <div className="flex items-center justify-between">
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                        <div className="h-8 bg-gray-300 rounded w-20"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>

          <div className="text-center">
            <Button asChild size="lg" variant="outline">
              <Link href="/shop/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>


    </div>
  )
}