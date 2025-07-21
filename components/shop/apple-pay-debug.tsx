"use client"

import { useState, useEffect } from 'react'

export default function ApplePayDebug() {
  const [debugInfo, setDebugInfo] = useState<{
    canMakePayments: boolean
    applePay: boolean
    paymentRequest: boolean
    userAgent: string
    isHttps: boolean
    domain: string
  } | null>(null)

  useEffect(() => {
    const checkApplePayAvailability = async () => {
      const info = {
        canMakePayments: false,
        applePay: false,
        paymentRequest: false,
        userAgent: navigator.userAgent,
        isHttps: window.location.protocol === 'https:',
        domain: window.location.hostname
      }

      // Check if PaymentRequest is supported
      if (window.PaymentRequest) {
        info.paymentRequest = true
        
        try {
          const paymentRequest = new PaymentRequest(
            [{ supportedMethods: 'https://apple.com/apple-pay' }],
            { total: { label: 'Test', amount: { currency: 'USD', value: '1.00' } } }
          )
          
          info.canMakePayments = await paymentRequest.canMakePayment() || false
        } catch (e) {
          console.log('PaymentRequest check failed:', e)
        }
      }

      // Check for Apple Pay specifically
      if ((window as any).ApplePaySession) {
        info.applePay = (window as any).ApplePaySession.canMakePayments()
      }

      setDebugInfo(info)
    }

    checkApplePayAvailability()
  }, [])

  if (!debugInfo) {
    return <div className="text-sm text-gray-500">Loading Apple Pay debug info...</div>
  }

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg text-xs">
      <h4 className="font-semibold mb-2">Apple Pay Debug Info:</h4>
      <div className="space-y-1">
        <div>Domain: {debugInfo.domain}</div>
        <div>HTTPS: {debugInfo.isHttps ? '✅' : '❌'}</div>
        <div>PaymentRequest API: {debugInfo.paymentRequest ? '✅' : '❌'}</div>
        <div>Apple Pay Available: {debugInfo.applePay ? '✅' : '❌'}</div>
        <div>Can Make Payments: {debugInfo.canMakePayments ? '✅' : '❌'}</div>
        <div>User Agent: {debugInfo.userAgent.includes('Safari') ? 'Safari ✅' : debugInfo.userAgent.includes('Chrome') ? 'Chrome' : 'Other'}</div>
      </div>
      {!debugInfo.applePay && (
        <div className="mt-2 text-yellow-700 bg-yellow-100 p-2 rounded">
          Apple Pay not available. Requirements:
          <ul className="mt-1 ml-4 list-disc text-xs">
            <li>Safari browser on macOS/iOS</li>
            <li>Device with Touch ID or Face ID</li>
            <li>Card added to Apple Wallet</li>
            <li>Domain registered in Stripe Apple Pay settings</li>
          </ul>
        </div>
      )}
    </div>
  )
}