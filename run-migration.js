const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Create Supabase client
const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🚀 Starting e-commerce database migration...\n');
  
  try {
    // Read the first migration (create schema)
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'admin-panel/supabase/migrations/011_create_ecommerce_schema.sql'), 
      'utf8'
    );
    
    console.log('📋 Executing e-commerce schema creation...');
    const { error: schemaError } = await supabase.rpc('exec_sql', { sql: schemaSQL });
    
    if (schemaError) {
      console.error('❌ Schema creation failed:', schemaError);
      throw schemaError;
    }
    
    console.log('✅ E-commerce schema created successfully\n');
    
    // Read the second migration (convert releases)
    const conversionSQL = fs.readFileSync(
      path.join(__dirname, 'admin-panel/supabase/migrations/012_convert_releases_to_products.sql'), 
      'utf8'
    );
    
    console.log('📋 Converting releases to products...');
    const { error: conversionError } = await supabase.rpc('exec_sql', { sql: conversionSQL });
    
    if (conversionError) {
      console.error('❌ Release conversion failed:', conversionError);
      throw conversionError;
    }
    
    console.log('✅ Releases converted to products successfully\n');
    
    // Verify the migration results
    console.log('📊 Verifying migration results...\n');
    
    // Count products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*', { count: 'exact' });
    
    if (!productsError) {
      console.log(`✅ Products created: ${products.length}`);
    }
    
    // Count product prices
    const { data: prices, error: pricesError } = await supabase
      .from('product_prices')
      .select('*', { count: 'exact' });
    
    if (!pricesError) {
      console.log(`✅ Product prices created: ${prices.length}`);
    }
    
    // Count categories
    const { data: categories, error: categoriesError } = await supabase
      .from('product_categories')
      .select('*', { count: 'exact' });
    
    if (!categoriesError) {
      console.log(`✅ Product categories created: ${categories.length}`);
    }
    
    // Count discount codes
    const { data: discounts, error: discountsError } = await supabase
      .from('discount_codes')
      .select('*', { count: 'exact' });
    
    if (!discountsError) {
      console.log(`✅ Discount codes created: ${discounts.length}`);
    }
    
    // Show sample products
    const { data: sampleProducts } = await supabase
      .from('products')
      .select('name, format, featured')
      .limit(5);
    
    if (sampleProducts && sampleProducts.length > 0) {
      console.log('\n📦 Sample products created:');
      sampleProducts.forEach(product => {
        console.log(`  • ${product.name} (${product.format}${product.featured ? ' - FEATURED' : ''})`);
      });
    }
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('✨ Your classical music releases are now e-commerce ready!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();