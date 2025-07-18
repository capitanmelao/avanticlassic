'use client'

import { useSession } from '@/lib/use-session'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import LegacyImageDisplay from '@/components/LegacyImageDisplay'
import { 
  ChartBarIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  CubeIcon,
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

interface Product {
  id: number
  name: string
  format: 'cd' | 'sacd' | 'vinyl' | 'digital_download'
  status: 'active' | 'inactive' | 'archived'
  inventory_quantity: number
  inventory_tracking: boolean
  sort_order: number
  created_at: string
  updated_at: string
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
  recent_sales?: number
}

export default function InventoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'archived'>('all')
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out' | 'in_stock'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'format' | 'updated'>('stock')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [bulkUpdate, setBulkUpdate] = useState<{ productId: number; quantity: number }[]>([])
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])

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
        .order('inventory_quantity', { ascending: true })

      if (error) throw error

      // Calculate recent sales (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const { data: salesData, error: salesError } = await supabase
        .from('order_items')
        .select(`
          product_id,
          quantity,
          orders!inner(
            created_at
          )
        `)
        .gte('orders.created_at', thirtyDaysAgo.toISOString())

      if (salesError) {
        console.warn('Could not load sales data:', salesError)
      }

      // Aggregate sales by product
      const salesByProduct = new Map<number, number>()
      salesData?.forEach(item => {
        const current = salesByProduct.get(item.product_id) || 0
        salesByProduct.set(item.product_id, current + item.quantity)
      })

      // Add recent sales to products
      const productsWithSales = (data || []).map(product => ({
        ...product,
        recent_sales: salesByProduct.get(product.id) || 0
      }))

      setProducts(productsWithSales)
    } catch (err) {
      console.error('Error loading products:', err)
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  // const updateStock = async (productId: number, newQuantity: number) => {
  //   try {
  //     const { error } = await supabase
  //       .from('products')
  //       .update({ 
  //         inventory_quantity: newQuantity,
  //         updated_at: new Date().toISOString()
  //       })
  //       .eq('id', productId)

  //     if (error) throw error

  //     setProducts(products.map(product => 
  //       product.id === productId 
  //         ? { ...product, inventory_quantity: newQuantity }
  //         : product
  //     ))
  //   } catch (err) {
  //     console.error('Error updating stock:', err)
  //     setError(err instanceof Error ? err.message : 'Failed to update stock')
  //   }
  // }

  const toggleInventoryTracking = async (productId: number, currentTracking: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          inventory_tracking: !currentTracking,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId)

      if (error) throw error

      setProducts(products.map(product => 
        product.id === productId 
          ? { ...product, inventory_tracking: !currentTracking }
          : product
      ))
    } catch (err) {
      console.error('Error updating inventory tracking:', err)
      setError(err instanceof Error ? err.message : 'Failed to update inventory tracking')
    }
  }

  const handleBulkStockUpdate = async () => {
    if (bulkUpdate.length === 0) return

    try {
      const updates = bulkUpdate.map(async ({ productId, quantity }) => {
        const { error } = await supabase
          .from('products')
          .update({ 
            inventory_quantity: quantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', productId)

        if (error) throw error
      })

      await Promise.all(updates)
      setBulkUpdate([])
      setSelectedProducts([])
      loadProducts()
    } catch (err) {
      console.error('Error updating bulk stock:', err)
      setError(err instanceof Error ? err.message : 'Failed to update stock')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.releases?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.releases?.catalog_number?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter
    
    let matchesStock = true
    if (stockFilter === 'low') {
      matchesStock = product.inventory_tracking && product.inventory_quantity < 10
    } else if (stockFilter === 'out') {
      matchesStock = product.inventory_tracking && product.inventory_quantity === 0
    } else if (stockFilter === 'in_stock') {
      matchesStock = product.inventory_tracking && product.inventory_quantity > 0
    }
    
    return matchesSearch && matchesStatus && matchesStock
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue: string | number | Date, bValue: string | number | Date
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'stock':
        aValue = a.inventory_tracking ? a.inventory_quantity : Infinity
        bValue = b.inventory_tracking ? b.inventory_quantity : Infinity
        break
      case 'format':
        aValue = a.format
        bValue = b.format
        break
      case 'updated':
        aValue = new Date(a.updated_at)
        bValue = new Date(b.updated_at)
        break
      default:
        aValue = a.name
        bValue = b.name
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const getStockStatus = (product: Product) => {
    if (!product.inventory_tracking) return 'not_tracked'
    if (product.inventory_quantity === 0) return 'out'
    if (product.inventory_quantity < 10) return 'low'
    return 'good'
  }

  const getStockBadge = (product: Product) => {
    const status = getStockStatus(product)
    const badges = {
      not_tracked: 'bg-gray-100 text-gray-800',
      out: 'bg-red-100 text-red-800',
      low: 'bg-yellow-100 text-yellow-800',
      good: 'bg-green-100 text-green-800'
    }
    return badges[status]
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

  // const formatPrice = (price: number, currency: string) => {
  //   return new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: currency,
  //     minimumFractionDigits: 2
  //   }).format(price / 100)
  // }

  const lowStockCount = products.filter(p => p.inventory_tracking && p.inventory_quantity < 10).length
  const outOfStockCount = products.filter(p => p.inventory_tracking && p.inventory_quantity === 0).length
  const trackedProducts = products.filter(p => p.inventory_tracking).length

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading inventory...</div>
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

      {/* Page Title */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
            <ChartBarIcon className="h-7 w-7 mr-3 text-gray-400" />
            Inventory Management
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Monitor stock levels, track inventory, and manage product availability.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CubeIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                  <dd className="text-lg font-medium text-gray-900">{products.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tracked Products</dt>
                  <dd className="text-lg font-medium text-gray-900">{trackedProducts}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Low Stock</dt>
                  <dd className="text-lg font-medium text-gray-900">{lowStockCount}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Out of Stock</dt>
                  <dd className="text-lg font-medium text-gray-900">{outOfStockCount}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-6">
        <div className="sm:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search Products
          </label>
          <div className="mt-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
            Stock Level
          </label>
          <select
            id="stock"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as typeof stockFilter)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="all">All Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
            <option value="in_stock">In Stock</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">
            Sort By
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="name">Name</option>
            <option value="stock">Stock Level</option>
            <option value="format">Format</option>
            <option value="updated">Last Updated</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {sortOrder === 'asc' ? (
              <ArrowUpIcon className="h-4 w-4" />
            ) : (
              <ArrowDownIcon className="h-4 w-4" />
            )}
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

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-blue-800">
              {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedProducts([])}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                Clear Selection
              </button>
              <button
                onClick={handleBulkStockUpdate}
                disabled={bulkUpdate.length === 0}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                Update Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="mt-8">
        <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === sortedProducts.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts(sortedProducts.map(p => p.id))
                      } else {
                        setSelectedProducts([])
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Format
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recent Sales
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
              {sortedProducts.map((product) => {
                // const primaryPrice = product.product_prices.find(p => p.active) || product.product_prices[0]
                const artistName = product.releases?.release_artists?.[0]?.artists?.name || 'Unknown Artist'
                const stockStatus = getStockStatus(product)
                
                return (
                  <tr key={product.id} className={`hover:bg-gray-50 ${stockStatus === 'out' ? 'bg-red-50' : stockStatus === 'low' ? 'bg-yellow-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts([...selectedProducts, product.id])
                          } else {
                            setSelectedProducts(selectedProducts.filter(id => id !== product.id))
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
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
                            {artistName} • {product.releases?.catalog_number}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFormatBadge(product.format)}`}>
                        {product.format.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {product.inventory_tracking ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={bulkUpdate.find(u => u.productId === product.id)?.quantity ?? product.inventory_quantity}
                              onChange={(e) => {
                                const quantity = parseInt(e.target.value) || 0
                                setBulkUpdate(prev => {
                                  const existing = prev.find(u => u.productId === product.id)
                                  if (existing) {
                                    return prev.map(u => u.productId === product.id ? { ...u, quantity } : u)
                                  } else {
                                    return [...prev, { productId: product.id, quantity }]
                                  }
                                })
                              }}
                              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockBadge(product)}`}>
                              {stockStatus === 'out' ? 'Out' : stockStatus === 'low' ? 'Low' : 'Good'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">Not tracked</span>
                        )}
                        <button
                          onClick={() => toggleInventoryTracking(product.id, product.inventory_tracking)}
                          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${
                            product.inventory_tracking 
                              ? 'text-green-700 bg-green-100 hover:bg-green-200' 
                              : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                          }`}
                          title={product.inventory_tracking ? 'Disable tracking' : 'Enable tracking'}
                        >
                          {product.inventory_tracking ? <CheckCircleIcon className="h-3 w-3" /> : <XCircleIcon className="h-3 w-3" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.recent_sales || 0} sold
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === 'active' ? 'bg-green-100 text-green-800' : 
                        product.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
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
      {sortedProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' || stockFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Products will appear here when they are created.'
            }
          </p>
        </div>
      )}
    </div>
  )
}