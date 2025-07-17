import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server-client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const status = searchParams.get('status') || 'active'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const format = searchParams.get('format')
    const featured = searchParams.get('featured')

    const supabase = createClient()

    let query = supabase
      .from('products')
      .select(`
        *,
        product_prices(*),
        product_categories(
          product_category:product_categories(*)
        )
      `)
      .eq('status', status)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    // Apply filters
    if (category) {
      query = query.eq('category', category)
    }

    if (format) {
      query = query.eq('format', format)
    }

    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: products, error, count } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      )
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', status)

    return NextResponse.json({
      products: products || [],
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        pages: Math.ceil((totalCount || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create new product (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      category,
      format,
      release_id,
      stripe_product_id,
      images,
      featured = false,
      status = 'draft',
      metadata = {},
      inventory_tracking = false,
      inventory_quantity = 0,
      sort_order = 0,
    } = body

    if (!name || !category || !format) {
      return NextResponse.json(
        { error: 'Name, category, and format are required' },
        { status: 400 }
      )
    }

    const { createAdminClient } = await import('@/lib/supabase/server-client')
    const supabase = createAdminClient()

    const productData = {
      name,
      description,
      category,
      format,
      release_id,
      stripe_product_id,
      images: images || [],
      featured,
      status,
      metadata,
      inventory_tracking,
      inventory_quantity,
      sort_order,
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert(productData)
      .select(`
        *,
        product_prices(*)
      `)
      .single()

    if (error) {
      console.error('Error creating product:', error)
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      )
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}