const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read environment variables from .env.local
let envContent = '';
try {
  envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
} catch (err) {
  try {
    envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  } catch (err2) {
    console.error('Could not find .env.local or .env file');
    process.exit(1);
  }
}

const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key] = value;
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkSchema() {
  console.log('=== CHECKING DATABASE SCHEMA ===\n');
  
  // Check releases table structure
  console.log('1. RELEASES TABLE STRUCTURE:');
  try {
    const { data, error } = await supabase
      .from('releases')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error querying releases:', error);
    } else {
      console.log('Sample release record:', data[0] ? Object.keys(data[0]) : 'No records');
    }
  } catch (err) {
    console.error('Failed to query releases table:', err);
  }
  
  // Check for existing e-commerce tables
  console.log('\n2. E-COMMERCE TABLES CHECK:');
  
  const ecommerceTables = ['products', 'product_prices', 'customers', 'orders', 'cart_items'];
  
  for (const table of ecommerceTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`- ${table}: NOT EXISTS (${error.message})`);
      } else {
        console.log(`- ${table}: EXISTS (${data?.length || 0} records)`);
      }
    } catch (err) {
      console.log(`- ${table}: ERROR - ${err.message}`);
    }
  }
  
  // Check releases data types and content
  console.log('\n3. RELEASES DATA ANALYSIS:');
  try {
    const { data, error } = await supabase
      .from('releases')
      .select('id, title, format, shop_url, featured, sort_order, created_at')
      .order('sort_order', { ascending: true })
      .limit(5);
    
    if (error) {
      console.error('Error getting releases data:', error);
    } else {
      console.log('Sample releases:');
      data.forEach((release, index) => {
        console.log(`  ${index + 1}. ID: ${release.id} (${typeof release.id})`);
        console.log(`     Title: ${release.title}`);
        console.log(`     Format: ${release.format}`);
        console.log(`     Shop URL: ${release.shop_url ? 'YES' : 'NO'}`);
        console.log(`     Featured: ${release.featured}`);
        console.log(`     Sort Order: ${release.sort_order}`);
        console.log('');
      });
    }
  } catch (err) {
    console.error('Failed to analyze releases:', err);
  }
  
  // Check for status column existence
  console.log('\n4. STATUS COLUMN CHECK:');
  try {
    const { data, error } = await supabase
      .from('releases')
      .select('id, status')
      .limit(1);
    
    if (error) {
      console.log('Status column: NOT EXISTS or ERROR -', error.message);
    } else {
      console.log('Status column: EXISTS');
      console.log('Sample status values:', data[0]?.status || 'No records');
    }
  } catch (err) {
    console.error('Status column check failed:', err);
  }
  
  // Check existing columns in releases table
  console.log('\n5. INFORMATION SCHEMA CHECK:');
  try {
    const { data, error } = await supabase
      .rpc('get_table_columns', { table_name: 'releases' });
    
    if (error) {
      console.log('Could not fetch schema info:', error.message);
    } else {
      console.log('Available columns:', data);
    }
  } catch (err) {
    console.log('Schema check not available via RPC');
  }
  
  console.log('\n=== SCHEMA CHECK COMPLETE ===');
}

checkSchema().catch(console.error);