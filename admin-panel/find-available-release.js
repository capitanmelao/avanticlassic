const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function findAvailableRelease() {
  console.log('🔍 FINDING RELEASE WITHOUT PRODUCT\n');
  
  try {
    // Get all releases
    const { data: releases, error: releasesError } = await supabase
      .from('releases')
      .select('id, title')
      .order('id');
      
    if (releasesError) {
      console.error('❌ Error fetching releases:', releasesError);
      return;
    }
    
    // Get all products and their release_ids
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('release_id');
      
    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }
    
    const usedReleaseIds = products.map(p => p.release_id);
    const availableReleases = releases.filter(r => !usedReleaseIds.includes(r.id));
    
    console.log(`📊 Total releases: ${releases.length}`);
    console.log(`📊 Releases with products: ${usedReleaseIds.length}`);
    console.log(`📊 Available releases: ${availableReleases.length}`);
    
    if (availableReleases.length > 0) {
      console.log('\n✅ AVAILABLE RELEASES FOR TEST PRODUCT:');
      availableReleases.slice(0, 5).forEach(r => {
        console.log(`  • Release ${r.id}: ${r.title}`);
      });
      
      const firstAvailable = availableReleases[0];
      console.log(`\n🎯 RECOMMENDED: Use release_id ${firstAvailable.id} for test product`);
    } else {
      console.log('\n⚠️ All releases already have products assigned');
      console.log('   Consider removing the unique constraint or creating a release specifically for testing');
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

findAvailableRelease();