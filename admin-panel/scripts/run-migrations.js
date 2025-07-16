// Script to run database migrations
// Run with: node scripts/run-migrations.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration(migrationFile) {
  console.log(`\n📄 Running migration: ${migrationFile}`);
  
  try {
    const filePath = path.join(__dirname, '../supabase/migrations', migrationFile);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Split SQL statements by semicolon and filter out empty statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      console.log(`\n🔧 Executing: ${statement.substring(0, 50)}...`);
      
      // Use raw RPC call for SQL execution
      const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: statement + ';'
      }).single();
      
      if (error) {
        // If RPC doesn't exist, try direct approach
        if (error.message.includes('exec_sql')) {
          console.log('⚠️  Direct SQL execution not available via RPC');
          console.log('📋 Please run this SQL in Supabase SQL Editor:');
          console.log('---');
          console.log(statement + ';');
          console.log('---');
        } else {
          console.error('❌ Error:', error.message);
        }
      } else {
        console.log('✅ Success');
      }
    }
  } catch (err) {
    console.error('❌ Failed to run migration:', err.message);
  }
}

async function checkVideoReleaseColumn() {
  console.log('\n🔍 Checking if release_id column exists in videos table...');
  
  const { data, error } = await supabase
    .from('videos')
    .select('id, release_id')
    .limit(1);
    
  if (error) {
    if (error.message.includes('column "release_id" does not exist')) {
      console.log('❌ Column release_id does not exist - migration needed');
      return false;
    }
    console.error('❌ Error checking column:', error.message);
    return false;
  }
  
  console.log('✅ Column release_id already exists');
  return true;
}

async function checkStorageBuckets() {
  console.log('\n🔍 Checking storage buckets...');
  
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('❌ Error listing buckets:', error.message);
      return false;
    }
    
    const requiredBuckets = ['images', 'artists', 'releases', 'playlists', 'videos', 'distributors'];
    const existingBuckets = buckets.map(b => b.name);
    
    console.log('📦 Existing buckets:', existingBuckets);
    
    const missingBuckets = requiredBuckets.filter(b => !existingBuckets.includes(b));
    
    if (missingBuckets.length > 0) {
      console.log('❌ Missing buckets:', missingBuckets);
      return false;
    }
    
    console.log('✅ All required buckets exist');
    return true;
  } catch (err) {
    console.error('❌ Error checking buckets:', err.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting database migrations...\n');
  
  // Check and run video-release migration
  const hasReleaseColumn = await checkVideoReleaseColumn();
  if (!hasReleaseColumn) {
    console.log('\n📌 Please run the following SQL in your Supabase SQL Editor:');
    console.log('   (Dashboard → SQL Editor → New Query)\n');
    
    const migrationPath = path.join(__dirname, '../supabase/migrations/006_add_video_release_link.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    console.log('```sql');
    console.log(migrationSql);
    console.log('```\n');
  }
  
  // Check storage buckets
  const hasBuckets = await checkStorageBuckets();
  if (!hasBuckets) {
    console.log('\n📌 Storage buckets need to be created.');
    console.log('   Please run the following SQL in your Supabase SQL Editor:\n');
    
    const migrationPath = path.join(__dirname, '../supabase/migrations/007_create_storage_buckets.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    console.log('```sql');
    console.log(migrationSql);
    console.log('```\n');
  }
  
  if (hasReleaseColumn && hasBuckets) {
    console.log('\n✅ All migrations are already applied!');
  } else {
    console.log('\n📝 Summary:');
    console.log('   - Video-Release Link:', hasReleaseColumn ? '✅ Applied' : '❌ Needs migration');
    console.log('   - Storage Buckets:', hasBuckets ? '✅ Created' : '❌ Need creation');
    console.log('\n💡 Copy the SQL above and run it in your Supabase SQL Editor');
    console.log('   URL: https://supabase.com/dashboard/project/cfyndmpjohwtvzljtypr/sql');
  }
}

main().catch(console.error);