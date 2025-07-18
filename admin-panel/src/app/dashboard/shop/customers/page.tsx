'use client'

import { useSession } from '@/lib/use-session'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { 
  UserIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  MapPinIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface Customer {
  id: number
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  created_at: string
  updated_at: string
  total_orders: number
  total_spent: number
  last_order_date?: string
  addresses: {
    id: number
    type: 'billing' | 'shipping'
    address_line_1: string
    address_line_2?: string
    city: string
    state_province?: string
    postal_code: string
    country: string
    is_default: boolean
  }[]
}

export default function CustomersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'total_spent' | 'last_order' | 'created_at'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get unique customers from orders with aggregated data
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          customer_email,
          total_amount,
          created_at,
          billing_address,
          shipping_address
        `)
        .order('created_at', { ascending: false })

      if (ordersError) throw ordersError

      // Get customers table if it exists (not used currently)
      // const { data: customersData, error: customersError } = await supabase
      //   .from('customers')
      //   .select('*')

      // Aggregate customer data from orders
      const customerMap = new Map<string, Customer>()
      
      ordersData?.forEach(order => {
        const email = order.customer_email
        if (!customerMap.has(email)) {
          // Extract name from billing address if available
          const billingAddr = order.billing_address
          const firstName = billingAddr?.first_name || ''
          const lastName = billingAddr?.last_name || ''
          
          customerMap.set(email, {
            id: email.hashCode(), // Generate ID from email
            email,
            first_name: firstName,
            last_name: lastName,
            phone: billingAddr?.phone,
            created_at: order.created_at,
            updated_at: order.created_at,
            total_orders: 0,
            total_spent: 0,
            last_order_date: order.created_at,
            addresses: []
          })
        }
        
        const customer = customerMap.get(email)!
        customer.total_orders += 1
        customer.total_spent += order.total_amount
        
        // Update last order date if this order is newer
        if (new Date(order.created_at) > new Date(customer.last_order_date || '')) {
          customer.last_order_date = order.created_at
        }
        
        // Update created_at if this order is older
        if (new Date(order.created_at) < new Date(customer.created_at)) {
          customer.created_at = order.created_at
        }
        
        // Add unique addresses
        const addresses = [
          order.billing_address && { ...order.billing_address, type: 'billing' as const },
          order.shipping_address && { ...order.shipping_address, type: 'shipping' as const }
        ].filter(Boolean)
        
        addresses.forEach(addr => {
          if (addr && !customer.addresses.some(existing => 
            existing.address_line_1 === addr.address_line_1 && 
            existing.city === addr.city && 
            existing.type === addr.type
          )) {
            customer.addresses.push({
              id: Math.random(), // Generate random ID
              type: addr.type,
              address_line_1: addr.address_line_1 || '',
              address_line_2: addr.address_line_2,
              city: addr.city || '',
              state_province: addr.state_province,
              postal_code: addr.postal_code || '',
              country: addr.country || '',
              is_default: customer.addresses.length === 0
            })
          }
        })
      })

      setCustomers(Array.from(customerMap.values()))
    } catch (err) {
      console.error('Error loading customers:', err)
      setError(err instanceof Error ? err.message : 'Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase()
    return (
      customer.email.toLowerCase().includes(searchLower) ||
      customer.first_name?.toLowerCase().includes(searchLower) ||
      customer.last_name?.toLowerCase().includes(searchLower)
    )
  })

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let aValue: string | number | Date, bValue: string | number | Date
    
    switch (sortBy) {
      case 'name':
        aValue = `${a.first_name || ''} ${a.last_name || ''}`.trim() || a.email
        bValue = `${b.first_name || ''} ${b.last_name || ''}`.trim() || b.email
        break
      case 'email':
        aValue = a.email
        bValue = b.email
        break
      case 'total_spent':
        aValue = a.total_spent
        bValue = b.total_spent
        break
      case 'last_order':
        aValue = new Date(a.last_order_date || 0)
        bValue = new Date(b.last_order_date || 0)
        break
      case 'created_at':
        aValue = new Date(a.created_at)
        bValue = new Date(b.created_at)
        break
      default:
        aValue = a.email
        bValue = b.email
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCustomerDisplayName = (customer: Customer) => {
    if (customer.first_name || customer.last_name) {
      return `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
    }
    return customer.email
  }

  // const formatAddress = (address: CustomerAddress) => {
  //   if (!address) return 'No address'
  //   return `${address.address_line_1}${address.address_line_2 ? `, ${address.address_line_2}` : ''}, ${address.city}, ${address.state_province || ''} ${address.postal_code}, ${address.country}`
  // }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading customers...</div>
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
            <UserIcon className="h-7 w-7 mr-3 text-gray-400" />
            Customers Management
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage customer accounts, addresses, and order history. Customer data is automatically created from orders.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Customers</dt>
                  <dd className="text-lg font-medium text-gray-900">{customers.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatPrice(customers.reduce((sum, c) => sum + c.total_spent, 0))}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingBagIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {customers.reduce((sum, c) => sum + c.total_orders, 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Order Value</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {customers.length > 0 ? formatPrice(
                      customers.reduce((sum, c) => sum + c.total_spent, 0) / 
                      customers.reduce((sum, c) => sum + c.total_orders, 0)
                    ) : '$0.00'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search Customers
          </label>
          <div className="mt-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by name or email..."
            />
          </div>
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
            <option value="email">Email</option>
            <option value="total_spent">Total Spent</option>
            <option value="last_order">Last Order</option>
            <option value="created_at">First Order</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700">
            Order
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
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

      {/* Customers Table */}
      <div className="mt-8">
        <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Addresses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {getCustomerDisplayName(customer)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="text-xs text-gray-400">
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.total_orders}</div>
                    <div className="text-sm text-gray-500">
                      First: {formatDate(customer.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatPrice(customer.total_spent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.last_order_date ? formatDate(customer.last_order_date) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {customer.addresses.length} address{customer.addresses.length !== 1 ? 'es' : ''}
                    </div>
                    {customer.addresses.length > 0 && (
                      <div className="text-xs text-gray-500">
                        <MapPinIcon className="h-3 w-3 inline mr-1" />
                        {customer.addresses[0].city}, {customer.addresses[0].country}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        href={`/dashboard/shop/customers/${customer.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Customer"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                      <a
                        href={`mailto:${customer.email}`}
                        className="text-green-600 hover:text-green-900"
                        title="Send Email"
                      >
                        <EnvelopeIcon className="h-4 w-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {sortedCustomers.length === 0 && !loading && (
        <div className="text-center py-12">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? 'Try adjusting your search criteria.'
              : 'Customers will appear here when orders are placed.'
            }
          </p>
        </div>
      )}
    </div>
  )
}

// Helper function to generate hash code from string
declare global {
  interface String {
    hashCode(): number;
  }
}

String.prototype.hashCode = function() {
  let hash = 0;
  if (this.length === 0) return hash;
  for (let i = 0; i < this.length; i++) {
    const char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};