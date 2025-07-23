// Debug script to check product metadata in database
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tqrndqprpbcmffhagstv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxcm5kcXBycGJjbWZmaGFnc3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5NDc0NDIsImV4cCI6MjA0NzUyMzQ0Mn0.OyZ8QFhQKX0iS--7lLzx7LfFZl-O9J_7Kc9QKMxLj3Q'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkProductData() {
  console.log('🔍 Checking product data for "World Tangos Odyssey"...')
  
  try {
    // Find the product by name
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        releases!inner(title, catalog_number),
        product_prices(*)
      `)
      .ilike('releases.title', '%World Tangos Odyssey%')

    if (error) {
      console.error('❌ Database error:', error)
      return
    }

    if (!products || products.length === 0) {
      console.log('❌ No products found matching "World Tangos Odyssey"')
      return
    }

    console.log(`✅ Found ${products.length} product(s):`)
    
    products.forEach((product, index) => {
      console.log(`\n📀 Product ${index + 1}:`)
      console.log(`  ID: ${product.id}`)
      console.log(`  Name: ${product.releases?.title}`)
      console.log(`  Format: ${product.format}`)
      console.log(`  Catalog: ${product.releases?.catalog_number}`)
      console.log(`  Metadata:`, JSON.stringify(product.metadata, null, 2))
      
      if (product.metadata?.shipping_override) {
        console.log(`  🚚 Shipping Override:`, product.metadata.shipping_override)
      } else {
        console.log(`  🚚 No shipping override found`)
      }
      
      if (product.metadata?.tax_override) {
        console.log(`  💰 Tax Override:`, product.metadata.tax_override)
      } else {
        console.log(`  💰 No tax override found`)
      }
    })

  } catch (err) {
    console.error('❌ Script error:', err)
  }
}

checkProductData()