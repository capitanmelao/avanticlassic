const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkProducts() {
  console.log('🔍 CHECKING EXISTING PRODUCTS AND SCHEMA\n');
  
  try {
    // Check existing products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, format, type, status')
      .limit(5);
      
    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
    } else {
      console.log('📦 EXISTING PRODUCTS:');
      if (products.length === 0) {
        console.log('  No products found in database');
      } else {
        products.forEach(p => {
          console.log(`  • ${p.name} - Format: ${p.format}, Type: ${p.type}, Status: ${p.status}`);
        });
      }
    }
    
    // Check schema constraints by trying different formats
    console.log('\n🧪 TESTING FORMAT CONSTRAINTS:');
    const testFormats = ['cd', 'sacd', 'vinyl', 'digital_download'];
    
    for (const format of testFormats) {
      console.log(`  Testing format: ${format}`);
      const testData = {
        stripe_product_id: `test-format-${format}`,
        name: `Test ${format}`,
        description: 'Format test',
        type: 'digital',
        format: format,
        status: 'active'
      };
      
      const { data, error } = await supabase
        .from('products')
        .insert([testData])
        .select()
        .single();
        
      if (error) {
        console.log(`    ❌ ${format}: ${error.message}`);
      } else {
        console.log(`    ✅ ${format}: SUCCESS (ID: ${data.id})`);
        // Clean up test product
        await supabase.from('products').delete().eq('id', data.id);
      }
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

checkProducts();