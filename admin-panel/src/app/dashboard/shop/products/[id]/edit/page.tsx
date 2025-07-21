'use client'

import { useSession } from '@/lib/use-session'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'
import { 
  ArrowLeftIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface Release {
  id: number
  title: string
  image_url?: string
  catalog_number?: string
  release_artists: {
    artists: {
      name: string
    }[]
  }[]
}

interface ProductPrice {
  id: number
  amount: number
  currency: string
  variant_type: string
  type: 'one_time' | 'recurring'
  active: boolean
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
  product_prices: ProductPrice[]
}

interface Override {
  enabled: boolean
  amount?: number
}

interface ProductMetadata {
  shipping_override?: Override
  tax_override?: Override
  [key: string]: unknown
}

interface ProductForm {
  name: string
  description: string
  type: 'physical' | 'digital'
  format: 'cd' | 'sacd' | 'vinyl' | 'digital_download'
  status: 'active' | 'inactive' | 'archived'
  featured: boolean
  inventory_tracking: boolean
  inventory_quantity: number
  release_id: number | null
  images: string[]
  metadata: ProductMetadata
  prices: {
    id?: number
    amount: number
    currency: string
    variant_type: string
    type: 'one_time' | 'recurring'
    active: boolean
  }[]
}

export default function EditProductPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    type: 'physical',
    format: 'cd',
    status: 'active',
    featured: false,
    inventory_tracking: true,
    inventory_quantity: 0,
    release_id: null,
    images: [],
    metadata: {},
    prices: []
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_prices(
            id,
            amount,
            currency,
            variant_type,
            type,
            active,
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
        // Convert product data to form format
        setFormData({
          name: data.name || '',
          description: data.description || '',
          type: data.type,
          format: data.format,
          status: data.status,
          featured: data.featured || false,
          inventory_tracking: data.inventory_tracking || false,
          inventory_quantity: data.inventory_quantity || 0,
          release_id: data.release_id || null,
          images: data.images || [],
          metadata: data.metadata || {},
          prices: data.product_prices.map((price: ProductPrice) => ({
            id: price.id,
            amount: price.amount / 100, // Convert from cents
            currency: price.currency,
            variant_type: price.variant_type,
            type: price.type,
            active: price.active
          }))
        })
      }
    } catch (err) {
      console.error('Error loading product:', err)
      setError(err instanceof Error ? err.message : 'Failed to load product')
    } finally {
      setLoading(false)
    }
  }, [params.id])

  const loadReleases = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('releases')
        .select(`
          id,
          title,
          image_url,
          catalog_number,
          release_artists!inner(
            artists!inner(name)
          )
        `)
        .order('title', { ascending: true })

      if (error) throw error
      setReleases(data || [])
    } catch (err) {
      console.error('Error loading releases:', err)
      setError('Failed to load releases')
    }
  }, [])

  useEffect(() => {
    if (params.id) {
      loadProduct()
      loadReleases()
    }
  }, [params.id, loadProduct, loadReleases])

  const handleInputChange = (field: keyof ProductForm, value: string | number | boolean | null | ProductMetadata) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePriceChange = (index: number, field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      prices: prev.prices.map((price, i) => 
        i === index ? { ...price, [field]: value } : price
      )
    }))
  }

  const addPrice = () => {
    setFormData(prev => ({
      ...prev,
      prices: [...prev.prices, {
        amount: 0,
        currency: 'USD',
        variant_type: 'default',
        type: 'one_time',
        active: true
      }]
    }))
  }

  const removePrice = (index: number) => {
    if (formData.prices.length > 1) {
      setFormData(prev => ({
        ...prev,
        prices: prev.prices.filter((_, i) => i !== index)
      }))
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleImageUpload = (imageUrl: string, _path: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageUrl]
    }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return
    
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      // Update product
      const { error: productError } = await supabase
        .from('products')
        .update({
          name: formData.name,
          description: formData.description,
          type: formData.type,
          format: formData.format,
          status: formData.status,
          featured: formData.featured,
          inventory_tracking: formData.inventory_tracking,
          inventory_quantity: formData.inventory_quantity,
          release_id: formData.release_id,
          images: formData.images,
          metadata: formData.metadata,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id)

      if (productError) throw productError

      // Handle product prices
      const existingPriceIds = formData.prices.filter(p => p.id).map(p => p.id)
      const currentPriceIds = product.product_prices.map(p => p.id)
      
      // Delete removed prices
      const pricesToDelete = currentPriceIds.filter(id => !existingPriceIds.includes(id))
      if (pricesToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('product_prices')
          .delete()
          .in('id', pricesToDelete)

        if (deleteError) throw deleteError
      }

      // Update existing prices and create new ones
      for (const price of formData.prices) {
        const priceData = {
          product_id: product.id,
          amount: Math.round(price.amount * 100), // Convert to cents
          currency: price.currency,
          variant_type: price.variant_type,
          type: price.type,
          active: price.active
        }

        if (price.id) {
          // Update existing price
          const { error: updateError } = await supabase
            .from('product_prices')
            .update(priceData)
            .eq('id', price.id)

          if (updateError) throw updateError
        } else {
          // Create new price
          const { error: insertError } = await supabase
            .from('product_prices')
            .insert(priceData)

          if (insertError) throw insertError
        }
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard/shop/products')
      }, 2000)

    } catch (err) {
      console.error('Error updating product:', err)
      setError(err instanceof Error ? err.message : 'Failed to update product')
    } finally {
      setSaving(false)
    }
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
          <CubeIcon className="h-7 w-7 mr-3 text-gray-400" />
          Edit Product: {product.name}
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Update product information, pricing, and inventory settings.
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <div className="text-sm text-green-800">
                Product updated successfully! Redirecting to products list...
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Basic Information</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter product name"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type *
                </label>
                <select
                  id="type"
                  required
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="physical">Physical</option>
                  <option value="digital">Digital</option>
                </select>
              </div>

              <div>
                <label htmlFor="format" className="block text-sm font-medium text-gray-700">
                  Format *
                </label>
                <select
                  id="format"
                  required
                  value={formData.format}
                  onChange={(e) => handleInputChange('format', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="cd">CD</option>
                  <option value="sacd">SACD</option>
                  <option value="vinyl">Vinyl</option>
                  <option value="digital_download">Digital Download</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status *
                </label>
                <select
                  id="status"
                  required
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label htmlFor="release_id" className="block text-sm font-medium text-gray-700">
                  Linked Release
                </label>
                <select
                  id="release_id"
                  value={formData.release_id || ''}
                  onChange={(e) => handleInputChange('release_id', e.target.value ? parseInt(e.target.value) : null)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select a release (optional)</option>
                  {releases.map((release) => (
                    <option key={release.id} value={release.id}>
                      {release.title} - {release.release_artists?.[0]?.artists?.[0]?.name || 'Unknown Artist'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center">
                  <input
                    id="featured"
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                    Featured Product
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Inventory</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <div className="flex items-center">
                  <input
                    id="inventory_tracking"
                    type="checkbox"
                    checked={formData.inventory_tracking}
                    onChange={(e) => handleInputChange('inventory_tracking', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="inventory_tracking" className="ml-2 block text-sm text-gray-900">
                    Track inventory quantity
                  </label>
                </div>
              </div>

              {formData.inventory_tracking && (
                <div>
                  <label htmlFor="inventory_quantity" className="block text-sm font-medium text-gray-700">
                    Current Quantity
                  </label>
                  <input
                    type="number"
                    id="inventory_quantity"
                    min="0"
                    value={formData.inventory_quantity}
                    onChange={(e) => handleInputChange('inventory_quantity', parseInt(e.target.value) || 0)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Pricing</h3>
              <button
                type="button"
                onClick={addPrice}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Add Price Variant
              </button>
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="space-y-6">
              {formData.prices.map((price, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-medium text-gray-900">
                      Price Variant {index + 1}
                      {price.id && <span className="text-gray-500 ml-2">(ID: {price.id})</span>}
                    </h4>
                    {formData.prices.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePrice(index)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Amount *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={price.amount}
                        onChange={(e) => handlePriceChange(index, 'amount', parseFloat(e.target.value) || 0)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Currency
                      </label>
                      <select
                        value={price.currency}
                        onChange={(e) => handlePriceChange(index, 'currency', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Variant Type
                      </label>
                      <input
                        type="text"
                        value={price.variant_type}
                        onChange={(e) => handlePriceChange(index, 'variant_type', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g., default, bulk, wholesale"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={price.active}
                        onChange={(e) => handlePriceChange(index, 'active', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Active
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tax & Shipping Overrides */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Tax & Shipping Overrides</h3>
            <p className="mt-1 text-sm text-gray-500">
              Override default tax and shipping calculations for this product. Leave disabled to use site defaults.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              {/* Shipping Override */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="shipping_override_enabled"
                    type="checkbox"
                    checked={formData.metadata.shipping_override?.enabled || false}
                    onChange={(e) => {
                      const newMetadata = {
                        ...formData.metadata,
                        shipping_override: {
                          ...formData.metadata.shipping_override,
                          enabled: e.target.checked
                        }
                      }
                      handleInputChange('metadata', newMetadata)
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="shipping_override_enabled" className="ml-2 block text-sm text-gray-900">
                    Override shipping cost
                  </label>
                </div>
                
                {formData.metadata.shipping_override?.enabled && (
                  <div>
                    <label htmlFor="shipping_amount" className="block text-sm font-medium text-gray-700">
                      Shipping Amount (€)
                    </label>
                    <input
                      type="number"
                      id="shipping_amount"
                      step="0.01"
                      min="0"
                      value={((formData.metadata.shipping_override?.amount || 0) / 100).toFixed(2)}
                      onChange={(e) => {
                        const amount = Math.round(parseFloat(e.target.value || '0') * 100)
                        const newMetadata = {
                          ...formData.metadata,
                          shipping_override: {
                            ...formData.metadata.shipping_override,
                            amount: amount
                          }
                        }
                        handleInputChange('metadata', newMetadata)
                      }}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="0.00"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Set to 0.00 for free shipping on this product
                    </p>
                  </div>
                )}
              </div>

              {/* Tax Override */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="tax_override_enabled"
                    type="checkbox"
                    checked={formData.metadata.tax_override?.enabled || false}
                    onChange={(e) => {
                      const newMetadata = {
                        ...formData.metadata,
                        tax_override: {
                          ...formData.metadata.tax_override,
                          enabled: e.target.checked
                        }
                      }
                      handleInputChange('metadata', newMetadata)
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="tax_override_enabled" className="ml-2 block text-sm text-gray-900">
                    Override tax/VAT
                  </label>
                </div>
                
                {formData.metadata.tax_override?.enabled && (
                  <div>
                    <label htmlFor="tax_amount" className="block text-sm font-medium text-gray-700">
                      Tax Amount (€)
                    </label>
                    <input
                      type="number"
                      id="tax_amount"
                      step="0.01"
                      min="0"
                      value={((formData.metadata.tax_override?.amount || 0) / 100).toFixed(2)}
                      onChange={(e) => {
                        const amount = Math.round(parseFloat(e.target.value || '0') * 100)
                        const newMetadata = {
                          ...formData.metadata,
                          tax_override: {
                            ...formData.metadata.tax_override,
                            amount: amount
                          }
                        }
                        handleInputChange('metadata', newMetadata)
                      }}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="0.00"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Set to 0.00 for tax-free on this product
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Product Images</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="space-y-4">
              <ImageUpload
                bucket="images"
                folder="products"
                onUploadSuccess={handleImageUpload}
                className="w-full"
                label="Product Images"
              />
              
              {formData.images.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Current Images</h4>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Product image ${index + 1}`}
                          className="h-24 w-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center hover:bg-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <Link
            href="/dashboard/shop/products"
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}