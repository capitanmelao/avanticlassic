// Script to check actual database structure
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://cfyndmpjohwtvzljtypr.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM'
);

async function checkDatabase() {
  console.log('🔍 Checking actual database structure...\n');
  
  // Check videos table
  console.log('📋 Videos table structure:');
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .limit(1);
      
    if (error) {
      console.log('❌ Videos table error:', error.message);
    } else {
      console.log('✅ Videos table exists');
      if (data && data[0]) {
        console.log('   Columns found:', Object.keys(data[0]));
      }
    }
  } catch (err) {
    console.log('❌ Error checking videos:', err.message);
  }
  
  // Check if admin_users table exists
  console.log('\n📋 Checking authentication tables:');
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .limit(1);
      
    if (error) {
      console.log('❌ admin_users table does not exist:', error.message);
    } else {
      console.log('✅ admin_users table exists');
    }
  } catch (err) {
    console.log('❌ admin_users error:', err.message);
  }
  
  // Check for users table (Supabase auth)
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
      
    if (error) {
      console.log('❌ users table:', error.message);
    } else {
      console.log('✅ users table exists');
    }
  } catch (err) {
    console.log('❌ users error:', err.message);
  }
  
  // Try to see what tables actually exist
  console.log('\n📋 Available tables:');
  const tablesToCheck = ['videos', 'artists', 'releases', 'playlists', 'distributors', 'reviews', 'video_descriptions'];
  
  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
        
      if (error) {
        console.log(`   ${table}: ❌ ${error.message}`);
      } else {
        console.log(`   ${table}: ✅ exists`);
      }
    } catch (err) {
      console.log(`   ${table}: ❌ ${err.message}`);
    }
  }
}

checkDatabase().catch(console.error);