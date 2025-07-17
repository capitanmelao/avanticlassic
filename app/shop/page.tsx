"use client"

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Music, Star, ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

// Fetch product statistics for categories
async function getProductStats() {
  try {
    const supabase = createClient()
    
    const { data: stats, error } = await supabase
      .from('products')
      .select('format')
      .eq('status', 'active')
    
    if (error) {
      console.error('Error fetching product stats:', error)
      return { 'Hybrid SACD': 0, 'CD': 0, 'Multi-disc': 0, 'Digital': 0 }
    }
    
    const formatCounts = stats.reduce((acc: any, product: any) => {
      const format = product.format
      if (format === 'Hybrid SACD') acc['Hybrid SACD'] = (acc['Hybrid SACD'] || 0) + 1
      else if (format === 'CD') acc['CD'] = (acc['CD'] || 0) + 1
      else if (format === 'Multi-disc') acc['Multi-disc'] = (acc['Multi-disc'] || 0) + 1
      else acc['Digital'] = (acc['Digital'] || 0) + 1
      return acc
    }, {})
    
    return formatCounts
  } catch (error) {
    console.error('Error in getProductStats:', error)
    return { 'Hybrid SACD': 0, 'CD': 0, 'Multi-disc': 0, 'Digital': 0 }
  }
}

function getCategories(stats: any) {
  return [
    {
      name: "Hybrid SACD",
      description: "High-quality Super Audio CD format",
      count: stats['Hybrid SACD'] || 0,
      icon: "🎵",
      filter: "Hybrid SACD"
    },
    {
      name: "CD Releases",
      description: "Standard CD format",
      count: stats['CD'] || 0,
      icon: "💿",
      filter: "CD"
    },
    {
      name: "Multi-disc Sets",
      description: "Box sets and collections",
      count: stats['Multi-disc'] || 0,
      icon: "📀",
      filter: "Multi-disc"
    },
    {
      name: "Digital Downloads",
      description: "Instant digital access",
      count: stats['Digital'] || 0,
      icon: "📱",
      filter: "Digital"
    }
  ]
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
        <Link href={`/shop/products/${product.id}`}>
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
          <Link href={`/shop/products/${product.id}`}>
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

function CategoryCard({ category }: { category: any }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <CardContent className="p-6 text-center">
        <div className="text-4xl mb-4">{category.icon}</div>
        <h3 className="font-playfair font-semibold text-lg mb-2">{category.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{category.description}</p>
        <Badge variant="outline" className="mb-4">
          {category.count} releases
        </Badge>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/shop/products?format=${encodeURIComponent(category.filter)}`}>
            Browse Collection
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default function ShopPage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [productStats, setProductStats] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const [products, stats] = await Promise.all([
          getFeaturedProducts(),
          getProductStats()
        ])
        setFeaturedProducts(products)
        setProductStats(stats)
      } catch (error) {
        console.error('Error loading shop data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [])
  
  const categories = getCategories(productStats)
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-black to-gray-900 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-6">
              Avanti Classic Shop
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              Discover exceptional classical music recordings in premium formats
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href="/shop/products">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Browse All Products
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                <Music className="mr-2 h-5 w-5" />
                Listen to Samples
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

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
              Shop by Format
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose your preferred listening experience from our collection of premium formats
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.name} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
              Why Choose Avanti Classic?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-playfair font-semibold text-xl mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                High-resolution recordings and premium formats including Hybrid SACD
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-playfair font-semibold text-xl mb-2">Curated Selection</h3>
              <p className="text-gray-600">
                Carefully selected classical music from renowned artists and orchestras
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-playfair font-semibold text-xl mb-2">Worldwide Shipping</h3>
              <p className="text-gray-600">
                Fast and secure delivery to classical music lovers worldwide
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}