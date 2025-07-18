"use client"

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Filter, Search, Grid, List, ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { useCart } from '@/contexts/cart-context'
import { createClient } from '@/lib/supabase/browser'

// Fetch products from API
async function fetchProducts(filters: any = {}) {
  try {
    const supabase = createClient()
    
    let query = supabase
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
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    
    // Apply filters
    if (filters.format && filters.format !== 'all') {
      query = query.eq('format', filters.format)
    }
    
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,releases.title.ilike.%${filters.search}%,releases.release_artists.artists.name.ilike.%${filters.search}%`)
    }
    
    // Apply pagination
    const page = filters.page || 1
    const limit = 12
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)
    
    const { data: products, error, count } = await query
    
    if (error) {
      console.error('Error fetching products:', error)
      return { products: [], total: 0 }
    }
    
    return { products: products || [], total: count || 0 }
  } catch (error) {
    console.error('Error in fetchProducts:', error)
    return { products: [], total: 0 }
  }
}

function ProductCard({ product }: { product: any }) {
  const { addItem } = useCart()
  
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
      price: defaultPrice.amount / 100,
      catalog: release.catalog_number
    })
  }
  
  const inStock = product.inventory_tracking ? product.inventory_quantity > 0 : true
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
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
            {!inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive">Out of Stock</Badge>
              </div>
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <Link href={`/releases/${release.id}`}>
            <h3 className="font-playfair font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2 cursor-pointer">
              {release.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 font-medium">{release.release_artists?.[0]?.artists?.name || 'Unknown Artist'}</p>
          <p className="text-xs text-gray-500">{release.catalog_number}</p>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                €{(defaultPrice.amount / 100).toFixed(2)}
              </span>
            </div>
            <Button 
              size="sm" 
              className="bg-primary hover:bg-primary/90"
              disabled={!inStock}
              onClick={handleAddToCart}
            >
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ProductListItem({ product }: { product: any }) {
  const { addItem } = useCart()
  
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
      price: defaultPrice.amount / 100,
      catalog: release.catalog_number
    })
  }
  
  const inStock = product.inventory_tracking ? product.inventory_quantity > 0 : true
  
  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Link href={`/releases/${release.id}`}>
            <div className="relative w-24 h-24 flex-shrink-0 cursor-pointer">
              <img
                src={release.image_url || '/images/placeholder-album.jpg'}
                alt={release.title}
                className="w-full h-full object-cover rounded-lg"
              />
              {product.featured && (
                <Badge className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs">
                  Featured
                </Badge>
              )}
            </div>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <Link href={`/releases/${release.id}`}>
                  <h3 className="font-playfair font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1 cursor-pointer">
                    {release.title}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 font-medium">{release.release_artists?.[0]?.artists?.name || 'Unknown Artist'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {product.format}
                  </Badge>
                  <span className="text-xs text-gray-500">{release.catalog_number}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 ml-4">
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">
                      €{(defaultPrice.amount / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90"
                  disabled={!inStock}
                  onClick={handleAddToCart}
                >
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    format: searchParams.get('format') || 'all',
    sort: 'newest',
    page: 1
  })
  
  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true)
        const result = await fetchProducts(filters)
        setProducts(result.products)
        setTotal(result.total)
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadProducts()
  }, [filters])
  
  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }))
  }
  
  const handleFormatChange = (value: string) => {
    setFilters(prev => ({ ...prev, format: value, page: 1 }))
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-playfair text-3xl md:text-4xl font-bold">
                Classical Music Collection
              </h1>
              <p className="text-gray-600 mt-2">
                Discover our complete catalog of premium classical recordings
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {total} products
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={filters.format} onValueChange={handleFormatChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Formats</SelectItem>
                  <SelectItem value="Hybrid SACD">Hybrid SACD</SelectItem>
                  <SelectItem value="CD">CD</SelectItem>
                  <SelectItem value="Digital">Digital</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-15">Under €15</SelectItem>
                  <SelectItem value="15-20">€15 - €20</SelectItem>
                  <SelectItem value="over-20">Over €20</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="newest">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-lg">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                  size="sm" 
                  className="px-3"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'ghost'} 
                  size="sm" 
                  className="px-3"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
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
            ))}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {products.map((product) => (
              viewMode === 'grid' ? (
                <ProductCard key={product.id} product={product} />
              ) : (
                <ProductListItem key={product.id} product={product} />
              )
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-white">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}