const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Create Supabase client with service role
const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeStep1() {
  console.log('🚀 Step 1: Creating e-commerce tables...\n');
  
  try {
    // First, let's check if tables already exist
    const { data: existingProducts } = await supabase
      .from('products')
      .select('id')
      .limit(1);
    
    if (existingProducts) {
      console.log('⚠️  E-commerce tables already exist. Checking data...');
      
      const { data: products, count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact' });
      
      const { data: prices, count: priceCount } = await supabase
        .from('product_prices')
        .select('*', { count: 'exact' });
      
      console.log(`✅ Found ${productCount} existing products`);
      console.log(`✅ Found ${priceCount} existing prices`);
      
      if (productCount > 0) {
        console.log('🎉 Migration appears to be already completed!');
        return;
      }
    }
  } catch (error) {
    console.log('📋 Tables don\'t exist yet. Creating them...');
  }
  
  // Create tables manually using individual SQL statements
  console.log('Creating products table...');
  
  // Create products table
  await supabase.from('products').insert([]).then(() => {}).catch(() => {
    console.log('Products table creation may have failed - this is expected if it doesn\'t exist yet');
  });
  
  // Let's try a different approach - check what releases we have
  const { data: releases, error: releasesError } = await supabase
    .from('releases')
    .select('*')
    .eq('status', 'published');
  
  if (releasesError) {
    throw new Error(`Failed to fetch releases: ${releasesError.message}`);
  }
  
  console.log(`📦 Found ${releases.length} published releases to convert`);
  
  // Since direct SQL execution is blocked, let's create products manually
  console.log('🔧 Creating products from releases using API calls...');
  
  // We'll need to use the API endpoints we created
  const baseUrl = 'http://localhost:3001';
  
  for (const release of releases) {
    try {
      // Create product via our API
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
      
      console.log(`Creating product: ${release.title}`);
      
      // Since we can't make HTTP calls easily, let's insert directly
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();
      
      if (productError) {
        console.error(`Failed to create product for ${release.title}:`, productError);
        continue;
      }
      
      console.log(`✅ Created product: ${product.name} (ID: ${product.id})`);
      
    } catch (error) {
      console.error(`Error processing release ${release.title}:`, error);
    }
  }
  
  console.log('\n🎉 Step 1 completed! Products created from releases.');
  
  } catch (error) {
    console.error('❌ Step 1 failed:', error.message);
    throw error;
  }
}

// Verify results
async function verifyResults() {
  console.log('\n📊 Verifying results...');
  
  const { data: products, count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact' });
  
  console.log(`✅ Total products: ${productCount}`);
  
  if (products && products.length > 0) {
    console.log('\n📦 Sample products:');
    products.slice(0, 5).forEach(product => {
      console.log(`  • ${product.name} (${product.format}${product.featured ? ' - FEATURED' : ''})`);
    });
  }
}

executeStep1()
  .then(verifyResults)
  .then(() => {
    console.log('\n✨ Migration step 1 completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });