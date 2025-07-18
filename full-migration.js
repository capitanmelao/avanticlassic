const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  console.log('🏗️  Creating e-commerce tables...\n');
  
  // Create products table
  const { error: productsError } = await supabase.rpc('run_sql', {
    query: `
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        format TEXT NOT NULL DEFAULT 'cd',
        release_id UUID REFERENCES releases(id),
        stripe_product_id TEXT UNIQUE,
        images JSONB DEFAULT '[]'::jsonb,
        featured BOOLEAN DEFAULT false,
        status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
        inventory_tracking BOOLEAN DEFAULT false,
        inventory_quantity INTEGER DEFAULT 0,
        sort_order INTEGER DEFAULT 0,
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  });
  
  if (productsError && !productsError.message.includes('already exists')) {
    console.error('Failed to create products table:', productsError);
    return false;
  }
  
  // Create product_prices table
  const { error: pricesError } = await supabase.rpc('run_sql', {
    query: `
      CREATE TABLE IF NOT EXISTS product_prices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        stripe_price_id TEXT UNIQUE,
        currency TEXT NOT NULL DEFAULT 'EUR',
        amount INTEGER NOT NULL,
        price_type TEXT NOT NULL DEFAULT 'one_time' CHECK (price_type IN ('one_time', 'recurring')),
        active BOOLEAN DEFAULT true,
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  });
  
  if (pricesError && !pricesError.message.includes('already exists')) {
    console.error('Failed to create product_prices table:', pricesError);
    return false;
  }
  
  console.log('✅ E-commerce tables created successfully\n');
  return true;
}

async function createProducts() {
  console.log('📦 Converting releases to products...\n');
  
  try {
    // Get all releases
    const { data: releases, error: releasesError } = await supabase
      .from('releases')
      .select('*')
      .order('release_date', { ascending: false });
    
    if (releasesError) {
      throw new Error(`Failed to fetch releases: ${releasesError.message}`);
    }
    
    console.log(`Found ${releases.length} releases to convert\n`);
    
    let successCount = 0;
    
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
          console.error(`❌ Failed: ${productError.message}`);
          continue;
        }
        
        // Create basic pricing
        const priceData = {
          product_id: product.id,
          currency: 'EUR',
          amount: 1990, // €19.90
          price_type: 'one_time',
          active: true,
          metadata: { format: 'cd', original_price: true }
        };
        
        const { error: priceError } = await supabase
          .from('product_prices')
          .insert(priceData);
        
        if (priceError) {
          console.error(`❌ Failed to create price: ${priceError.message}`);
        }
        
        console.log(`✅ Created: ${product.name}`);
        successCount++;
        
      } catch (error) {
        console.error(`❌ Error processing ${release.title}: ${error.message}`);
      }
    }
    
    return successCount;
  } catch (error) {
    console.error('❌ Failed to create products:', error.message);
    return 0;
  }
}

async function main() {
  console.log('🚀 Starting e-commerce migration...\n');
  
  try {
    // First try to see if tables exist
    const { data: existingProducts } = await supabase
      .from('products')
      .select('id')
      .limit(1);
    
    if (existingProducts) {
      console.log('✅ Products table already exists');
      
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact' });
      
      console.log(`📦 Found ${count} existing products`);
      
      if (count > 0) {
        console.log('🎉 Migration appears to be already completed!');
        return;
      }
    }
  } catch (error) {
    console.log('📋 Tables don\'t exist. Creating them...');
    
    // Create tables if they don't exist
    const tablesCreated = await createTables();
    if (!tablesCreated) {
      console.error('❌ Failed to create tables');
      return;
    }
  }
  
  // Create products
  const productsCreated = await createProducts();
  
  console.log(`\n📊 Final Results:`);
  console.log(`✅ Products created: ${productsCreated}`);
  
  // Verify results
  const { data: allProducts, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' });
  
  console.log(`🎉 Total products in database: ${count}`);
  
  if (allProducts && allProducts.length > 0) {
    console.log('\n📦 Sample products:');
    allProducts.slice(0, 5).forEach(product => {
      console.log(`  • ${product.name} (${product.format}${product.featured ? ' - FEATURED' : ''})`);
    });
  }
  
  console.log('\n✨ E-commerce migration completed!');
  
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}

main();