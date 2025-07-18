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
      // Get the physical price (main price for the product)
      const physicalPrice = product.product_prices?.find(p => p.variant_type === 'physical' && p.active)
      
      // Check availability
      const available = product.status === 'active' && 
                       (!product.inventory_tracking || product.inventory_quantity > 0)

      // Map database format back to display format
      const displayFormatMapping: Record<string, string> = {
        'cd': 'CD',
        'sacd': 'SACD', 
        'hybrid_sacd': 'Hybrid SACD'
      }
      
      const displayFormat = displayFormatMapping[product.format] || product.format.toUpperCase()

      return {
        id: product.id,
        format: displayFormat, // Use display format instead of database format
        price: physicalPrice?.amount || 0,
        currency: physicalPrice?.currency || 'EUR',
        priceId: physicalPrice?.id, // Include actual price ID
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