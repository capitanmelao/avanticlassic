"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, Mail, ArrowRight, Download, Home } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/contexts/cart-context'

interface OrderDetails {
  id: string
  status: string
  amount_total: number
  currency: string
  customer_email: string
  payment_status: string
  metadata: {
    source?: string
    timestamp?: string
  }
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    
    if (!sessionId) {
      setError('No session ID found')
      setIsLoading(false)
      return
    }
    
    async function fetchOrderDetails() {
      try {
        const response = await fetch(`/api/checkout?session_id=${sessionId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch order details')
        }
        
        const data = await response.json()
        setOrderDetails(data.session)
        
        // Clear the cart since the order was successful
        clearCart()
      } catch (err) {
        console.error('Error fetching order details:', err)
        setError('Failed to load order details')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchOrderDetails()
  }, [searchParams, clearCart])
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }
  
  if (error || !orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Details Unavailable</h1>
          <p className="text-gray-600 mb-6">
            We couldn't load your order details, but your payment was processed successfully.
          </p>
          <div className="space-y-3">
            <Button asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
            <div>
              <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  const isPaymentSuccessful = orderDetails.payment_status === 'paid'
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">
              Thank you for your purchase. Your order has been successfully processed.
            </p>
          </div>
          
          {/* Order Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-mono text-sm">{orderDetails.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <Badge variant={isPaymentSuccessful ? 'default' : 'secondary'}>
                    {isPaymentSuccessful ? 'Paid' : 'Pending'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-bold">
                    €{(orderDetails.amount_total / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span>{orderDetails.customer_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date</span>
                  <span>
                    {orderDetails.metadata.timestamp 
                      ? new Date(orderDetails.metadata.timestamp).toLocaleDateString()
                      : new Date().toLocaleDateString()
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Next Steps */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                What's Next?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="bg-blue-100 rounded-full p-2 w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Order Confirmation Email</h3>
                    <p className="text-sm text-gray-600">
                      You'll receive an email confirmation with your order details shortly.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="bg-blue-100 rounded-full p-2 w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Processing & Shipping</h3>
                    <p className="text-sm text-gray-600">
                      Your order will be processed and shipped within 1-2 business days.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="bg-blue-100 rounded-full p-2 w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Delivery</h3>
                    <p className="text-sm text-gray-600">
                      Track your package and expect delivery within 3-5 business days.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Customer Support */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="font-medium mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  If you have any questions about your order, please don't hesitate to contact us.
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" size="sm">
                    Contact Support
                  </Button>
                  <Button variant="outline" size="sm">
                    Order FAQ
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/shop">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}