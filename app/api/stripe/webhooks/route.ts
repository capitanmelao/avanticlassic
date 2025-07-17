import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe, stripeUtils, isStripeConfigured } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/server-client'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    if (!isStripeConfigured) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 503 }
      )
    }
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('No stripe signature found')
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripeUtils.validateWebhookSignature(body, signature)
    } catch (error) {
      console.error('Webhook signature verification failed:', error)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.log(`Received webhook: ${event.type}`)

    // Get Supabase admin client
    const supabase = createAdminClient()

    // Log webhook event
    const { error: logError } = await supabase
      .from('stripe_webhook_events')
      .insert({
        stripe_event_id: event.id,
        event_type: event.type,
        data: event.data,
        processed: false,
      })

    if (logError) {
      console.error('Failed to log webhook event:', logError)
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session, supabase)
        break

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent, supabase)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent, supabase)
        break

      case 'customer.created':
        await handleCustomerCreated(event.data.object as Stripe.Customer, supabase)
        break

      case 'customer.updated':
        await handleCustomerUpdated(event.data.object as Stripe.Customer, supabase)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Mark event as processed
    await supabase
      .from('stripe_webhook_events')
      .update({ 
        processed: true, 
        processing_status: 'success',
        processed_at: new Date().toISOString() 
      })
      .eq('stripe_event_id', event.id)

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)

    // Try to mark event as failed if we have the event ID
    const headersList = await headers()
    const body = await request.text()
    
    try {
      const event = JSON.parse(body)
      if (event?.id) {
        const supabase = createAdminClient()
        await supabase
          .from('stripe_webhook_events')
          .update({ 
            processing_status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error',
            processed_at: new Date().toISOString()
          })
          .eq('stripe_event_id', event.id)
      }
    } catch {
      // Ignore errors in error handling
    }

    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  supabase: any
) {
  try {
    console.log('Processing checkout session completed:', session.id)

    // Get line items from the session
    const lineItemsResponse = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product'],
    })

    // Create order
    const orderData = {
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent as string,
      customer_email: session.customer_details?.email || '',
      status: 'pending',
      payment_status: session.payment_status === 'paid' ? 'paid' : 'pending',
      fulfillment_status: 'unfulfilled',
      subtotal_amount: session.amount_subtotal || 0,
      tax_amount: session.total_details?.amount_tax || 0,
      shipping_amount: session.shipping_cost?.amount_total || 0,
      discount_amount: session.total_details?.amount_discount || 0,
      total_amount: session.amount_total || 0,
      currency: session.currency || 'eur',
      billing_address: session.customer_details?.address,
      shipping_address: session.shipping_details?.address,
      payment_method_types: [session.payment_method_types?.[0] || 'card'],
      adaptive_pricing_applied: false, // TODO: detect if adaptive pricing was used
      tax_details: session.total_details,
      metadata: session.metadata,
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (orderError) {
      console.error('Failed to create order:', orderError)
      throw orderError
    }

    // Create order items
    for (const lineItem of lineItemsResponse.data) {
      if (!lineItem.price?.product) continue

      const product = lineItem.price.product as Stripe.Product
      
      // Get our product from database
      const { data: dbProduct } = await supabase
        .from('products')
        .select('*')
        .eq('stripe_product_id', product.id)
        .single()

      const orderItemData = {
        order_id: order.id,
        product_id: dbProduct?.id,
        price_id: null, // We'll need to match this with our database
        quantity: lineItem.quantity || 1,
        unit_amount: lineItem.price?.unit_amount || 0,
        total_amount: lineItem.amount_total || 0,
        tax_amount: lineItem.amount_tax || 0,
        discount_amount: lineItem.amount_discount || 0,
        product_name: product.name,
        product_format: dbProduct?.format || 'unknown',
        product_images: dbProduct?.images || [],
        fulfillment_status: 'unfulfilled',
      }

      await supabase.from('order_items').insert(orderItemData)

      // Update inventory if tracking is enabled
      if (dbProduct?.inventory_tracking) {
        await supabase
          .from('products')
          .update({
            inventory_quantity: Math.max(0, 
              (dbProduct.inventory_quantity || 0) - (lineItem.quantity || 1)
            )
          })
          .eq('id', dbProduct.id)
      }
    }

    // Clear cart if customer exists
    if (session.customer) {
      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('stripe_customer_id', session.customer)
        .single()

      if (customer) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('customer_id', customer.id)
      }
    }

    console.log('Order created successfully:', order.id)
  } catch (error) {
    console.error('Error handling checkout session completed:', error)
    throw error
  }
}

async function handlePaymentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
  supabase: any
) {
  try {
    console.log('Processing payment succeeded:', paymentIntent.id)

    // Update order payment status
    await supabase
      .from('orders')
      .update({ 
        payment_status: 'paid',
        status: 'processing' // Move to processing after payment
      })
      .eq('stripe_payment_intent_id', paymentIntent.id)

    console.log('Order payment status updated')
  } catch (error) {
    console.error('Error handling payment succeeded:', error)
    throw error
  }
}

async function handlePaymentFailed(
  paymentIntent: Stripe.PaymentIntent,
  supabase: any
) {
  try {
    console.log('Processing payment failed:', paymentIntent.id)

    // Update order payment status
    await supabase
      .from('orders')
      .update({ 
        payment_status: 'failed',
        status: 'cancelled'
      })
      .eq('stripe_payment_intent_id', paymentIntent.id)

    console.log('Order marked as failed')
  } catch (error) {
    console.error('Error handling payment failed:', error)
    throw error
  }
}

async function handleCustomerCreated(
  customer: Stripe.Customer,
  supabase: any
) {
  try {
    console.log('Processing customer created:', customer.id)

    // Create or update customer in our database
    const customerData = {
      stripe_customer_id: customer.id,
      email: customer.email || '',
      first_name: customer.name?.split(' ')[0] || '',
      last_name: customer.name?.split(' ').slice(1).join(' ') || '',
      phone: customer.phone || '',
      preferred_language: 'en',
      preferred_currency: 'EUR',
      account_status: 'active',
    }

    await supabase
      .from('customers')
      .upsert(customerData, { onConflict: 'stripe_customer_id' })

    console.log('Customer synced to database')
  } catch (error) {
    console.error('Error handling customer created:', error)
    throw error
  }
}

async function handleCustomerUpdated(
  customer: Stripe.Customer,
  supabase: any
) {
  try {
    console.log('Processing customer updated:', customer.id)

    // Update customer in our database
    const customerData = {
      email: customer.email || '',
      first_name: customer.name?.split(' ')[0] || '',
      last_name: customer.name?.split(' ').slice(1).join(' ') || '',
      phone: customer.phone || '',
    }

    await supabase
      .from('customers')
      .update(customerData)
      .eq('stripe_customer_id', customer.id)

    console.log('Customer updated in database')
  } catch (error) {
    console.error('Error handling customer updated:', error)
    throw error
  }
}