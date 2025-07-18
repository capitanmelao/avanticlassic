'use client'

import { useSession } from '@/lib/use-session'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import LegacyImageDisplay from '@/components/LegacyImageDisplay'
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  CubeIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface ProductPrice {
  id: number
  amount: number
  currency: string
  active: boolean
  variant_type: string
  type: 'one_time' | 'recurring'
  created_at: string
}

interface Product {
  id: number
  name: string
  description?: string
  type: 'physical' | 'digital'
  format: 'cd' | 'sacd' | 'vinyl' | 'digital_download'
  status: 'active' | 'inactive' | 'archived'
  featured: boolean
  inventory_quantity: number
  inventory_tracking: boolean
  sort_order: number
  created_at: string
  updated_at: string
  release_id?: number
  images: string[]
  metadata?: Record<string, unknown>
  releases?: {
    id: number
    title: string
    image_url?: string
    catalog_number?: string
    description?: string
    release_date?: string
    release_artists: {
      artists: {
        name: string
      }
    }[]
  }
  product_prices: ProductPrice[]
}

export default function ProductDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (params.id) {
      loadProduct()
    }
  }, [params.id, loadProduct])

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          releases!left(
            id,
            title,
            image_url,
            catalog_number,
            description,
            release_date,
            release_artists!inner(
              artists!inner(
                name
              )
            )
          ),
          product_prices!left(
            id,
            amount,
            currency,
            active,
            variant_type,
            type,
            created_at
          )
        `)
        .eq('id', params.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          setError('Product not found')
        } else {
          throw error
        }
      } else {
        setProduct(data)
      }
    } catch (err) {
      console.error('Error loading product:', err)
      setError(err instanceof Error ? err.message : 'Failed to load product')
    } finally {
      setLoading(false)
    }
  }, [params.id])

  const deleteProduct = async () => {
    if (!product || !confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id)

      if (error) throw error

      router.push('/dashboard/shop/products')
    } catch (err) {
      console.error('Error deleting product:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete product')
    }
  }

  const toggleProductStatus = async () => {
    if (!product) return

    const newStatus = product.status === 'active' ? 'inactive' : 'active'
    
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('id', product.id)

      if (error) throw error

      setProduct({ ...product, status: newStatus })
    } catch (err) {
      console.error('Error updating product status:', err)
      setError(err instanceof Error ? err.message : 'Failed to update product status')
    }
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(price / 100)
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      archived: 'bg-red-100 text-red-800'
    }
    return badges[status as keyof typeof badges] || badges.inactive
  }

  const getFormatBadge = (format: string) => {
    const badges = {
      cd: 'bg-blue-100 text-blue-800',
      sacd: 'bg-purple-100 text-purple-800',
      vinyl: 'bg-amber-100 text-amber-800',
      digital_download: 'bg-green-100 text-green-800'
    }
    return badges[format as keyof typeof badges] || badges.cd
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading product...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Link
            href="/dashboard/shop/products"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Product not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The product you&apos;re looking for doesn&apos;t exist or has been deleted.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/shop/products"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const artistName = product.releases?.release_artists?.[0]?.artists?.name || 'Unknown Artist'
  const activePrices = product.product_prices.filter(price => price.active)
  // const primaryPrice = activePrices[0] || product.product_prices[0]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/shop/products"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
      </div>

      {/* Product Header */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-16 w-16 mr-4">
                <LegacyImageDisplay
                  src={product.releases?.image_url || product.images[0]}
                  alt={product.name}
                  className="h-16 w-16 rounded-lg object-cover"
                  fallbackClassName="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Product ID: {product.id}
                </p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(product.status)}`}>
                    {product.status}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFormatBadge(product.format)}`}>
                    {product.format.toUpperCase()}
                  </span>
                  {product.featured && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleProductStatus}
                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${
                  product.status === 'active'
                    ? 'text-red-700 bg-red-100 hover:bg-red-200'
                    : 'text-green-700 bg-green-100 hover:bg-green-200'
                }`}
              >
                {product.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
              <Link
                href={`/dashboard/shop/products/${product.id}/edit`}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit
              </Link>
              <button
                onClick={deleteProduct}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column - Product Information */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Product Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Basic product details and configuration
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Product Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{product.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{product.type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Format</dt>
                <dd className="mt-1 text-sm text-gray-900">{product.format.toUpperCase()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{product.status}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(product.created_at).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(product.updated_at).toLocaleDateString()}
                </dd>
              </div>
              {product.description && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{product.description}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Right Column - Release Information */}
        {product.releases && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Linked Release</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Associated release information
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Release Title</dt>
                  <dd className="mt-1 text-sm text-gray-900">{product.releases.title}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Artist</dt>
                  <dd className="mt-1 text-sm text-gray-900">{artistName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Catalog Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{product.releases.catalog_number || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Release Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {product.releases.release_date 
                      ? new Date(product.releases.release_date).toLocaleDateString()
                      : 'N/A'
                    }
                  </dd>
                </div>
                {product.releases.description && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Release Description</dt>
                    <dd className="mt-1 text-sm text-gray-900">{product.releases.description}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        )}
      </div>

      {/* Pricing Information */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Pricing</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Product pricing and variants
          </p>
        </div>
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {product.product_prices.map((price) => (
                  <tr key={price.id} className={price.active ? 'bg-green-50' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {price.variant_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(price.amount, price.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {price.type.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        price.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {price.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(price.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Inventory Information */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Inventory</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Stock levels and inventory tracking
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Inventory Tracking</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.inventory_tracking ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {product.inventory_tracking ? 'Enabled' : 'Disabled'}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Current Stock</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {product.inventory_tracking ? (
                  <span className={`inline-flex items-center font-medium ${
                    product.inventory_quantity < 10 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    <ChartBarIcon className="h-4 w-4 mr-1" />
                    {product.inventory_quantity} units
                  </span>
                ) : (
                  <span className="text-gray-500">Not tracked</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Sort Order</dt>
              <dd className="mt-1 text-sm text-gray-900">{product.sort_order}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}