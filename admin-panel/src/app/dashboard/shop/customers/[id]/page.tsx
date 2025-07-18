'use client'

import { useSession } from '@/lib/use-session'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  EyeIcon,
  PencilIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'

interface CustomerAddress {
  id: number
  type: 'billing' | 'shipping'
  address_line_1: string
  address_line_2?: string
  city: string
  state_province?: string
  postal_code: string
  country: string
  is_default: boolean
}

interface CustomerOrder {
  id: number
  order_number: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
  total_amount: number
  created_at: string
  order_items: {
    id: number
    product_name: string
    quantity: number
    unit_amount: number
  }[]
}

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
  addresses: CustomerAddress[]
  orders: CustomerOrder[]
}

export default function CustomerDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingAddress, setEditingAddress] = useState<number | null>(null)
  const [editingNotes, setEditingNotes] = useState(false)
  const [customerNotes, setCustomerNotes] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (params.id) {
      loadCustomer()
    }
  }, [params.id])

  const loadCustomer = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get customer orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            id,
            product_name,
            quantity,
            unit_amount
          )
        `)
        .order('created_at', { ascending: false })

      if (ordersError) throw ordersError

      // Find customer by ID (email hash)
      const targetCustomerId = parseInt(params.id as string)
      let customerEmail = ''
      
      // Find the email that matches the hash
      for (const order of ordersData || []) {
        if (order.customer_email.hashCode() === targetCustomerId) {
          customerEmail = order.customer_email
          break
        }
      }

      if (!customerEmail) {
        setError('Customer not found')
        return
      }

      // Filter orders for this customer
      const customerOrders = ordersData?.filter(order => 
        order.customer_email === customerEmail
      ) || []

      if (customerOrders.length === 0) {
        setError('Customer not found')
        return
      }

      // Build customer data from orders
      const firstOrder = customerOrders[customerOrders.length - 1]
      const lastOrder = customerOrders[0]
      const billingAddr = firstOrder.billing_address
      
      const customerData: Customer = {
        id: targetCustomerId,
        email: customerEmail,
        first_name: billingAddr?.first_name || '',
        last_name: billingAddr?.last_name || '',
        phone: billingAddr?.phone || '',
        created_at: firstOrder.created_at,
        updated_at: lastOrder.created_at,
        total_orders: customerOrders.length,
        total_spent: customerOrders.reduce((sum, order) => sum + order.total_amount, 0),
        last_order_date: lastOrder.created_at,
        addresses: [],
        orders: customerOrders.map(order => ({
          id: order.id,
          order_number: order.order_number,
          status: order.status,
          payment_status: order.payment_status,
          total_amount: order.total_amount,
          created_at: order.created_at,
          order_items: order.order_items || []
        }))
      }

      // Extract unique addresses
      const addressMap = new Map<string, CustomerAddress>()
      customerOrders.forEach(order => {
        const addresses = [
          order.billing_address && { ...order.billing_address, type: 'billing' as const },
          order.shipping_address && { ...order.shipping_address, type: 'shipping' as const }
        ].filter(Boolean)

        addresses.forEach(addr => {
          if (addr) {
            const key = `${addr.type}-${addr.address_line_1}-${addr.city}-${addr.postal_code}`
            if (!addressMap.has(key)) {
              addressMap.set(key, {
                id: Math.random(),
                type: addr.type,
                address_line_1: addr.address_line_1 || '',
                address_line_2: addr.address_line_2,
                city: addr.city || '',
                state_province: addr.state_province,
                postal_code: addr.postal_code || '',
                country: addr.country || '',
                is_default: addressMap.size === 0
              })
            }
          }
        })
      })

      customerData.addresses = Array.from(addressMap.values())
      setCustomer(customerData)
    } catch (err) {
      console.error('Error loading customer:', err)
      setError(err instanceof Error ? err.message : 'Failed to load customer')
    } finally {
      setLoading(false)
    }
  }

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAddress = (address: CustomerAddress) => {
    return `${address.address_line_1}${address.address_line_2 ? `, ${address.address_line_2}` : ''}, ${address.city}, ${address.state_province || ''} ${address.postal_code}, ${address.country}`
  }

  const getStatusBadge = (status: string, type: 'order' | 'payment') => {
    const badges = {
      order: {
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        shipped: 'bg-purple-100 text-purple-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
        refunded: 'bg-gray-100 text-gray-800'
      },
      payment: {
        pending: 'bg-yellow-100 text-yellow-800',
        paid: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800',
        refunded: 'bg-gray-100 text-gray-800',
        partially_refunded: 'bg-orange-100 text-orange-800'
      }
    }
    return badges[type][status as keyof typeof badges[typeof type]] || 'bg-gray-100 text-gray-800'
  }

  const getCustomerDisplayName = (customer: Customer) => {
    if (customer.first_name || customer.last_name) {
      return `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
    }
    return customer.email
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading customer...</div>
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
            href="/dashboard/shop/customers"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Customers
          </Link>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Customer not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The customer you're looking for doesn't exist or has been deleted.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/shop/customers"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Customers
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/shop/customers"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Customers
        </Link>
      </div>

      {/* Customer Header */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-16 w-16 mr-4">
                <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-gray-600" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{getCustomerDisplayName(customer)}</h1>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Customer since {formatDate(customer.created_at)}
                </p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {customer.total_orders} orders
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {formatPrice(customer.total_spent)} spent
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <a
                href={`mailto:${customer.email}`}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                Email Customer
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Details Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Contact Information</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    Email
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{customer.email}</dd>
                </div>
                {customer.phone && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      Phone
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{customer.phone}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Customer Since
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(customer.created_at)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Last Order
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {customer.last_order_date ? formatDate(customer.last_order_date) : 'No orders'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Order Statistics */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Order Statistics</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <ShoppingBagIcon className="h-4 w-4 mr-2" />
                    Total Orders
                  </dt>
                  <dd className="mt-1 text-2xl font-bold text-gray-900">{customer.total_orders}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                    Total Spent
                  </dt>
                  <dd className="mt-1 text-2xl font-bold text-gray-900">{formatPrice(customer.total_spent)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Average Order Value
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900">
                    {customer.total_orders > 0 ? formatPrice(customer.total_spent / customer.total_orders) : '$0.00'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Total Items Purchased
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900">
                    {customer.orders.reduce((sum, order) => 
                      sum + order.order_items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer Addresses */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Addresses</h3>
            </div>
            <div className="border-t border-gray-200">
              {customer.addresses.length > 0 ? (
                <div className="px-4 py-5 sm:px-6 space-y-4">
                  {customer.addresses.map((address) => (
                    <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {address.type} Address
                          </span>
                          {address.is_default && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{formatAddress(address)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
                  No addresses available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Order History</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Complete history of customer orders
          </p>
        </div>
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customer.orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.order_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status, 'order')}`}>
                          {order.status}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.payment_status, 'payment')}`}>
                          {order.payment_status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(order.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/dashboard/shop/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Order"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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