#!/usr/bin/env node

/**
 * Migration script to convert existing releases to products
 * 
 * This script reads all existing releases and creates corresponding products
 * with default pricing based on format.
 * 
 * Run with: node scripts/migrate-releases-to-products.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Default pricing based on format (in cents)
const FORMAT_PRICING = {
  'CD': 1400,     // €14.00
  'SACD': 1600,   // €16.00
  'Vinyl': 2500,  // €25.00
  'Digital': 1000, // €10.00
  'Cassette': 1200, // €12.00
}

async function migrateReleasesToProducts() {
  console.log('🚀 Starting release-to-product migration...')
  
  try {
    // Get all releases
    const { data: releases, error: fetchError } = await supabase
      .from('releases')
      .select(`
        id,
        title,
        format,
        image_url,
        catalog_number,
        featured,
        sort_order,
        created_at,
        release_translations(language, description)
      `)
      .order('id')

    if (fetchError) {
      console.error('❌ Failed to fetch releases:', fetchError)
      return
    }

    console.log(`📋 Found ${releases.length} releases to migrate`)

    let converted = 0
    let errors = []

    // Get the next sort order for products
    const { data: maxSortOrder } = await supabase
      .from('products')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)

    let nextSortOrder = maxSortOrder?.[0]?.sort_order ? maxSortOrder[0].sort_order + 1 : 1

    // Process each release
    for (const release of releases) {
      try {
        console.log(`\n🔄 Processing: ${release.title} (ID: ${release.id})`)

        // Check if product already exists
        const { data: existingProduct } = await supabase
          .from('products')
          .select('id')
          .eq('release_id', release.id)
          .single()

        if (existingProduct) {
          console.log(`⚠️  Product already exists for release ${release.id}, skipping`)
          continue
        }

        // Get English description from translations
        const englishTranslation = release.release_translations?.find(t => t.language === 'en')
        const description = englishTranslation?.description || 
                          `${release.title} - ${release.format} release`

        // Create product
        const productData = {
          name: release.title,
          description,
          type: 'physical',
          format: release.format?.toLowerCase() || 'cd',
          status: 'active',
          featured: release.featured || false,
          inventory_quantity: 100, // Default stock
          inventory_tracking: true,
          sort_order: nextSortOrder++,
          release_id: release.id,
          images: release.image_url ? [release.image_url] : [],
          metadata: {
            catalog_number: release.catalog_number,
            auto_created: true,
            created_from_release: true,
            migrated_at: new Date().toISOString(),
            original_sort_order: release.sort_order
          }
        }

        const { data: newProduct, error: productError } = await supabase
          .from('products')
          .insert(productData)
          .select('id')
          .single()

        if (productError) {
          errors.push(`Release ${release.id} (${release.title}): ${productError.message}`)
          console.log(`❌ Failed to create product: ${productError.message}`)
          continue
        }

        // Create price variant
        const format = release.format || 'CD'
        const price = FORMAT_PRICING[format] || FORMAT_PRICING['CD']

        const priceData = {
          product_id: newProduct.id,
          amount: price,
          currency: 'EUR',
          variant_type: 'default',
          type: 'one_time',
          active: true
        }

        const { error: priceError } = await supabase
          .from('product_prices')
          .insert(priceData)

        if (priceError) {
          errors.push(`Price for product ${newProduct.id}: ${priceError.message}`)
          console.log(`⚠️  Failed to create price: ${priceError.message}`)
          // Continue anyway, product was created
        }

        converted++
        console.log(`✅ Created product ${newProduct.id} with price €${price/100}`)

      } catch (error) {
        const errorMsg = `Release ${release.id} (${release.title}): ${error.message}`
        errors.push(errorMsg)
        console.log(`❌ Error: ${errorMsg}`)
      }
    }

    // Summary
    console.log('\n📊 Migration Summary:')
    console.log(`   Total releases: ${releases.length}`)
    console.log(`   Successfully converted: ${converted}`)
    console.log(`   Errors: ${errors.length}`)

    if (errors.length > 0) {
      console.log('\n❌ Errors encountered:')
      errors.forEach(error => console.log(`   - ${error}`))
    }

    console.log('\n🎉 Migration completed!')

  } catch (error) {
    console.error('❌ Migration failed:', error)
  }
}

// Run the migration
if (require.main === module) {
  migrateReleasesToProducts()
    .then(() => {
      console.log('\n✅ Migration script finished')
      process.exit(0)
    })
    .catch(error => {
      console.error('\n❌ Migration script failed:', error)
      process.exit(1)
    })
}

module.exports = { migrateReleasesToProducts }