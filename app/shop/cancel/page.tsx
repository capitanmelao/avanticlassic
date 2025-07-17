"use client"

import Link from 'next/link'
import { XCircle, ArrowLeft, RefreshCw, HelpCircle, ShoppingCart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Cancel Header */}
          <div className="text-center mb-8">
            <div className="bg-red-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
            <p className="text-gray-600">
              Your payment was cancelled and no charges were made to your account.
            </p>
          </div>
          
          {/* Information Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                What Happened?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-600">
                  Your checkout process was cancelled. This could happen for several reasons:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>You clicked the back button during checkout</li>
                  <li>The payment process was interrupted</li>
                  <li>You decided not to complete the purchase</li>
                  <li>There was a technical issue with the payment</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  <strong>Don't worry!</strong> Your items are still saved in your cart and you can try again anytime.
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Troubleshooting */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Having Issues?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="bg-blue-100 rounded-full p-2 w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Try Again</h3>
                    <p className="text-sm text-gray-600">
                      Return to your cart and attempt the checkout process again.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="bg-blue-100 rounded-full p-2 w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Check Payment Method</h3>
                    <p className="text-sm text-gray-600">
                      Ensure your payment method is valid and has sufficient funds.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="bg-blue-100 rounded-full p-2 w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Review Your Order</h3>
                    <p className="text-sm text-gray-600">
                      Double-check your cart items and shipping information.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Support Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  If you continue to experience issues, our support team is here to help.
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" size="sm">
                    Contact Support
                  </Button>
                  <Button variant="outline" size="sm">
                    Live Chat
                  </Button>
                  <Button variant="outline" size="sm">
                    FAQ
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/shop/cart">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Return to Cart
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/shop/products">
                Continue Shopping
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}