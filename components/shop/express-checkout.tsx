"use client"

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  useStripe,
  useElements,
  ExpressCheckoutElement,
} from '@stripe/react-stripe-js'
import { useCart } from '@/contexts/cart-context'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface ExpressCheckoutProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

function ExpressCheckoutForm({ onSuccess, onError }: ExpressCheckoutProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { state } = useCart()
  const [loading, setLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleExpressCheckout = async (event: any) => {
    if (!stripe || !elements) {
      console.error('Stripe not loaded')
      return
    }

    setLoading(true)

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
          customer_email: event.billingDetails?.email,
          success_url: `${window.location.origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/shop/cancel`,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const { url } = await response.json()

      // Complete the express checkout
      if (url) {
        window.location.href = url
      } else {
        // Handle direct payment confirmation
        event.complete('success')
        onSuccess?.()
      }

    } catch (error) {
      console.error('Express checkout error:', error)
      event.complete('fail')
      onError?.(error instanceof Error ? error.message : 'Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  const expressCheckoutOptions = {
    onConfirm: handleExpressCheckout,
    onCancel: () => {
      console.log('Express checkout cancelled')
    },
    onShippingAddressChange: (event: any) => {
      // Handle shipping address changes if needed
      console.log('Shipping address changed:', event.address)
    },
    onShippingRateChange: (event: any) => {
      // Handle shipping rate changes if needed
      console.log('Shipping rate changed:', event.shippingRate)
    },
    paymentMethods: {
      applePay: 'auto',
      googlePay: 'auto',
      link: 'auto',
    },
  }

  // Don't render if cart is empty
  if (state.items.length === 0) {
    return null
  }

  // Show fallback if Express Checkout has errors
  if (hasError) {
    return (
      <div className="w-full p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          Express checkout temporarily unavailable. Please use the checkout form below.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <ExpressCheckoutElement 
        options={expressCheckoutOptions}
        onLoadError={(error) => {
          console.error('Express Checkout Element failed to load:', error)
          setHasError(true)
          onError?.(`Express checkout failed to load: ${error.message}`)
        }}
        onReady={() => {
          console.log('Express Checkout Element ready')
        }}
      />
      {loading && (
        <div className="flex items-center justify-center mt-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
          Processing...
        </div>
      )}
    </div>
  )
}

export default function ExpressCheckout({ onSuccess, onError }: ExpressCheckoutProps) {
  const { state } = useCart()
  const [clientSecret, setClientSecret] = useState<string>('')

  // Calculate total amount including shipping and tax
  const subtotal = state.total
  const shipping = subtotal > 25 ? 0 : 5.99
  const tax = subtotal * 0.21 // 21% VAT
  const total = subtotal + shipping + tax
  const amountInCents = Math.round(total * 100)

  useEffect(() => {
    // Create a payment intent for express checkout if needed
    // This is optional - Express Checkout can work without it
  }, [])

  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    console.error('Stripe publishable key not found')
    return null
  }

  const elementsOptions = {
    mode: 'payment' as const,
    currency: 'eur',
    amount: amountInCents > 0 ? amountInCents : 1000, // Use actual cart amount
    ...(clientSecret && { clientSecret }),
  }

  return (
    <Elements stripe={stripePromise} options={elementsOptions}>
      <ExpressCheckoutForm onSuccess={onSuccess} onError={onError} />
    </Elements>
  )
}