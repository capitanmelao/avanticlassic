import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ShoppingCart, Check } from "lucide-react"
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface Product {
  id: number
  name: string
  description: string
  format: string
  status: string
  inventory_quantity: number
  inventory_tracking: boolean
  images: string[]
  product_prices: {
    id: number
    amount: number
    currency: string
    variant_type: string
    active: boolean
  }[]
}

interface Release {
  id: number
  title: string
  image_url: string
  catalog_number: string
  release_date: string
  release_artists: {
    artists: {
      name: string
    }
  }[]
  products: Product[]
}

async function getReleaseWithProducts(releaseId: string): Promise<Release | null> {
  try {
    const { data: release, error } = await supabase
      .from('releases')
      .select(`
        id,
        title,
        image_url,
        catalog_number,
        release_date,
        release_artists (
          artists (
            name
          )
        ),
        products (
          id,
          name,
          description,
          format,
          status,
          inventory_quantity,
          inventory_tracking,
          images,
          product_prices (
            id,
            amount,
            currency,
            variant_type,
            active
          )
        )
      `)
      .eq('id', releaseId)
      .eq('products.status', 'active')
      .single()

    if (error) {
      console.error('Error fetching release:', error)
      return null
    }

    return release
  } catch (error) {
    console.error('Error fetching release:', error)
    return null
  }
}

export default async function ShopReleasePage({ params }: { params: { id: string } }) {
  const release = await getReleaseWithProducts(params.id)
  
  if (!release || !release.products || release.products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/shop"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Shop
          </Link>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Product Not Available
            </h1>
            <p className="text-gray-600">
              This release is not available for purchase at the moment.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const artistNames = release.release_artists?.map(ra => ra.artists.name).join(', ') || 'Various Artists'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/shop"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square relative">
            <Image
              src={release.image_url || '/placeholder-release.png'}
              alt={release.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {release.title}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {artistNames}
              </p>
              {release.catalog_number && (
                <p className="text-sm text-gray-500">
                  Catalog: {release.catalog_number}
                </p>
              )}
              {release.release_date && (
                <p className="text-sm text-gray-500">
                  Release Date: {new Date(release.release_date).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Available Formats */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Available Formats
              </h2>
              
              <div className="space-y-3">
                {release.products.map((product) => {
                  const defaultPrice = product.product_prices?.find(p => p.variant_type === 'default' && p.active)
                  const isAvailable = product.status === 'active' && 
                                     (!product.inventory_tracking || product.inventory_quantity > 0)
                  
                  return (
                    <Card key={product.id} className={`${!isAvailable ? 'opacity-50' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {product.format.toUpperCase()}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {product.description}
                              </p>
                              {product.inventory_tracking && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {product.inventory_quantity > 0 ? (
                                    product.inventory_quantity <= 5 ? (
                                      <span className="text-orange-600">
                                        Only {product.inventory_quantity} left
                                      </span>
                                    ) : (
                                      <span className="text-green-600">
                                        In stock
                                      </span>
                                    )
                                  ) : (
                                    <span className="text-red-600">
                                      Out of stock
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900">
                                €{defaultPrice ? (defaultPrice.amount / 100).toFixed(2) : '0.00'}
                              </div>
                            </div>
                            
                            <Button
                              disabled={!isAvailable}
                              className="min-w-[120px]"
                              onClick={() => {
                                // Add to cart functionality
                                fetch('/api/cart/add', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    productId: product.id,
                                    quantity: 1
                                  })
                                }).then(() => {
                                  // Show success message or redirect to cart
                                  window.location.href = '/shop/cart'
                                })
                              }}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Additional Information */}
            <div className="border-t pt-6">
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Free shipping on orders over €50</p>
                <p>• Secure payment processing</p>
                <p>• Digital downloads available immediately</p>
                <p>• Physical items shipped within 2-3 business days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}