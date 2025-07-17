import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server-client'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params

    const supabase = createAdminClient()

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        product_prices(*),
        product_categories(
          product_category:product_categories(*)
        ),
        release:releases(*)
      `)
      .eq('id', id)
      .single()

    if (error || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params
    const body = await request.json()

    const supabase = createAdminClient()

    // Remove fields that shouldn't be updated directly
    const { id: _, created_at, updated_at, ...updateData } = body

    const { data: product, error } = await supabase
      .from('products')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        product_prices(*)
      `)
      .single()

    if (error) {
      console.error('Error updating product:', error)
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      )
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params

    const supabase = createAdminClient()

    // Check if product has any orders
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('id')
      .eq('product_id', id)
      .limit(1)

    if (orderItems && orderItems.length > 0) {
      // Don't delete, just deactivate
      const { error } = await supabase
        .from('products')
        .update({ 
          status: 'archived',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) {
        console.error('Error archiving product:', error)
        return NextResponse.json(
          { error: 'Failed to archive product' },
          { status: 500 }
        )
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Product archived due to existing orders' 
      })
    } else {
      // Safe to delete
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting product:', error)
        return NextResponse.json(
          { error: 'Failed to delete product' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}