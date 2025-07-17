import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server-client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get('session_id')
    const customerEmail = searchParams.get('customer_email')

    if (!sessionId && !customerEmail) {
      return NextResponse.json(
        { error: 'Session ID or customer email is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    let query = supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*,
          product_prices(*)
        )
      `)

    // Filter by session ID for guest users or customer email for authenticated users
    if (customerEmail) {
      // Get customer ID first
      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', customerEmail)
        .single()

      if (customer) {
        query = query.eq('customer_id', customer.id)
      } else {
        // Customer doesn't exist, return empty cart
        return NextResponse.json({
          items: [],
          itemCount: 0,
          subtotal: 0,
        })
      }
    } else if (sessionId) {
      query = query.eq('session_id', sessionId).is('customer_id', null)
    }

    const { data: cartItems, error } = await query

    if (error) {
      console.error('Error fetching cart:', error)
      return NextResponse.json(
        { error: 'Failed to fetch cart' },
        { status: 500 }
      )
    }

    // Calculate totals
    const itemCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0
    const subtotal = cartItems?.reduce((sum, item) => sum + (item.unit_amount * item.quantity), 0) || 0

    return NextResponse.json({
      items: cartItems || [],
      itemCount,
      subtotal,
    })
  } catch (error) {
    console.error('Cart API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, customerEmail, productId, priceId, quantity = 1 } = body

    if (!sessionId && !customerEmail) {
      return NextResponse.json(
        { error: 'Session ID or customer email is required' },
        { status: 400 }
      )
    }

    if (!productId || !priceId) {
      return NextResponse.json(
        { error: 'Product ID and price ID are required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Validate product and price
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*, product_prices(*)')
      .eq('id', productId)
      .eq('status', 'active')
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found or inactive' },
        { status: 404 }
      )
    }

    const price = product.product_prices?.find((p: any) => p.id === priceId && p.active)
    if (!price) {
      return NextResponse.json(
        { error: 'Price not found or inactive' },
        { status: 404 }
      )
    }

    // Check inventory
    if (product.inventory_tracking && product.inventory_quantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient inventory' },
        { status: 400 }
      )
    }

    // Get customer ID if authenticated
    let customerId = null
    if (customerEmail) {
      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', customerEmail)
        .single()

      customerId = customer?.id || null
    }

    // Check if item already exists in cart
    let whereClause = supabase
      .from('cart_items')
      .select('*')
      .eq('product_id', productId)
      .eq('price_id', priceId)

    if (customerId) {
      whereClause = whereClause.eq('customer_id', customerId)
    } else {
      whereClause = whereClause.eq('session_id', sessionId).is('customer_id', null)
    }

    const { data: existingItem } = await whereClause.single()

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity
      
      // Check inventory for new quantity
      if (product.inventory_tracking && product.inventory_quantity < newQuantity) {
        return NextResponse.json(
          { error: 'Insufficient inventory' },
          { status: 400 }
        )
      }

      const { data: updatedItem, error: updateError } = await supabase
        .from('cart_items')
        .update({ 
          quantity: newQuantity,
          updated_at: new Date().toISOString() 
        })
        .eq('id', existingItem.id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating cart item:', updateError)
        return NextResponse.json(
          { error: 'Failed to update cart item' },
          { status: 500 }
        )
      }

      return NextResponse.json({ item: updatedItem })
    } else {
      // Create new cart item
      const cartItemData = {
        session_id: customerId ? null : sessionId,
        customer_id: customerId,
        product_id: productId,
        price_id: priceId,
        quantity,
        unit_amount: price.amount,
        currency: price.currency,
      }

      const { data: newItem, error: insertError } = await supabase
        .from('cart_items')
        .insert(cartItemData)
        .select()
        .single()

      if (insertError) {
        console.error('Error adding cart item:', insertError)
        return NextResponse.json(
          { error: 'Failed to add item to cart' },
          { status: 500 }
        )
      }

      return NextResponse.json({ item: newItem })
    }
  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get('session_id')
    const customerEmail = searchParams.get('customer_email')

    if (!sessionId && !customerEmail) {
      return NextResponse.json(
        { error: 'Session ID or customer email is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    let deleteQuery = supabase.from('cart_items').delete()

    if (customerEmail) {
      // Get customer ID first
      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', customerEmail)
        .single()

      if (customer) {
        deleteQuery = deleteQuery.eq('customer_id', customer.id)
      } else {
        // Customer doesn't exist, nothing to delete
        return NextResponse.json({ success: true })
      }
    } else if (sessionId) {
      deleteQuery = deleteQuery.eq('session_id', sessionId).is('customer_id', null)
    }

    const { error } = await deleteQuery

    if (error) {
      console.error('Error clearing cart:', error)
      return NextResponse.json(
        { error: 'Failed to clear cart' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Clear cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}