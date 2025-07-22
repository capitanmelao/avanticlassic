"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, ShieldCheck, Truck, Clock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/contexts/cart-context'
import { useLanguage } from '@/contexts/language-context'
import { useTranslations } from '@/lib/translations'
import ExpressCheckout from '@/components/shop/express-checkout'

export default function CheckoutPage() {
  const router = useRouter()
  const { state, clearCart } = useCart()
  const { language } = useLanguage()
  const t = useTranslations(language)
  const [isProcessing, setIsProcessing] = useState(false)
  const [customerEmail, setCustomerEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  
  const subtotal = state.total
  
  // Simple calculation approach to avoid hoisting issues
  const getShippingAmount = () => {
    const hasOverride = state.items.some(item => item.metadata?.shipping_override?.enabled)
    if (hasOverride) {
      const item = state.items.find(item => item.metadata?.shipping_override?.enabled)
      return (item?.metadata?.shipping_override?.amount || 0) / 100
    }
    return subtotal > 25 ? 0 : 5.99
  }

  const getTaxAmount = () => {
    const hasOverride = state.items.some(item => item.metadata?.tax_override?.enabled)
    if (hasOverride) {
      const item = state.items.find(item => item.metadata?.tax_override?.enabled)
      return (item?.metadata?.tax_override?.amount || 0) / 100
    }
    return subtotal * 0.21
  }

  const shipping = getShippingAmount()
  const tax = getTaxAmount()
  const total = subtotal + shipping + tax

  // Redirect to cart if empty
  useEffect(() => {
    if (state.items.length === 0) {
      router.push('/shop/cart')
    }
  }, [state.items.length, router])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    setCustomerEmail(email)
    
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError('')
    }
  }

  const handleCheckout = async () => {
    // Validate email first
    if (!customerEmail) {
      setEmailError('Email is required')
      return
    }
    
    if (!validateEmail(customerEmail)) {
      setEmailError('Please enter a valid email address')
      return
    }

    setIsProcessing(true)
    
    try {
      // Prepare items for checkout - simple structure
      const checkoutItems = state.items.map(item => ({
        productId: item.productId,
        priceId: item.priceId,
        quantity: item.quantity
      }))
      
      console.log('Creating checkout session with items:', checkoutItems)
      
      // Create Stripe Checkout Session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: checkoutItems,
          customer_email: customerEmail,
          success_url: `${window.location.origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/shop/cancel`,
        }),
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Checkout API error:', response.status, errorText)
        throw new Error(`Failed to create checkout session: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('Checkout session created:', result)
      
      // Redirect to Stripe Checkout page
      if (result.url) {
        console.log('Redirecting to:', result.url)
        window.location.href = result.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      const message = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`There was an error processing your order: ${message}. Please try again.`)
    } finally {
      setIsProcessing(false)
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <Button asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Checkout</h1>
              <p className="text-gray-600">
                Complete your order securely
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Section */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Checkout Description */}
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      You will be redirected to Stripe's secure payment page to complete your purchase.
                    </p>
                  </div>

                  {/* Email Field */}
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={customerEmail}
                      onChange={handleEmailChange}
                      className={emailError ? 'border-red-500' : ''}
                    />
                    {emailError && (
                      <p className="text-sm text-red-500 mt-1">{emailError}</p>
                    )}
                  </div>

                  {/* Express Checkout */}
                  <div className="mb-4">
                    <ExpressCheckout 
                      items={state.items}
                      onSuccess={() => {
                        console.log('Express checkout success')
                        clearCart()
                        router.push('/shop/success')
                      }}
                      onError={(error) => {
                        console.error('Express checkout error:', error)
                      }}
                    />
                  </div>

                  {/* Or divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-2 text-gray-500">Or pay with card</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleCheckout}
                    disabled={isProcessing || !customerEmail}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Proceed to Payment
                      </>
                    )}
                  </Button>

                  {/* Trust Indicators */}
                  <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <ShieldCheck className="h-4 w-4 mr-1" />
                      Secure
                    </div>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-1" />
                      Fast Shipping
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      24/7 Support
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Cart Items */}
                  <div className="space-y-4 mb-4">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded border"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-xs text-gray-600">{item.artist}</p>
                          <p className="text-xs text-gray-500">
                            {item.format} • Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-semibold">
                            €{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Order Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>€{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `€${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT (21%)</span>
                      <span>€{tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>€{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {shipping > 0 && subtotal < 25 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Add €{(25 - subtotal).toFixed(2)} more for free shipping!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}