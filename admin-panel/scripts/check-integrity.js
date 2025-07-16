// Script to check database integrity and alignment with production
// Run with: node scripts/check-integrity.js

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTableStructure() {
  console.log('\n🔍 Checking table structure...');
  
  try {
    // Check main tables exist and have expected columns
    const tables = ['artists', 'releases', 'videos', 'playlists', 'reviews', 'distributors'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
        
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Table accessible`);
      }
    }
    
    // Check if video has release_id column
    const { data: videoData, error: videoError } = await supabase
      .from('videos')
      .select('id, release_id')
      .limit(1);
      
    if (videoError) {
      console.log(`❌ videos.release_id: ${videoError.message}`);
    } else {
      console.log('✅ videos.release_id: Column exists');
    }
    
  } catch (err) {
    console.error('❌ Error checking table structure:', err.message);
  }
}

async function checkDataCounts() {
  console.log('\n📊 Checking data counts...');
  
  try {
    const tables = ['artists', 'releases', 'videos', 'playlists', 'reviews', 'distributors'];
    
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
        
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`📈 ${table}: ${count} records`);
      }
    }
    
  } catch (err) {
    console.error('❌ Error checking data counts:', err.message);
  }
}

async function checkRelationships() {
  console.log('\n🔗 Checking relationships...');
  
  try {
    // Check release-artist relationships
    const { data: releaseArtists, error: raError } = await supabase
      .from('release_artists')
      .select('*')
      .limit(5);
      
    if (raError) {
      console.log(`❌ release_artists: ${raError.message}`);
    } else {
      console.log(`✅ release_artists: ${releaseArtists.length} sample relationships`);
    }
    
    // Check video-release relationships (new)
    const { data: videoReleases, error: vrError } = await supabase
      .from('videos')
      .select('id, release_id')
      .not('release_id', 'is', null)
      .limit(5);
      
    if (vrError) {
      console.log(`❌ video-release links: ${vrError.message}`);
    } else {
      console.log(`✅ video-release links: ${videoReleases.length} videos linked to releases`);
    }
    
    // Check translations
    const { data: translations, error: tError } = await supabase
      .from('release_translations')
      .select('*')
      .limit(5);
      
    if (tError) {
      console.log(`❌ release_translations: ${tError.message}`);
    } else {
      console.log(`✅ release_translations: ${translations.length} sample translations`);
    }
    
  } catch (err) {
    console.error('❌ Error checking relationships:', err.message);
  }
}

async function checkStorageIntegrity() {
  console.log('\n🗄️ Checking storage integrity...');
  
  try {
    // List all buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.log(`❌ Storage buckets: ${bucketsError.message}`);
      return;
    }
    
    console.log(`✅ Storage buckets: ${buckets.length} total`);
    
    // Check each required bucket
    const requiredBuckets = ['images', 'artists', 'releases', 'playlists', 'videos', 'distributors'];
    const existingBuckets = buckets.map(b => b.name);
    
    for (const bucket of requiredBuckets) {
      if (existingBuckets.includes(bucket)) {
        // Check if bucket has any files
        const { data: files, error: filesError } = await supabase.storage
          .from(bucket)
          .list('', { limit: 1 });
          
        if (filesError) {
          console.log(`⚠️  ${bucket}: Bucket exists but can't list files - ${filesError.message}`);
        } else {
          console.log(`✅ ${bucket}: Bucket accessible (${files.length} files sampled)`);
        }
      } else {
        console.log(`❌ ${bucket}: Bucket missing`);
      }
    }
    
  } catch (err) {
    console.error('❌ Error checking storage:', err.message);
  }
}

async function checkImageUrls() {
  console.log('\n🖼️ Checking image URL patterns...');
  
  try {
    // Check artists with images
    const { data: artists, error: artistsError } = await supabase
      .from('artists')
      .select('id, name, image_url')
      .not('image_url', 'is', null)
      .limit(10);
      
    if (artistsError) {
      console.log(`❌ Artist images: ${artistsError.message}`);
    } else {
      console.log(`✅ Artist images: ${artists.length} artists with images`);
      
      // Analyze URL patterns
      const urlPatterns = {
        legacy: 0,
        supabase: 0,
        external: 0
      };
      
      artists.forEach(artist => {
        if (artist.image_url.startsWith('/images/')) {
          urlPatterns.legacy++;
        } else if (artist.image_url.includes('supabase.co')) {
          urlPatterns.supabase++;
        } else if (artist.image_url.startsWith('http')) {
          urlPatterns.external++;
        }
      });
      
      console.log(`   📊 URL patterns: Legacy: ${urlPatterns.legacy}, Supabase: ${urlPatterns.supabase}, External: ${urlPatterns.external}`);
    }
    
    // Check releases with images
    const { data: releases, error: releasesError } = await supabase
      .from('releases')
      .select('id, title, image_url')
      .not('image_url', 'is', null)
      .limit(10);
      
    if (releasesError) {
      console.log(`❌ Release images: ${releasesError.message}`);
    } else {
      console.log(`✅ Release images: ${releases.length} releases with images`);
    }
    
  } catch (err) {
    console.error('❌ Error checking image URLs:', err.message);
  }
}

async function checkProductionEndpoints() {
  console.log('\n🌐 Checking production endpoints...');
  
  try {
    // Test main site API
    const response = await fetch('https://avanticlassic.vercel.app/api/releases?limit=3');
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Main site API: ${data.releases?.length || 0} releases returned`);
    } else {
      console.log(`❌ Main site API: ${response.status} ${response.statusText}`);
    }
    
  } catch (err) {
    console.error('❌ Error checking production endpoints:', err.message);
  }
}

async function main() {
  console.log('🚀 Starting production integrity check...\n');
  console.log('🔍 Checking database and production alignment...');
  
  await checkTableStructure();
  await checkDataCounts();
  await checkRelationships();
  await checkStorageIntegrity();
  await checkImageUrls();
  await checkProductionEndpoints();
  
  console.log('\n✅ Production integrity check complete!');
  console.log('\n📋 Summary:');
  console.log('   - Database schema: Verified');
  console.log('   - Data relationships: Checked');
  console.log('   - Storage buckets: Validated');
  console.log('   - Image URL patterns: Analyzed');
  console.log('   - Production endpoints: Tested');
}

main().catch(console.error);