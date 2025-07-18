import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { migrateReleasesToProducts } from '@/lib/product-creation'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_request: NextRequest) {
  try {
    // In a real app, you'd want to check admin permissions here
    // For now, we'll just run the migration
    
    console.log('🚀 Starting release-to-product migration via API...')
    
    const result = await migrateReleasesToProducts()
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Migration completed successfully. Converted ${result.converted} releases to products.`,
        converted: result.converted,
        errors: result.errors
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Migration failed',
        converted: result.converted,
        errors: result.errors
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Migration API error:', error)
    return NextResponse.json({
      success: false,
      message: 'Migration failed with error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    // Get migration status - check how many releases have products
    const { data: releases, error: releasesError } = await supabase
      .from('releases')
      .select('id')
    
    if (releasesError) {
      return NextResponse.json({ error: 'Failed to fetch releases' }, { status: 500 })
    }

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, release_id')
      .not('release_id', 'is', null)
    
    if (productsError) {
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }

    const totalReleases = releases.length
    const releasesWithProducts = products.length

    return NextResponse.json({
      totalReleases,
      releasesWithProducts,
      needsMigration: totalReleases, // Always show as needing migration
      migrationComplete: false // Always allow re-running to fix prices
    })
  } catch (error) {
    console.error('Migration status error:', error)
    return NextResponse.json({
      error: 'Failed to get migration status'
    }, { status: 500 })
  }
}