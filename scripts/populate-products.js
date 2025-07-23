require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function populateProducts() {
  try {
    console.log('Fetching releases from database...')
    
    // Get all releases
    const { data: releases, error: releasesError } = await supabase
      .from('releases')
      .select('*')
      .order('id', { ascending: true })
    
    if (releasesError) {
      console.error('Error fetching releases:', releasesError)
      return
    }
    
    console.log(`Found ${releases.length} releases`)
    
    // Check if products already exist
    const { data: existingProducts, error: productsError } = await supabase
      .from('products')
      .select('id, release_id')
    
    if (productsError) {
      console.error('Error fetching products:', productsError)
      return
    }
    
    console.log(`Found ${existingProducts.length} existing products`)
    
    const existingReleaseIds = new Set(existingProducts.map(p => p.release_id))
    
    // Create products for releases that don't have them
    const productsToCreate = []
    
    for (const release of releases) {
      if (!existingReleaseIds.has(release.id)) {
        // Create CD product
        const cdProduct = {
          name: release.title,
          description: release.description || `${release.title} by ${release.artist_name}`,
          category: 'physical',
          format: 'CD',
          release_id: release.id,
          status: 'active',
          featured: release.featured || false,
          images: release.cover_image ? [release.cover_image] : [],
          metadata: {
            catalog_number: release.catalog_number,
            artist: release.artist_name,
            duration: release.duration,
            recording_date: release.recording_date,
            recording_location: release.recording_location
          },
          inventory_tracking: false,
          inventory_quantity: 100,
          sort_order: release.sort_order || 0
        }
        
        productsToCreate.push(cdProduct)
        
        // Also create SACD product if it's a premium release
        if (release.featured) {
          const sacdProduct = {
            ...cdProduct,
            name: `${release.title} (SACD)`,
            format: 'Hybrid SACD',
            metadata: {
              ...cdProduct.metadata,
              format_description: 'High-quality Super Audio CD format'
            }
          }
          productsToCreate.push(sacdProduct)
        }
      }
    }
    
    console.log(`Creating ${productsToCreate.length} new products...`)
    
    if (productsToCreate.length > 0) {
      const { data: createdProducts, error: createError } = await supabase
        .from('products')
        .insert(productsToCreate)
        .select('id, name, format, release_id')
      
      if (createError) {
        console.error('Error creating products:', createError)
        return
      }
      
      console.log(`Created ${createdProducts.length} products`)
      
      // Now create prices for each product
      const pricesToCreate = []
      
      for (const product of createdProducts) {
        const basePrice = product.format === 'Hybrid SACD' ? 1600 : 1400 // 16€ for SACD, 14€ for CD
        
        const price = {
          product_id: product.id,
          amount: basePrice, // Price in cents
          currency: 'EUR',
          variant_type: product.format,
          metadata: {
            format: product.format,
            description: product.format === 'Hybrid SACD' ? 'High-quality Super Audio CD' : 'Standard CD format'
          }
        }
        
        pricesToCreate.push(price)
      }
      
      console.log(`Creating ${pricesToCreate.length} prices...`)
      
      const { data: createdPrices, error: pricesError } = await supabase
        .from('product_prices')
        .insert(pricesToCreate)
        .select('id, product_id, amount, variant_type')
      
      if (pricesError) {
        console.error('Error creating prices:', pricesError)
        return
      }
      
      console.log(`Created ${createdPrices.length} prices`)
    }
    
    // Final count
    const { data: finalProducts, error: finalError } = await supabase
      .from('products')
      .select('id, name, format, status')
      .eq('status', 'active')
    
    if (finalError) {
      console.error('Error getting final count:', finalError)
      return
    }
    
    console.log(`\\n✅ Products populated successfully!`)
    console.log(`Total active products: ${finalProducts.length}`)
    console.log(`Products by format:`)
    
    const formatCounts = finalProducts.reduce((acc, product) => {
      acc[product.format] = (acc[product.format] || 0) + 1
      return acc
    }, {})
    
    Object.entries(formatCounts).forEach(([format, count]) => {
      console.log(`  - ${format}: ${count}`)
    })
    
  } catch (error) {
    console.error('Error populating products:', error)
  }
}

populateProducts()