import { NextRequest, NextResponse } from 'next/server'
import { stripe, stripeUtils, isStripeConfigured } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/server-client'

export async function POST(request: NextRequest) {
  try {
    if (!isStripeConfigured) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 503 }
      )
    }
    const body = await request.json()
    const { lineItems, customerEmail, successUrl, cancelUrl, metadata } = body

    // Validate required fields
    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      return NextResponse.json(
        { error: 'Line items are required' },
        { status: 400 }
      )
    }

    if (!successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Success and cancel URLs are required' },
        { status: 400 }
      )
    }

    // Get Supabase admin client
    const supabase = createAdminClient()

    // Validate products and get current prices
    const validatedLineItems = []
    
    for (const item of lineItems) {
      const { productId, priceId, quantity = 1 } = item

      // Validate product exists and is active
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*, product_prices(*)')
        .eq('id', productId)
        .eq('status', 'active')
        .single()

      if (productError || !product) {
        return NextResponse.json(
          { error: `Product ${productId} not found or inactive` },
          { status: 400 }
        )
      }

      // Validate price exists and is active
      const price = product.product_prices?.find(
        (p: any) => p.id === priceId && p.active
      )

      if (!price) {
        return NextResponse.json(
          { error: `Price ${priceId} not found or inactive` },
          { status: 400 }
        )
      }

      // Check inventory if tracking is enabled
      if (product.inventory_tracking && product.inventory_quantity < quantity) {
        return NextResponse.json(
          { error: `Insufficient inventory for ${product.name}` },
          { status: 400 }
        )
      }

      validatedLineItems.push({
        price: price.stripe_price_id,
        quantity,
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
          maximum: Math.min(10, product.inventory_quantity || 10),
        },
      })
    }

    // Create checkout session
    const session = await stripeUtils.createCheckoutSession({
      customer_email: customerEmail,
      line_items: validatedLineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        ...metadata,
        source: 'avanti_classic_shop',
      },
      shipping_address_collection: true, // Enable shipping for physical products
      automatic_tax: true, // Enable Stripe Tax
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!isStripeConfigured) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 503 }
      )
    }
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Retrieve checkout session
    const session = await stripeUtils.getCheckoutSession(sessionId)

    return NextResponse.json({
      session: {
        id: session.id,
        payment_status: session.payment_status,
        customer_email: session.customer_details?.email,
        amount_total: session.amount_total,
        currency: session.currency,
        customer: session.customer,
        payment_intent: session.payment_intent,
        line_items: session.line_items,
      },
    })
  } catch (error) {
    console.error('Error retrieving checkout session:', error)
    
    return NextResponse.json(
      { error: 'Failed to retrieve checkout session' },
      { status: 500 }
    )
  }
}