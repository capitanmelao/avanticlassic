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
import ApplePayDebug from '@/components/shop/apple-pay-debug'

export default function CheckoutPage() {
  const router = useRouter()
  const { state, clearCart } = useCart()
  const { language } = useLanguage()
  const t = useTranslations(language)
  const [isProcessing, setIsProcessing] = useState(false)
  const [customerEmail, setCustomerEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  
  const subtotal = state.total
  
  // Check for product-specific overrides in cart items
  const hasShippingOverride = state.items.some(item => 
    item.metadata?.shipping_override?.enabled
  )
  const hasTaxOverride = state.items.some(item => 
    item.metadata?.tax_override?.enabled
  )
  
  // Calculate shipping with overrides
  let shipping = subtotal > 25 ? 0 : 5.99
  if (hasShippingOverride) {
    const shippingOverrideItem = state.items.find(item => item.metadata?.shipping_override?.enabled)
    shipping = (shippingOverrideItem?.metadata?.shipping_override?.amount || 0) / 100
  }
  
  // Calculate tax with overrides
  let tax = subtotal * 0.21 // 21% VAT
  if (hasTaxOverride) {
    const taxOverrideItem = state.items.find(item => item.metadata?.tax_override?.enabled)
    tax = (taxOverrideItem?.metadata?.tax_override?.amount || 0) / 100
  }
  
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
    // Validate email
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
      // Prepare items for checkout
      const checkoutItems = state.items.map(item => ({
        productId: item.productId,
        priceId: item.priceId,
        quantity: item.quantity
      }))
      
      // Create checkout session
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
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }
      
      const { url } = await response.json()
      
      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (error) {
      console.error('Checkout error:', error)
      alert(`There was an error processing your order: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`)
    } finally {
      setIsProcessing(false)
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Redirecting to cart...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
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
            {/* Checkout Form */}
            <div className="space-y-6">
              {/* Express Checkout */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Express Checkout
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Pay quickly with Apple Pay, Google Pay, PayPal, or Link
                    </p>
                    <ExpressCheckout 
                      onSuccess={() => {
                        console.log('Express checkout successful')
                      }}
                      onError={(error) => {
                        console.error('Express checkout error:', error)
                        alert(`Payment error: ${error}`)
                      }}
                    />
                    <ApplePayDebug />
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-gray-50 px-2 text-gray-500">Or continue with email</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={customerEmail}
                        onChange={handleEmailChange}
                        className={emailError ? 'border-red-500' : ''}
                        required
                      />
                      {emailError && (
                        <p className="text-sm text-red-500">{emailError}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        We'll send order confirmation and tracking info to this email
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" />
                    Secure Checkout
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">SSL Encrypted</p>
                        <p className="text-sm text-gray-600">Your payment information is secure</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Multiple Payment Methods</p>
                        <p className="text-sm text-gray-600">Card, PayPal, SEPA, and more</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Truck className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Worldwide Shipping</p>
                        <p className="text-sm text-gray-600">Fast and reliable delivery</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Checkout Button */}
              <Button
                size="lg"
                className="w-full"
                onClick={handleCheckout}
                disabled={isProcessing || !customerEmail || !!emailError}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating secure checkout...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Continue to Payment
                  </>
                )}
              </Button>

              <div className="text-center">
                <p className="text-xs text-gray-600">
                  Powered by <span className="font-semibold">Stripe</span> - 
                  Industry-leading payment security
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {state.items.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <div className="w-16 h-16 flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2">
                              {item.name}
                            </h4>
                            <p className="text-xs text-gray-600">{item.artist}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-500">
                                {item.format} • Qty: {item.quantity}
                              </span>
                              <span className="text-sm font-medium">
                                €{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Price Breakdown */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>€{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>
                          {shipping === 0 ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            `€${shipping.toFixed(2)}`
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>VAT (21%)</span>
                        <span>€{tax.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>€{total.toFixed(2)}</span>
                      </div>
                    </div>

                    {shipping > 0 && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          Add €{(25 - subtotal).toFixed(2)} more for free shipping!
                        </p>
                      </div>
                    )}

                    {/* Delivery Info */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium">Estimated Delivery</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        3-7 business days for most locations
                      </p>
                    </div>

                    {/* Continue Shopping */}
                    <div className="pt-2">
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/shop">
                          Continue Shopping
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}