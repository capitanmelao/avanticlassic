const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://cfyndmpjohwtvzljtypr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM'
);

async function checkDatabaseState() {
  console.log('=== E-COMMERCE DATABASE STATE ANALYSIS ===\n');
  
  // List of e-commerce tables to check
  const ecommerceTables = [
    'products',
    'product_prices', 
    'customers',
    'customer_addresses',
    'orders',
    'order_items',
    'cart_items',
    'product_categories',
    'product_category_relations',
    'discount_codes',
    'discount_usage',
    'stripe_webhook_events'
  ];
  
  console.log('1. CHECKING EXISTING TABLES:\n');
  
  // Check which tables exist by trying to query them
  const existingTables = [];
  
  for (const table of ecommerceTables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (!error) {
        existingTables.push(table);
      }
    } catch (e) {
      // Table doesn't exist
    }
  }
  
  const missingTables = ecommerceTables.filter(t => !existingTables.includes(t));
  
  console.log('✅ EXISTING E-COMMERCE TABLES:');
  existingTables.forEach(table => console.log(`  - ${table}`));
  
  console.log('\n❌ MISSING E-COMMERCE TABLES:');
  missingTables.forEach(table => console.log(`  - ${table}`));
  
  // Check data in existing tables
  console.log('\n2. DATA IN EXISTING TABLES:\n');
  
  for (const table of existingTables) {
    console.log(`--- ${table.toUpperCase()} ---`);
    
    // Check if table has any data
    const { count, error: countError } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
      
    if (!countError) {
      console.log(`  Records: ${count || 0}`);
    } else {
      console.log(`  Error counting records: ${countError.message}`);
    }
    
    // Try to get first few records to understand structure
    const { data: sample, error: sampleError } = await supabase
      .from(table)
      .select('*')
      .limit(1);
      
    if (!sampleError && sample && sample.length > 0) {
      console.log(`  Sample structure:`, Object.keys(sample[0]));
    }
    
    console.log('');
  }
  
  // Check if product_prices table exists and try to understand its structure
  if (existingTables.includes('product_prices')) {
    console.log('3. PRODUCT_PRICES TABLE DETAILED ANALYSIS:\n');
    
    // Try to insert a test record to see what fails
    const { error: testError } = await supabase
      .from('product_prices')
      .insert({
        product_id: 999999,
        stripe_price_id: 'test_price',
        currency: 'USD',
        amount: 1000,
        type: 'one_time',
        active: true
      });
      
    if (testError) {
      console.log('Test insert error:', testError.message);
      console.log('This tells us what columns/constraints exist');
    } else {
      console.log('Test insert succeeded - cleaning up...');
      // Clean up the test record
      await supabase
        .from('product_prices')
        .delete()
        .eq('product_id', 999999);
    }
  }
  
  // Check if convert_releases_to_products function exists
  console.log('\n4. CHECKING FOR CONVERT_RELEASES_TO_PRODUCTS FUNCTION:\n');
  
  const { data: functionResult, error: functionError } = await supabase
    .rpc('convert_releases_to_products');
    
  if (functionError) {
    console.log('Function error:', functionError.message);
    console.log('This tells us if the function exists and what it needs');
  } else {
    console.log('Function exists and executed successfully');
  }
  
  console.log('\n=== ANALYSIS COMPLETE ===');
}

checkDatabaseState().catch(console.error);