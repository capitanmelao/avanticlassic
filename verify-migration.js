const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Database configuration
const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyMigration() {
  console.log('=== E-COMMERCE MIGRATION VERIFICATION ===\n');
  
  // Test connection
  const { data: testData, error: testError } = await supabase
    .from('releases')
    .select('count')
    .limit(1);
  
  if (testError) {
    console.error('❌ Database connection error:', testError);
    return;
  }
  
  console.log('✅ Database connection successful');
  
  // Check original releases data
  const { data: releases, error: releasesError } = await supabase
    .from('releases')
    .select('*');
  
  if (releasesError) {
    console.error('❌ Error fetching releases:', releasesError);
    return;
  }
  
  console.log(`📀 Found ${releases.length} releases in database`);
  
  // Check if products table exists and has data
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*');
  
  if (productsError) {
    console.log('❌ Products table not found or inaccessible:', productsError.message);
    console.log('\n🔧 MANUAL MIGRATION REQUIRED:');
    console.log('1. Go to Supabase Dashboard > SQL Editor');
    console.log('2. Copy and paste the contents of combined-migration.sql');
    console.log('3. Execute the script');
    console.log('4. Run this verification script again');
    return;
  }
  
  console.log(`🛍️  Found ${products.length} products in database`);
  
  // Check product prices
  const { data: prices, error: pricesError } = await supabase
    .from('product_prices')
    .select('*');
  
  if (pricesError) {
    console.log('❌ Product prices table not found:', pricesError.message);
    return;
  }
  
  console.log(`💰 Found ${prices.length} product prices`);
  
  // Check product categories
  const { data: categories, error: categoriesError } = await supabase
    .from('product_categories')
    .select('*');
  
  if (categoriesError) {
    console.log('❌ Product categories table not found:', categoriesError.message);
    return;
  }
  
  console.log(`📂 Found ${categories.length} product categories`);
  
  // Check discount codes
  const { data: discounts, error: discountsError } = await supabase
    .from('discount_codes')
    .select('*');
  
  if (discountsError) {
    console.log('❌ Discount codes table not found:', discountsError.message);
    return;
  }
  
  console.log(`🎟️  Found ${discounts.length} discount codes`);
  
  // Display sample data
  console.log('\n=== SAMPLE DATA ===');
  
  if (products.length > 0) {
    console.log('\n🛍️  Sample Products:');
    products.slice(0, 5).forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.format}) - Release ID: ${product.release_id}`);
    });
  }
  
  if (prices.length > 0) {
    console.log('\n💰 Sample Prices:');
    prices.slice(0, 5).forEach((price, index) => {
      const amount = (price.amount / 100).toFixed(2);
      const format = price.metadata?.format || 'unknown';
      console.log(`${index + 1}. €${amount} (${format}) - Product ID: ${price.product_id}`);
    });
  }
  
  if (categories.length > 0) {
    console.log('\n📂 Product Categories:');
    categories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name} - ${category.description}`);
    });
  }
  
  if (discounts.length > 0) {
    console.log('\n🎟️  Discount Codes:');
    discounts.forEach((discount, index) => {
      const value = discount.discount_type === 'percentage' ? `${discount.discount_value}%` : `€${(discount.discount_value / 100).toFixed(2)}`;
      console.log(`${index + 1}. ${discount.code} - ${value} off`);
    });
  }
  
  // Final summary
  console.log('\n=== MIGRATION SUMMARY ===');
  console.log(`✅ Releases in database: ${releases.length}`);
  console.log(`✅ Products created: ${products.length}`);
  console.log(`✅ Prices created: ${prices.length}`);
  console.log(`✅ Categories available: ${categories.length}`);
  console.log(`✅ Discount codes created: ${discounts.length}`);
  
  if (products.length > 0) {
    console.log('\n🎉 MIGRATION SUCCESSFUL!');
    console.log('E-commerce schema is ready for integration.');
    console.log('Next steps:');
    console.log('1. Integrate Stripe API');
    console.log('2. Build shopping cart functionality');
    console.log('3. Create product pages');
    console.log('4. Set up payment processing');
  } else {
    console.log('\n⚠️  MIGRATION INCOMPLETE');
    console.log('Products table exists but no data was migrated.');
    console.log('Please run the combined-migration.sql script manually.');
  }
}

verifyMigration().catch(console.error);