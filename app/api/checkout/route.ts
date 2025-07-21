import { NextRequest, NextResponse } from 'next/server'
import { stripe, stripeUtils } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server-client'

export async function POST(request: NextRequest) {
  try {
    const { 
      items, 
      customer_email, 
      success_url, 
      cancel_url 
    } = await request.json()

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      )
    }

    if (!success_url || !cancel_url) {
      return NextResponse.json(
        { error: 'Success and cancel URLs are required' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = createClient()

    // Validate items and get product data from database
    const lineItems = []
    let hasOverrides = false
    
    for (const item of items) {
      const { productId, priceId, quantity } = item
      
      if (!productId || !priceId || !quantity || quantity <= 0) {
        return NextResponse.json(
          { error: 'Invalid item data' },
          { status: 400 }
        )
      }

      // Get product and price from database
      const { data: product, error: productError } = await supabase
        .from('products')
        .select(`
          *,
          product_prices!inner (
            id,
            amount,
            currency,
            variant_type,
            metadata
          )
        `)
        .eq('id', productId)
        .eq('product_prices.id', priceId)
        .single()

      if (productError || !product) {
        return NextResponse.json(
          { error: `Product not found: ${productId}` },
          { status: 404 }
        )
      }

      const productPrice = product.product_prices[0]
      
      // Check if product has tax or shipping overrides
      if (product.metadata?.shipping_override?.enabled || product.metadata?.tax_override?.enabled) {
        hasOverrides = true
        console.log('Product has overrides:', product.name, product.metadata)
      }
      
      // Create or get Stripe product
      let stripeProduct
      if (product.stripe_product_id) {
        // Use existing Stripe product
        stripeProduct = await stripe.products.retrieve(product.stripe_product_id)
      } else {
        // Create new Stripe product
        stripeProduct = await stripeUtils.createProduct({
          name: product.name,
          description: product.description || '',
          images: product.images || [],
          metadata: {
            database_id: product.id,
            release_id: product.release_id?.toString() || '',
            catalog_number: product.metadata?.catalog_number || '',
            format: product.format || '',
            ...product.metadata
          }
        })

        // Update product with Stripe ID
        await supabase
          .from('products')
          .update({ stripe_product_id: stripeProduct.id })
          .eq('id', productId)
      }

      // Create or get Stripe price
      let stripePrice
      if (productPrice.stripe_price_id) {
        // Use existing Stripe price
        stripePrice = await stripe.prices.retrieve(productPrice.stripe_price_id)
      } else {
        // Create new Stripe price
        stripePrice = await stripeUtils.createPrice({
          product: stripeProduct.id,
          currency: productPrice.currency.toLowerCase(),
          unit_amount: productPrice.amount,
          metadata: {
            database_id: productPrice.id,
            variant_type: productPrice.variant_type,
            ...productPrice.metadata
          }
        })

        // Update price with Stripe ID
        await supabase
          .from('product_prices')
          .update({ stripe_price_id: stripePrice.id })
          .eq('id', priceId)
      }

      // Add to line items
      lineItems.push({
        price: stripePrice.id,
        quantity: quantity,
      })
    }

    // Get shipping rates
    const shippingRates = await stripeUtils.getShippingRates()
    
    // Create shipping options
    const shippingOptions = shippingRates.map(rate => ({
      shipping_rate: rate.id,
    }))

    // Create checkout session - disable automatic tax/shipping if overrides are present
    const session = await stripeUtils.createCheckoutSession({
      customer_email,
      line_items: lineItems,
      success_url,
      cancel_url,
      metadata: {
        source: 'avanti_classic_shop',
        timestamp: new Date().toISOString(),
        has_overrides: hasOverrides.toString(),
      },
      shipping_address_collection: true,
      automatic_tax: !hasOverrides, // Disable automatic tax if we have overrides
      shipping_options: hasOverrides ? undefined : (shippingOptions.length > 0 ? shippingOptions : undefined),
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })

  } catch (error) {
    console.error('Checkout error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      )
    }

    const session = await stripeUtils.getCheckoutSession(sessionId)

    return NextResponse.json({
      session: {
        id: session.id,
        status: session.status,
        payment_status: session.payment_status,
        customer_email: session.customer_details?.email,
        amount_total: session.amount_total,
        currency: session.currency,
        metadata: session.metadata,
      }
    })

  } catch (error) {
    console.error('Get checkout session error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}