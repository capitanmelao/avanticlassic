// Script to check and fix video schema mismatches
// Run with: node scripts/fix-video-schema.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkVideoSchema() {
  console.log('🔍 Checking video table schema...\n');
  
  try {
    // Try to select all expected fields
    const { data, error } = await supabase
      .from('videos')
      .select('id, url, title, artist_name, youtube_id, youtube_url, release_id')
      .limit(1);
      
    if (error) {
      console.error('❌ Schema issues found:', error.message);
      
      if (error.message.includes('column "url" does not exist')) {
        console.log('   - Missing: url column (for URL slugs)');
      }
      if (error.message.includes('column "artist_name" does not exist')) {
        console.log('   - Missing: artist_name column (for simplified artist display)');
      }
      
      return false;
    }
    
    console.log('✅ Video schema appears to be correct');
    
    // Check if any videos are missing url or artist_name values
    const { data: emptyFields, error: emptyError } = await supabase
      .from('videos')
      .select('id, url, artist_name, title')
      .or('url.is.null,artist_name.is.null');
      
    if (emptyError) {
      console.error('❌ Error checking for empty fields:', emptyError.message);
      return false;
    }
    
    if (emptyFields && emptyFields.length > 0) {
      console.log(`⚠️  Found ${emptyFields.length} videos with missing url or artist_name fields`);
      console.log('   These videos may need to be updated manually');
      return 'partial';
    }
    
    return true;
  } catch (err) {
    console.error('❌ Error checking schema:', err.message);
    return false;
  }
}

async function displayMigrationSQL() {
  console.log('\n📌 Please run the following SQL in your Supabase SQL Editor:');
  console.log('   (Dashboard → SQL Editor → New Query)\n');
  
  const migrationPath = path.join(__dirname, '../supabase/migrations/008_fix_video_schema_mismatches.sql');
  
  if (fs.existsSync(migrationPath)) {
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    console.log('```sql');
    console.log(migrationSql);
    console.log('```\n');
  } else {
    console.log('❌ Migration file not found:', migrationPath);
  }
  
  console.log('💡 After running the SQL, run this script again to verify the fix');
  console.log('   URL: https://supabase.com/dashboard/project/cfyndmpjohwtvzljtypr/sql');
}

async function testVideoOperations() {
  console.log('\n🧪 Testing video operations...');
  
  try {
    // Test if we can create a video with the expected fields
    const testVideo = {
      title: 'Test Video - Schema Check',
      url: 'test-video-schema-check',
      artist_name: 'Test Artist',
      youtube_id: 'dQw4w9WgXcQ', // Rick Astley - Never Gonna Give You Up
      featured: false,
      sort_order: 999
    };
    
    // Try to insert test video
    const { data: insertData, error: insertError } = await supabase
      .from('videos')
      .insert(testVideo)
      .select()
      .single();
      
    if (insertError) {
      console.error('❌ Insert test failed:', insertError.message);
      return false;
    }
    
    console.log('✅ Insert test passed');
    
    // Clean up test video
    await supabase
      .from('videos')
      .delete()
      .eq('id', insertData.id);
      
    console.log('✅ Cleanup completed');
    
    return true;
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Checking video schema consistency...\n');
  
  const schemaStatus = await checkVideoSchema();
  
  if (schemaStatus === true) {
    console.log('\n✅ Schema looks good! Testing video operations...');
    const testPassed = await testVideoOperations();
    
    if (testPassed) {
      console.log('\n🎉 Video schema is working correctly!');
      console.log('   You should now be able to create and edit videos in the admin panel.');
    } else {
      console.log('\n⚠️  Schema exists but video operations are failing');
      console.log('   There may be permission or validation issues.');
    }
  } else if (schemaStatus === 'partial') {
    console.log('\n⚠️  Schema exists but some videos have missing data');
    console.log('   The migration SQL will populate these fields automatically.');
    await displayMigrationSQL();
  } else {
    console.log('\n❌ Schema migration needed');
    await displayMigrationSQL();
  }
}

main().catch(console.error);