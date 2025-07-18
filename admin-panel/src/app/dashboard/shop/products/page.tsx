'use client'

import { useSession } from '@/lib/use-session'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import LegacyImageDisplay from '@/components/LegacyImageDisplay'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  ChartBarIcon,
  CubeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface Product {
  id: number
  name: string
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
  releases?: {
    id: number
    title: string
    image_url?: string
    catalog_number?: string
    release_artists: {
      artists: {
        name: string
      }
    }[]
  }
  product_prices: {
    id: number
    amount: number
    currency: string
    active: boolean
    variant_type: string
  }[]
}

export default function ProductsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'archived'>('all')
  const [formatFilter, setFormatFilter] = useState<'all' | 'cd' | 'sacd' | 'vinyl' | 'digital_download'>('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
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
            variant_type
          )
        `)
        .order('sort_order', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error

      setProducts(data || [])
    } catch (err) {
      console.error('Error loading products:', err)
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      setProducts(products.filter(product => product.id !== id))
    } catch (err) {
      console.error('Error deleting product:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete product')
    }
  }

  const toggleProductStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      setProducts(products.map(product => 
        product.id === id ? { ...product, status: newStatus as 'active' | 'inactive' | 'archived' } : product
      ))
    } catch (err) {
      console.error('Error updating product status:', err)
      setError(err instanceof Error ? err.message : 'Failed to update product status')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.releases?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.releases?.catalog_number?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter
    const matchesFormat = formatFilter === 'all' || product.format === formatFilter
    
    return matchesSearch && matchesStatus && matchesFormat
  })

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

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(price / 100)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading products...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Page Title and Actions */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
            <CubeIcon className="h-7 w-7 mr-3 text-gray-400" />
            Products Management
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your product catalog, pricing, and inventory. Products are automatically linked to releases.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/dashboard/shop/products/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search Products
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Search by name, release, or catalog..."
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label htmlFor="format" className="block text-sm font-medium text-gray-700">
            Format
          </label>
          <select
            id="format"
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value as any)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="all">All Formats</option>
            <option value="cd">CD</option>
            <option value="sacd">SACD</option>
            <option value="vinyl">Vinyl</option>
            <option value="digital_download">Digital Download</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={loadProducts}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="mt-8">
        <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Release
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Format
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const primaryPrice = product.product_prices.find(p => p.active) || product.product_prices[0]
                const artistName = product.releases?.release_artists?.[0]?.artists?.name || 'Unknown Artist'
                
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <LegacyImageDisplay
                            src={product.releases?.image_url}
                            alt={product.name}
                            className="h-12 w-12 rounded-md object-cover"
                            fallbackClassName="h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {product.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.releases?.title || 'No Release Linked'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {artistName} • {product.releases?.catalog_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFormatBadge(product.format)}`}>
                        {product.format.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {primaryPrice ? formatPrice(primaryPrice.amount, primaryPrice.currency) : 'No Price'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.inventory_tracking ? (
                        <span className={`inline-flex items-center ${
                          product.inventory_quantity < 10 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          <ChartBarIcon className="h-4 w-4 mr-1" />
                          {product.inventory_quantity}
                        </span>
                      ) : (
                        <span className="text-gray-500">Not tracked</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/dashboard/shop/products/${product.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Product"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/dashboard/shop/products/${product.id}/edit`}
                          className="text-green-600 hover:text-green-900"
                          title="Edit Product"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => toggleProductStatus(product.id, product.status)}
                          className={`${product.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                          title={product.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {product.status === 'active' ? '⏸️' : '▶️'}
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Product"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' || formatFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first product.'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && formatFilter === 'all' && (
            <div className="mt-6">
              <Link
                href="/dashboard/shop/products/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}