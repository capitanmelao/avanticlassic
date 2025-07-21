// This script registers the production domain with Apple Pay through Stripe
// This needs to be done for Apple Pay buttons to appear

const DOMAIN_TO_REGISTER = 'avanticlassic.vercel.app';

async function setupApplePayDomain() {
  console.log('🍎 SETTING UP APPLE PAY DOMAIN REGISTRATION\n');
  
  try {
    console.log('1. REGISTERING DOMAIN WITH STRIPE APPLE PAY:');
    console.log(`   Domain: ${DOMAIN_TO_REGISTER}`);
    
    // Call the setup API endpoint we created
    const baseUrl = 'https://avanticlassic.vercel.app';
    
    const response = await fetch(`${baseUrl}/api/admin/setup-apple-pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        domains: [DOMAIN_TO_REGISTER]
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('\n2. REGISTRATION RESULT:');
    console.log('   Response:', JSON.stringify(result, null, 2));
    
    if (result.success > 0) {
      console.log('\n✅ APPLE PAY DOMAIN REGISTRATION SUCCESSFUL!');
      console.log('   🍎 Apple Pay buttons should now appear in Express Checkout');
      console.log('   🔄 Clear your browser cache and reload the checkout page');
    } else {
      console.log('\n⚠️ DOMAIN MIGHT ALREADY BE REGISTERED');
      console.log('   Check the error details above');
    }
    
  } catch (error) {
    console.error('💥 Error setting up Apple Pay domain:', error);
    console.log('\n🔧 MANUAL SETUP INSTRUCTIONS:');
    console.log('1. Go to https://dashboard.stripe.com/settings/payment_methods');
    console.log('2. Click on "Apple Pay"');
    console.log(`3. Add domain: ${DOMAIN_TO_REGISTER}`);
    console.log('4. Save the changes');
  }
}

// Run the setup
setupApplePayDomain();