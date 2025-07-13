// Test database connection and check if tables exist
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  console.log('🔄 Testing Supabase connection...\n');

  try {
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('artists')
      .select('count')
      .limit(1);

    if (connectionError) {
      console.error('❌ Connection failed:', connectionError.message);
      return;
    }

    console.log('✅ Connected to Supabase successfully');

    // Check table existence and count data
    const tables = ['artists', 'releases', 'videos', 'distributors', 'playlists', 'news', 'reviews'];
    
    console.log('\n📊 Table Status:');
    
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.log(`❌ ${table}: Table missing or error - ${error.message}`);
        } else {
          console.log(`✅ ${table}: ${count || 0} records`);
        }
      } catch (err) {
        console.log(`❌ ${table}: Error - ${err.message}`);
      }
    }

    // Test a specific query
    console.log('\n🧪 Testing specific queries:');
    
    const { data: artistsData, error: artistsError } = await supabase
      .from('artists')
      .select('id, name, url')
      .limit(3);

    if (artistsError) {
      console.log('❌ Artists query failed:', artistsError.message);
    } else {
      console.log(`✅ Artists query successful: ${artistsData?.length || 0} results`);
      if (artistsData && artistsData.length > 0) {
        console.log('   Sample artists:', artistsData.map(a => a.name).join(', '));
      }
    }

    const { data: releasesData, error: releasesError } = await supabase
      .from('releases')
      .select('id, title, url')
      .limit(3);

    if (releasesError) {
      console.log('❌ Releases query failed:', releasesError.message);
    } else {
      console.log(`✅ Releases query successful: ${releasesData?.length || 0} results`);
      if (releasesData && releasesData.length > 0) {
        console.log('   Sample releases:', releasesData.map(r => r.title).join(', '));
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testConnection();