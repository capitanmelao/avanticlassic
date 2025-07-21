const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestProduct() {
  console.log('💰 CREATING €1 TEST PRODUCT FOR PAYMENT TESTING\n');
  
  try {
    // First, check if test product already exists
    console.log('1. CHECKING FOR EXISTING TEST PRODUCT:');
    const { data: existingProduct, error: checkError } = await supabase
      .from('products')
      .select('*')
      .eq('name', 'Payment Test Product')
      .single();
      
    if (existingProduct) {
      console.log('  ✅ Test product already exists:');
      console.log(`     ID: ${existingProduct.id}`);
      console.log(`     Name: ${existingProduct.name}`);
      console.log(`     Price: €${existingProduct.price / 100}`);
      console.log('     You can use this for testing!');
      return;
    }
    
    // Create the test product
    console.log('2. CREATING NEW TEST PRODUCT:');
    const testProduct = {
      stripe_product_id: 'test-payment-product-001',
      name: 'Payment Test Product',
      description: 'Test product for €1 payment verification',
      type: 'digital',
      format: 'cd',
      status: 'active',
      release_id: 1, // Associate with first release for simplicity
      images: ['https://via.placeholder.com/400x400/007bff/ffffff?text=€1+Test'],
      metadata: {
        test_product: true,
        purpose: 'payment_testing'
      },
      inventory_quantity: 999,
      inventory_tracking: false, // Don't track inventory for test product
      featured: false,
      sort_order: 0
    };
    
    const { data: newProduct, error: createError } = await supabase
      .from('products')
      .insert([testProduct])
      .select()
      .single();
      
    if (createError) {
      console.error('❌ Error creating test product:', createError);
      return;
    }
    
    console.log('  ✅ Test product created successfully:');
    console.log(`     ID: ${newProduct.id}`);
    console.log(`     Name: ${newProduct.name}`);
    console.log(`     Format: ${newProduct.format}`);
    
    console.log('\n3. CREATING PRODUCT PRICE:');
    // Create the price record in the product_prices table
    const testPrice = {
      product_id: newProduct.id,
      stripe_price_id: 'price_test_payment_001',
      currency: 'EUR',
      amount: 100, // €1.00 in cents
      type: 'one_time',
      active: true
    };
    
    const { data: newPrice, error: priceError } = await supabase
      .from('product_prices')
      .insert([testPrice])
      .select()
      .single();
      
    if (priceError) {
      console.log('  ⚠️ Could not create price record:', priceError.message);
      console.log('     Product created but price needs to be added manually');
    } else {
      console.log('  ✅ Product price created successfully');
      console.log(`     Price ID: ${newPrice.id}`);
      console.log(`     Amount: €${newPrice.amount / 100}`);
    }
    
    console.log('\n🎉 TEST PRODUCT SETUP COMPLETE!');
    console.log('✅ You can now:');
    console.log('   1. Go to the shop page');
    console.log('   2. Add the "Payment Test Product" to cart');
    console.log('   3. Test the payment with €1 + minimal fees');
    console.log('   4. Total should be around €1.55 (€1 + €0.50 shipping + 5% tax)');
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Run the script
createTestProduct();