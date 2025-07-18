import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: { releaseId: string } }
) {
  try {
    const releaseId = params.releaseId

    // Get products for this release
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        format,
        status,
        inventory_quantity,
        inventory_tracking,
        product_prices (
          id,
          amount,
          currency,
          variant_type,
          active
        )
      `)
      .eq('release_id', releaseId)
      .eq('status', 'active')
      .order('sort_order')

    if (productsError) {
      console.error('Error fetching products:', productsError)
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }

    console.log('Products found:', products?.length)
    if (products?.length) {
      console.log('First product:', JSON.stringify(products[0], null, 2))
      
      // Check prices separately
      const { data: prices } = await supabase
        .from('product_prices')
        .select('*')
        .eq('product_id', products[0].id)
      
      console.log('Prices for first product:', prices)
    }

    // Transform products into formats
    const formats = products?.map(product => {
      // Get the default price
      const defaultPrice = product.product_prices?.find(p => p.variant_type === 'default' && p.active)
      
      // Check availability
      const available = product.status === 'active' && 
                       (!product.inventory_tracking || product.inventory_quantity > 0)

      return {
        id: product.id,
        format: product.format,
        price: defaultPrice?.amount || 0,
        currency: defaultPrice?.currency || 'EUR',
        priceId: defaultPrice?.id, // Include actual price ID
        inventory_quantity: product.inventory_quantity || 0,
        available
      }
    }) || []

    return NextResponse.json({ formats })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}