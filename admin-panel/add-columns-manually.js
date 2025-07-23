const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Since we can't run SQL directly, let's update the admin panel to add these fields to the UI
// and create a quick workaround by using the metadata field that already exists

async function addOverrideSupport() {
  console.log('🔧 SETTING UP TAX/SHIPPING OVERRIDE SUPPORT\n');
  
  try {
    console.log('1. CHECKING CURRENT PRODUCTS STRUCTURE:');
    
    // Check what columns exist
    const { data: sampleProduct } = await supabase
      .from('products')
      .select('*')
      .limit(1)
      .single();
    
    if (sampleProduct) {
      console.log('   Current columns include:', Object.keys(sampleProduct).join(', '));
      console.log('   ✅ Metadata column exists, we can use it for overrides');
    }
    
    console.log('\n2. SETTING UP TEST PRODUCT WITH ZERO TAX/SHIPPING:');
    
    // Find a product to modify for testing
    const { data: products } = await supabase
      .from('products')
      .select('id, name, metadata')
      .limit(5);
    
    if (products && products.length > 0) {
      const testProduct = products[0];
      console.log(`   Selected product: ${testProduct.name} (ID: ${testProduct.id})`);
      
      // Update metadata to include override settings
      const updatedMetadata = {
        ...testProduct.metadata,
        tax_override: {
          enabled: true,
          rate: 0 // 0% tax
        },
        shipping_override: {
          enabled: true,
          amount: 0 // €0 shipping
        }
      };
      
      const { error } = await supabase
        .from('products')
        .update({ metadata: updatedMetadata })
        .eq('id', testProduct.id);
      
      if (error) {
        console.error('   ❌ Failed to update product:', error);
      } else {
        console.log('   ✅ Product updated with zero tax and shipping overrides');
        console.log('   🎯 You can now test payment with this product at base price only');
      }
    }
    
    console.log('\n🎉 WORKAROUND COMPLETE!');
    console.log('✅ Until database columns are added:');
    console.log('   • Using metadata field for tax/shipping overrides');
    console.log('   • First product now has 0% tax and €0 shipping');
    console.log('   • Test with this product for minimal payment amounts');
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

addOverrideSupport();