import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server-client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const customerEmail = searchParams.get('customer_email')
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('payment_status')
    const fulfillmentStatus = searchParams.get('fulfillment_status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const supabase = createAdminClient()

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          product:products(*)
        )
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (customerEmail) {
      query = query.eq('customer_email', customerEmail)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (paymentStatus) {
      query = query.eq('payment_status', paymentStatus)
    }

    if (fulfillmentStatus) {
      query = query.eq('fulfillment_status', fulfillmentStatus)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: orders, error } = await query

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      )
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })

    if (customerEmail) {
      countQuery = countQuery.eq('customer_email', customerEmail)
    }
    if (status) {
      countQuery = countQuery.eq('status', status)
    }
    if (paymentStatus) {
      countQuery = countQuery.eq('payment_status', paymentStatus)
    }
    if (fulfillmentStatus) {
      countQuery = countQuery.eq('fulfillment_status', fulfillmentStatus)
    }

    const { count: totalCount } = await countQuery

    return NextResponse.json({
      orders: orders || [],
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        pages: Math.ceil((totalCount || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Orders API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}