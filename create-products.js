const { createClient } = require('@supabase/supabase-js');

// Create Supabase client with service role
const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  console.log('🚀 Creating products from releases...\n');
  
  try {
    // Check if products table exists and has data
    const { data: existingProducts, error: checkError } = await supabase
      .from('products')
      .select('id')
      .limit(1);
    
    if (existingProducts && existingProducts.length > 0) {
      console.log('✅ Products already exist. Checking current state...');
      
      const { data: products, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' });
      
      console.log(`📦 Found ${count} existing products`);
      
      if (products && products.length > 0) {
        console.log('\n📋 Sample existing products:');
        products.slice(0, 5).forEach(product => {
          console.log(`  • ${product.name} (${product.format}${product.featured ? ' - FEATURED' : ''})`);
        });
        console.log('\n🎉 Products already exist! Migration may be complete.');
        return;
      }
    }
    
    // Get all releases (no status filter since column doesn't exist)
    const { data: releases, error: releasesError } = await supabase
      .from('releases')
      .select('*')
      .order('release_date', { ascending: false });
    
    if (releasesError) {
      throw new Error(`Failed to fetch releases: ${releasesError.message}`);
    }
    
    console.log(`📦 Found ${releases.length} published releases to convert\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Create products from releases
    for (const release of releases) {
      try {
        const productData = {
          name: release.title,
          description: release.description || '',
          category: 'release',
          format: 'cd',
          release_id: release.id,
          images: release.cover_image_url ? [release.cover_image_url] : [],
          featured: release.featured || false,
          status: 'active',
          inventory_tracking: true,
          inventory_quantity: 100,
          sort_order: release.sort_order || 0,
          metadata: {
            original_release_id: release.id,
            release_date: release.release_date,
            genre: release.genre || '',
            label: release.record_label || '',
            catalog_number: release.catalog_number || ''
          }
        };
        
        console.log(`Creating: ${release.title}`);
        
        const { data: product, error: productError } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();
        
        if (productError) {
          console.error(`❌ Failed to create ${release.title}: ${productError.message}`);
          errorCount++;
          continue;
        }
        
        console.log(`✅ Created: ${product.name} (ID: ${product.id})`);
        successCount++;
        
      } catch (error) {
        console.error(`❌ Error processing ${release.title}: ${error.message}`);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Results:`);
    console.log(`✅ Successfully created: ${successCount} products`);
    console.log(`❌ Errors: ${errorCount}`);
    
    // Verify final results
    const { data: allProducts, count: totalCount } = await supabase
      .from('products')
      .select('*', { count: 'exact' });
    
    console.log(`\n🎉 Total products in database: ${totalCount}`);
    
    if (allProducts && allProducts.length > 0) {
      console.log('\n📦 Sample products created:');
      allProducts.slice(0, 5).forEach(product => {
        console.log(`  • ${product.name} (${product.format}${product.featured ? ' - FEATURED' : ''})`);
      });
    }
    
    console.log('\n✨ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

main();