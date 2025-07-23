import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const setupGuide = {
      title: "Stripe Apple Pay Setup Guide",
      steps: [
        {
          step: 1,
          title: "Enable Apple Pay in Stripe Dashboard",
          description: "Go to Stripe Dashboard → Settings → Payment methods → Apple Pay",
          action: "Enable Apple Pay and add your domain",
          url: "https://dashboard.stripe.com/settings/payment_methods"
        },
        {
          step: 2,
          title: "Register Domains with Apple Pay",
          description: "Add your production domains to Apple Pay",
          domains: [
            "avanticlassic.vercel.app"
          ],
          action: "Use the /api/admin/setup-apple-pay endpoint"
        },
        {
          step: 3,
          title: "Initialize Shipping Rates",
          description: "Create default shipping rates for checkout",
          action: "Use the /api/admin/initialize-shipping endpoint"
        },
        {
          step: 4,
          title: "Test Apple Pay Requirements",
          description: "Apple Pay requires specific conditions",
          requirements: [
            "Safari browser on macOS or iOS device",
            "Device with Touch ID, Face ID, or Apple Watch",
            "At least one card added to Apple Wallet",
            "HTTPS connection (production requirement)",
            "Domain registered with Apple Pay in Stripe"
          ]
        }
      ],
      environment_variables: {
        required: [
          "STRIPE_SECRET_KEY",
          "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
          "STRIPE_WEBHOOK_SECRET"
        ],
        optional: [
          "STRIPE_TAX_ENABLED=true",
          "STRIPE_ADAPTIVE_PRICING_ENABLED=true"
        ]
      },
      endpoints: {
        setup: [
          "POST /api/admin/setup-apple-pay",
          "POST /api/admin/initialize-shipping",
          "GET /api/stripe/shipping-rates"
        ],
        testing: [
          "POST /api/checkout",
          "GET /api/checkout?session_id={ID}"
        ]
      }
    }

    return NextResponse.json(setupGuide)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate setup guide' },
      { status: 500 }
    )
  }
}