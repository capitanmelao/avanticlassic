'use client'

import { useSession } from '@/lib/use-session'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { 
  ClipboardDocumentListIcon,
  EyeIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'

interface Order {
  id: number
  order_number: string
  customer_email: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
  fulfillment_status: 'unfulfilled' | 'partial' | 'fulfilled'
  total_amount: number
  subtotal_amount: number
  tax_amount: number
  shipping_amount: number
  currency: string
  tracking_number?: string
  tracking_url?: string
  shipped_at?: string
  delivered_at?: string
  created_at: string
  updated_at: string
  billing_address?: Record<string, unknown>
  shipping_address?: Record<string, unknown>
  customer_notes?: string
  notes?: string
  stripe_checkout_session_id?: string
  stripe_payment_intent_id?: string
  order_items: {
    id: number
    product_name: string
    product_format: string
    quantity: number
    unit_amount: number
    total_amount: number
  }[]
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'>('all')
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'>('all')
  const [fulfillmentFilter, setFulfillmentFilter] = useState<'all' | 'unfulfilled' | 'partial' | 'fulfilled'>('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            id,
            product_name,
            product_format,
            quantity,
            unit_amount,
            total_amount
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setOrders(data || [])
    } catch (err) {
      console.error('Error loading orders:', err)
      setError(err instanceof Error ? err.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: number, field: string, value: string) => {
    try {
      const updates: Record<string, string> = { [field]: value }
      
      // Auto-update related fields
      if (field === 'fulfillment_status' && value === 'fulfilled') {
        updates.status = 'delivered'
        updates.delivered_at = new Date().toISOString()
      } else if (field === 'status' && value === 'shipped') {
        updates.fulfillment_status = 'partial'
        updates.shipped_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId)

      if (error) throw error

      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, ...updates } : order
      ))
    } catch (err) {
      console.error('Error updating order:', err)
      setError(err instanceof Error ? err.message : 'Failed to update order')
    }
  }

  const updateTrackingInfo = async (orderId: number, trackingNumber: string, trackingUrl?: string) => {
    try {
      const updates = {
        tracking_number: trackingNumber,
        tracking_url: trackingUrl,
        status: 'shipped',
        fulfillment_status: 'partial',
        shipped_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId)

      if (error) throw error

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, ...updates } : order
      ))
    } catch (err) {
      console.error('Error updating tracking info:', err)
      setError(err instanceof Error ? err.message : 'Failed to update tracking info')
    }
  }

  const syncStripePaymentStatus = async (orderId: number, stripeSessionId?: string) => {
    try {
      if (!stripeSessionId) {
        setError('No Stripe session ID found for this order')
        return
      }

      const response = await fetch(`/api/checkout?session_id=${stripeSessionId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch Stripe session data')
      }

      const { session } = await response.json()
      
      const updates = {
        payment_status: session.payment_status === 'paid' ? 'paid' : session.payment_status,
        status: session.payment_status === 'paid' && orders.find(o => o.id === orderId)?.status === 'pending' ? 'processing' : undefined
      }

      // Remove undefined values
      Object.keys(updates).forEach(key => 
        updates[key as keyof typeof updates] === undefined && delete updates[key as keyof typeof updates]
      )

      if (Object.keys(updates).length > 0) {
        const { error } = await supabase
          .from('orders')
          .update(updates)
          .eq('id', orderId)

        if (error) throw error

        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, ...updates } : order
        ))
      }
    } catch (err) {
      console.error('Error syncing Stripe payment status:', err)
      setError(err instanceof Error ? err.message : 'Failed to sync payment status')
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesPayment = paymentFilter === 'all' || order.payment_status === paymentFilter
    const matchesFulfillment = fulfillmentFilter === 'all' || order.fulfillment_status === fulfillmentFilter
    
    return matchesSearch && matchesStatus && matchesPayment && matchesFulfillment
  })

  const getStatusBadge = (status: string, type: 'order' | 'payment' | 'fulfillment') => {
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
      },
      fulfillment: {
        unfulfilled: 'bg-gray-100 text-gray-800',
        partial: 'bg-yellow-100 text-yellow-800',
        fulfilled: 'bg-green-100 text-green-800'
      }
    }
    return badges[type][status as keyof typeof badges[typeof type]] || 'bg-gray-100 text-gray-800'
  }

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading orders...</div>
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
            <ClipboardDocumentListIcon className="h-7 w-7 mr-3 text-gray-400" />
            Orders Management
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Track and manage customer orders, shipping, and fulfillment status.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-5">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search Orders
          </label>
          <div className="mt-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Order #, email, tracking..."
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Order Status
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <div>
          <label htmlFor="payment" className="block text-sm font-medium text-gray-700">
            Payment Status
          </label>
          <select
            id="payment"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value as typeof paymentFilter)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="all">All Payment</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
            <option value="partially_refunded">Partially Refunded</option>
          </select>
        </div>

        <div>
          <label htmlFor="fulfillment" className="block text-sm font-medium text-gray-700">
            Fulfillment
          </label>
          <select
            id="fulfillment"
            value={fulfillmentFilter}
            onChange={(e) => setFulfillmentFilter(e.target.value as typeof fulfillmentFilter)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="all">All Fulfillment</option>
            <option value="unfulfilled">Unfulfilled</option>
            <option value="partial">Partial</option>
            <option value="fulfilled">Fulfilled</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={loadOrders}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
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

      {/* Orders Table */}
      <div className="mt-8">
        <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fulfillment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{order.order_number}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
                    </div>
                    {order.tracking_number && (
                      <div className="text-xs text-blue-600">
                        Tracking: {order.tracking_number}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.customer_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status, 'order')}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.payment_status, 'payment')}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.fulfillment_status, 'fulfillment')}`}>
                      {order.fulfillment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatPrice(order.total_amount, order.currency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        href={`/dashboard/shop/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Order"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                      {order.tracking_url && (
                        <a
                          href={order.tracking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-900"
                          title="Track Package"
                        >
                          <TruckIcon className="h-4 w-4" />
                        </a>
                      )}
                      {order.stripe_checkout_session_id && (
                        <button
                          onClick={() => syncStripePaymentStatus(order.id, order.stripe_checkout_session_id)}
                          className="text-green-600 hover:text-green-900"
                          title="Sync Payment Status"
                        >
                          <ArrowPathIcon className="h-4 w-4" />
                        </button>
                      )}
                      {order.stripe_payment_intent_id && (
                        <a
                          href={`https://dashboard.stripe.com/payments/${order.stripe_payment_intent_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View in Stripe Dashboard"
                        >
                          <CreditCardIcon className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && !loading && (
        <div className="text-center py-12">
          <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all' || fulfillmentFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Orders will appear here when customers make purchases.'
            }
          </p>
        </div>
      )}
    </div>
  )
}