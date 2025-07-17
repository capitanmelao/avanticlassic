import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server-client'

// Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemId, quantity } = body

    if (!itemId || quantity === undefined || quantity < 0) {
      return NextResponse.json(
        { error: 'Item ID and valid quantity are required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Get the cart item to validate product inventory
    const { data: cartItem, error: itemError } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('id', itemId)
      .single()

    if (itemError || !cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    // Check inventory if tracking is enabled
    if (cartItem.product.inventory_tracking && cartItem.product.inventory_quantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient inventory' },
        { status: 400 }
      )
    }

    // Update the cart item
    const { data: updatedItem, error: updateError } = await supabase
      .from('cart_items')
      .update({ 
        quantity,
        updated_at: new Date().toISOString() 
      })
      .eq('id', itemId)
      .select(`
        *,
        product:products(*,
          product_prices(*)
        )
      `)
      .single()

    if (updateError) {
      console.error('Error updating cart item:', updateError)
      return NextResponse.json(
        { error: 'Failed to update cart item' },
        { status: 500 }
      )
    }

    return NextResponse.json({ item: updatedItem })
  } catch (error) {
    console.error('Update cart item error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Remove specific cart item
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const itemId = searchParams.get('item_id')

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)

    if (error) {
      console.error('Error removing cart item:', error)
      return NextResponse.json(
        { error: 'Failed to remove cart item' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Remove cart item error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}