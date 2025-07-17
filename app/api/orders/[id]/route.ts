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

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          product:products(*)
        ),
        customer:customers(*)
      `)
      .eq('id', id)
      .single()

    if (error || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Get order error:', error)
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

    // Only allow updating certain fields
    const allowedFields = [
      'status',
      'fulfillment_status',
      'tracking_number',
      'tracking_url',
      'notes',
      'shipped_at',
      'delivered_at',
    ]

    const updateData: any = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    updateData.updated_at = new Date().toISOString()

    // Handle status transitions
    if (body.status === 'shipped' && !updateData.shipped_at) {
      updateData.shipped_at = new Date().toISOString()
    }

    if (body.status === 'delivered' && !updateData.delivered_at) {
      updateData.delivered_at = new Date().toISOString()
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        order_items(
          *,
          product:products(*)
        )
      `)
      .single()

    if (error) {
      console.error('Error updating order:', error)
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      )
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Update order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}