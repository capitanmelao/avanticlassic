"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Star, Truck, Shield, Music, Play, ShoppingCart, Heart } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCart } from '@/contexts/cart-context'
import { createClient } from '@/lib/supabase/browser'

interface ProductPrice {
  id: string
  amount: number
  currency: string
  variant_type: string
  metadata?: any
}

interface Product {
  id: string
  name: string
  description: string
  format: string
  featured: boolean
  images: string[]
  metadata: any
  inventory_tracking: boolean
  inventory_quantity: number
  product_prices: ProductPrice[]
  releases: {
    id: string
    title: string
    image_url: string
    catalog_number: string
    description: string
    tracks: any[]
    duration: string
    recording_date: string
    recording_location: string
    release_artists: {
      artists: {
        name: string
      }
    }[]
  }
}

async function fetchProduct(id: string): Promise<Product | null> {
  try {
    const supabase = createClient()
    
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        product_prices(*),
        releases!inner(
          id,
          title,
          image_url,
          catalog_number,
          description,
          tracks,
          duration,
          recording_date,
          recording_location,
          release_artists!inner(
            artists!inner(
              name
            )
          )
        )
      `)
      .eq('id', id)
      .eq('status', 'active')
      .single()
    
    if (error) {
      console.error('Error fetching product:', error)
      return null
    }
    
    return product
  } catch (error) {
    console.error('Error in fetchProduct:', error)
    return null
  }
}

async function fetchRelatedProducts(releaseId: string, currentProductId: string): Promise<Product[]> {
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
      .eq('release_id', releaseId)
      .eq('status', 'active')
      .neq('id', currentProductId)
      .limit(4)
    
    if (error) {
      console.error('Error fetching related products:', error)
      return []
    }
    
    return products || []
  } catch (error) {
    console.error('Error in fetchRelatedProducts:', error)
    return []
  }
}

function ProductImageGallery({ images, title }: { images: string[], title: string }) {
  const [currentImage, setCurrentImage] = useState(0)
  
  // Use cover image from release if no product images
  const displayImages = images.length > 0 ? images : ['/images/placeholder-album.jpg']
  
  return (
    <div className="space-y-4">
      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
        <img
          src={displayImages[currentImage]}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                index === currentImage ? 'border-primary' : 'border-gray-200'
              }`}
            >
              <img
                src={image}
                alt={`${title} - Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function PriceSelector({ 
  prices, 
  selectedPrice, 
  onPriceChange 
}: { 
  prices: ProductPrice[], 
  selectedPrice: ProductPrice | null, 
  onPriceChange: (price: ProductPrice) => void 
}) {
  if (prices.length === 0) return null
  
  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Choose Format:</h3>
      <div className="space-y-2">
        {prices.map((price) => (
          <button
            key={price.id}
            onClick={() => onPriceChange(price)}
            className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
              selectedPrice?.id === price.id 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{price.variant_type}</div>
                <div className="text-sm text-gray-600">
                  {price.metadata?.description || 'Standard format'}
                </div>
              </div>
              <div className="text-lg font-bold text-primary">
                €{(price.amount / 100).toFixed(2)}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function RelatedProducts({ products }: { products: Product[] }) {
  const { addItem } = useCart()
  
  if (products.length === 0) return null
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Other Formats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => {
            const defaultPrice = product.product_prices?.[0]
            const release = product.releases
            
            if (!defaultPrice || !release) return null
            
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
                catalog: release.catalog_number,
                metadata: product.metadata // Include product metadata for tax/shipping overrides
              })
            }
            
            return (
              <div key={product.id} className="flex gap-3 p-3 border rounded-lg">
                <img
                  src={release.image_url || '/images/placeholder-album.jpg'}
                  alt={release.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{product.format}</h4>
                  <p className="text-xs text-gray-600">{release.catalog_number}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-bold text-primary">
                      €{(defaultPrice.amount / 100).toFixed(2)}
                    </span>
                    <Button size="sm" onClick={handleAddToCart}>
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [selectedPrice, setSelectedPrice] = useState<ProductPrice | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  
  useEffect(() => {
    async function loadProduct() {
      if (!params.id) return
      
      try {
        setIsLoading(true)
        const productData = await fetchProduct(params.id as string)
        
        if (!productData) {
          router.push('/shop/products')
          return
        }
        
        setProduct(productData)
        setSelectedPrice(productData.product_prices[0] || null)
        
        // Load related products (other formats of the same release)
        if (productData.releases) {
          const related = await fetchRelatedProducts(
            productData.releases.id,
            productData.id
          )
          setRelatedProducts(related)
        }
      } catch (error) {
        console.error('Error loading product:', error)
        router.push('/shop/products')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadProduct()
  }, [params.id, router])
  
  const handleAddToCart = () => {
    if (!product || !selectedPrice) return
    
    const artistName = product.releases.release_artists?.[0]?.artists?.name || 'Unknown Artist'
    addItem({
      productId: product.id,
      priceId: selectedPrice.id,
      name: product.releases.title,
      artist: artistName,
      format: product.format,
      image: product.releases.image_url || '/images/placeholder-album.jpg',
      price: selectedPrice.amount / 100,
      catalog: product.releases.catalog_number,
      metadata: product.metadata // Include product metadata for tax/shipping overrides
    })
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-32 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-300 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="h-20 bg-gray-300 rounded"></div>
                <div className="h-12 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/shop/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }
  
  const release = product.releases
  const inStock = product.inventory_tracking ? product.inventory_quantity > 0 : true
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/shop" className="hover:text-primary">Shop</Link>
          <span>/</span>
          <Link href="/shop/products" className="hover:text-primary">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{release.title}</span>
        </div>
        
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <ProductImageGallery
            images={release.image_url ? [release.image_url] : []}
            title={release.title}
          />
          
          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h1 className="font-playfair text-3xl font-bold mb-2">{release.title}</h1>
              <p className="text-xl text-gray-600 mb-1">{release.release_artists?.[0]?.artists?.name || 'Unknown Artist'}</p>
              <p className="text-sm text-gray-500">{release.catalog_number}</p>
              {product.featured && (
                <Badge className="mt-2 bg-yellow-500 text-black">Featured</Badge>
              )}
            </div>
            
            {/* Price and Format Selection */}
            <div className="space-y-4">
              <PriceSelector
                prices={product.product_prices}
                selectedPrice={selectedPrice}
                onPriceChange={setSelectedPrice}
              />
              
              {selectedPrice && (
                <div className="text-2xl font-bold text-primary">
                  €{(selectedPrice.amount / 100).toFixed(2)}
                </div>
              )}
            </div>
            
            {/* Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!inStock || !selectedPrice}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button size="lg" variant="outline">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
              
              {!inStock && (
                <p className="text-sm text-red-600">
                  This item is currently out of stock
                </p>
              )}
            </div>
            
            {/* Product Features */}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Free shipping over €25</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Secure payment</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="prose max-w-none">
                  <p>{release.description || product.description || 'No description available.'}</p>
                  
                  {release.tracks && release.tracks.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold mb-3">Track Listing:</h3>
                      <ul className="space-y-1">
                        {release.tracks.map((track: any, index: number) => (
                          <li key={index} className="flex justify-between">
                            <span>{track.title}</span>
                            {track.duration && <span className="text-gray-500">{track.duration}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Format Information</h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Format:</dt>
                        <dd>{product.format}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Catalog Number:</dt>
                        <dd>{release.catalog_number}</dd>
                      </div>
                      {release.duration && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Duration:</dt>
                          <dd>{release.duration}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Recording Information</h3>
                    <dl className="space-y-2 text-sm">
                      {release.recording_date && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Recording Date:</dt>
                          <dd>{release.recording_date}</dd>
                        </div>
                      )}
                      {release.recording_location && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Recording Location:</dt>
                          <dd>{release.recording_location}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600">Be the first to review this product!</p>
                  <Button className="mt-4">Write a Review</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </div>
    </div>
  )
}