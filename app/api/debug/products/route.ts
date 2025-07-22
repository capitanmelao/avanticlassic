import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server-client'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    console.log('🔍 DEBUG: Checking all products for override metadata...')
    
    // Get all products with their metadata
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        format,
        metadata,
        releases!inner(
          title,
          catalog_number
        ),
        product_prices(
          id,
          amount,
          currency
        )
      `)
      .order('id')

    if (error) {
      console.error('❌ Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`✅ Found ${products?.length || 0} products`)
    
    // Filter and analyze products with override data
    const productsWithOverrides = products?.filter(product => 
      product.metadata?.shipping_override || product.metadata?.tax_override
    ) || []
    
    const worldTangosProducts = products?.filter(product => 
      product.releases?.title?.toLowerCase().includes('world tangos odyssey')
    ) || []

    const debugInfo = {
      totalProducts: products?.length || 0,
      productsWithOverrides: productsWithOverrides.length,
      worldTangosProducts: worldTangosProducts.map(product => ({
        id: product.id,
        title: product.releases?.title,
        format: product.format,
        catalog: product.releases?.catalog_number,
        metadata: product.metadata,
        hasShippingOverride: !!product.metadata?.shipping_override,
        hasTexOverride: !!product.metadata?.tax_override,
        shippingOverrideData: product.metadata?.shipping_override,
        taxOverrideData: product.metadata?.tax_override,
        prices: product.product_prices
      })),
      allProductsWithOverrides: productsWithOverrides.map(product => ({
        id: product.id,
        title: product.releases?.title,
        format: product.format,
        metadata: product.metadata
      }))
    }

    console.log('🔍 DEBUG INFO:', JSON.stringify(debugInfo, null, 2))

    return NextResponse.json(debugInfo)

  } catch (error) {
    console.error('❌ Debug API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}