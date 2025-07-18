'use client'

import { useSession } from '@/lib/use-session'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  ClipboardDocumentListIcon,
  TruckIcon,
  CreditCardIcon,
  CalendarIcon,
  PencilIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface OrderItem {
  id: number
  product_name: string
  product_format: string
  quantity: number
  unit_amount: number
  total_amount: number
  tax_amount: number
  discount_amount: number
  fulfillment_status: 'unfulfilled' | 'fulfilled' | 'returned'
  fulfilled_at?: string
}

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
  discount_amount: number
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
  shipping_method?: string
  payment_method_types: string[]
  order_items: OrderItem[]
}

export default function OrderDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingTracking, setEditingTracking] = useState(false)
  const [editingNotes, setEditingNotes] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingUrl, setTrackingUrl] = useState('')
  const [adminNotes, setAdminNotes] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (params.id) {
      loadOrder()
    }
  }, [params.id, loadOrder])

  const loadOrder = useCallback(async () => {
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
            total_amount,
            tax_amount,
            discount_amount,
            fulfillment_status,
            fulfilled_at
          )
        `)
        .eq('id', params.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          setError('Order not found')
        } else {
          throw error
        }
      } else {
        setOrder(data)
        setTrackingNumber(data.tracking_number || '')
        setTrackingUrl(data.tracking_url || '')
        setAdminNotes(data.notes || '')
      }
    } catch (err) {
      console.error('Error loading order:', err)
      setError(err instanceof Error ? err.message : 'Failed to load order')
    } finally {
      setLoading(false)
    }
  }, [params.id])

  // const updateOrderStatus = async (field: string, value: string) => {
  //   if (!order) return

  //   try {
  //     const updates: Record<string, string> = { [field]: value }
      
  //     // Auto-update related fields
  //     if (field === 'fulfillment_status' && value === 'fulfilled') {
  //       updates.status = 'delivered'
  //       updates.delivered_at = new Date().toISOString()
  //     } else if (field === 'status' && value === 'shipped') {
  //       updates.fulfillment_status = 'partial'
  //       updates.shipped_at = new Date().toISOString()
  //     } else if (field === 'status' && value === 'delivered') {
  //       updates.fulfillment_status = 'fulfilled'
  //       updates.delivered_at = new Date().toISOString()
  //     }

  //     const { error } = await supabase
  //       .from('orders')
  //       .update(updates)
  //       .eq('id', order.id)

  //     if (error) throw error

  //     setOrder({ ...order, ...updates })
  //   } catch (err) {
  //     console.error('Error updating order:', err)
  //     setError(err instanceof Error ? err.message : 'Failed to update order')
  //   }
  // }

  const saveTrackingInfo = async () => {
    if (!order) return

    try {
      const updates = {
        tracking_number: trackingNumber,
        tracking_url: trackingUrl,
        status: trackingNumber ? 'shipped' : order.status,
        fulfillment_status: trackingNumber ? 'partial' : order.fulfillment_status,
        shipped_at: trackingNumber && !order.shipped_at ? new Date().toISOString() : order.shipped_at
      }

      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', order.id)

      if (error) throw error

      setOrder({ ...order, ...updates })
      setEditingTracking(false)
    } catch (err) {
      console.error('Error updating tracking info:', err)
      setError(err instanceof Error ? err.message : 'Failed to update tracking info')
    }
  }

  const saveNotes = async () => {
    if (!order) return

    try {
      const { error } = await supabase
        .from('orders')
        .update({ notes: adminNotes })
        .eq('id', order.id)

      if (error) throw error

      setOrder({ ...order, notes: adminNotes })
      setEditingNotes(false)
    } catch (err) {
      console.error('Error updating notes:', err)
      setError(err instanceof Error ? err.message : 'Failed to update notes')
    }
  }

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAddress = (address: Record<string, unknown> | undefined) => {
    if (!address) return 'No address provided'
    const addr = address as Record<string, string>
    return `${addr.address_line_1}${addr.address_line_2 ? `, ${addr.address_line_2}` : ''}, ${addr.city}, ${addr.state_province || ''} ${addr.postal_code}, ${addr.country}`
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading order...</div>
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
            href="/dashboard/shop/orders"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Order not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The order you&apos;re looking for doesn&apos;t exist or has been deleted.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/shop/orders"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Orders
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
          href="/dashboard/shop/orders"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>
      </div>

      {/* Order Header */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_number}</h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Placed on {formatDate(order.created_at)}
              </p>
              <div className="mt-2 flex items-center space-x-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status, 'order')}`}>
                  {order.status}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.payment_status, 'payment')}`}>
                  {order.payment_status}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.fulfillment_status, 'fulfillment')}`}>
                  {order.fulfillment_status}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {formatPrice(order.total_amount, order.currency)}
                </div>
                <div className="text-sm text-gray-500">
                  {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Order Items */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Order Items</h3>
            </div>
            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.order_items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                          <div className="text-sm text-gray-500">{item.product_format}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPrice(item.unit_amount, order.currency)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPrice(item.total_amount, order.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Order Timeline</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="flow-root">
                <ul className="-mb-8">
                  <li>
                    <div className="relative pb-8">
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                            <CalendarIcon className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">Order placed</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {formatDate(order.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  
                  {order.payment_status === 'paid' && (
                    <li>
                      <div className="relative pb-8">
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                              <CreditCardIcon className="h-5 w-5 text-white" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">Payment confirmed</p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              {formatDate(order.updated_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )}
                  
                  {order.shipped_at && (
                    <li>
                      <div className="relative pb-8">
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                              <TruckIcon className="h-5 w-5 text-white" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">Order shipped</p>
                              {order.tracking_number && (
                                <p className="text-sm text-blue-600">Tracking: {order.tracking_number}</p>
                              )}
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              {formatDate(order.shipped_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )}
                  
                  {order.delivered_at && (
                    <li>
                      <div className="relative">
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                              <CheckIcon className="h-5 w-5 text-white" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">Order delivered</p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              {formatDate(order.delivered_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Customer Information</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.customer_email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Billing Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatAddress(order.billing_address)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Shipping Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatAddress(order.shipping_address)}</dd>
                </div>
                {order.customer_notes && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Customer Notes</dt>
                    <dd className="mt-1 text-sm text-gray-900">{order.customer_notes}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Order Summary</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Subtotal</dt>
                  <dd className="text-sm text-gray-900">{formatPrice(order.subtotal_amount, order.currency)}</dd>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Discount</dt>
                    <dd className="text-sm text-red-600">-{formatPrice(order.discount_amount, order.currency)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Shipping</dt>
                  <dd className="text-sm text-gray-900">{formatPrice(order.shipping_amount, order.currency)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Tax</dt>
                  <dd className="text-sm text-gray-900">{formatPrice(order.tax_amount, order.currency)}</dd>
                </div>
                <div className="flex justify-between border-t pt-4">
                  <dt className="text-base font-medium text-gray-900">Total</dt>
                  <dd className="text-base font-medium text-gray-900">{formatPrice(order.total_amount, order.currency)}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Shipping & Tracking */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Shipping & Tracking</h3>
                <button
                  onClick={() => setEditingTracking(!editingTracking)}
                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  <PencilIcon className="h-3 w-3 mr-1" />
                  Edit
                </button>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              {editingTracking ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="tracking_number" className="block text-sm font-medium text-gray-700">
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      id="tracking_number"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter tracking number"
                    />
                  </div>
                  <div>
                    <label htmlFor="tracking_url" className="block text-sm font-medium text-gray-700">
                      Tracking URL
                    </label>
                    <input
                      type="url"
                      id="tracking_url"
                      value={trackingUrl}
                      onChange={(e) => setTrackingUrl(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setEditingTracking(false)}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveTrackingInfo}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Shipping Method</dt>
                    <dd className="mt-1 text-sm text-gray-900">{order.shipping_method || 'Standard Shipping'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Tracking Number</dt>
                    <dd className="mt-1 text-sm text-gray-900">{order.tracking_number || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Tracking URL</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {order.tracking_url ? (
                        <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
                          Track Package
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </dd>
                  </div>
                </dl>
              )}
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Internal Notes</h3>
                <button
                  onClick={() => setEditingNotes(!editingNotes)}
                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  <PencilIcon className="h-3 w-3 mr-1" />
                  Edit
                </button>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              {editingNotes ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      rows={4}
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Add internal notes about this order..."
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setEditingNotes(false)}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveNotes}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-900">
                  {order.notes || 'No internal notes added yet.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}