const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAllTracklists() {
  console.log('🔍 CHECKING ALL TRACKLISTS ONE BY ONE\n');
  
  try {
    const { data: releases } = await supabase
      .from('releases')
      .select(`
        id,
        title,
        url,
        release_translations (
          language,
          tracklist
        )
      `)
      .order('id');
    
    console.log(`📋 Found ${releases.length} releases\n`);
    
    const emptyTracklists = [];
    const shortTracklists = [];
    const goodTracklists = [];
    
    releases.forEach((release) => {
      const enTranslation = release.release_translations?.find(t => t.language === 'en');
      
      console.log(`${release.id}. "${release.title}"`);
      console.log(`   URL: ${release.url}`);
      
      if (!enTranslation) {
        console.log('   ❌ No English translation');
        emptyTracklists.push(release);
      } else if (!enTranslation.tracklist) {
        console.log('   ❌ Tracklist is NULL');
        emptyTracklists.push(release);
      } else if (enTranslation.tracklist.length < 200) {
        console.log(`   ⚠️  Tracklist too short (${enTranslation.tracklist.length} chars)`);
        console.log(`   Content: ${enTranslation.tracklist.substring(0, 100)}...`);
        shortTracklists.push(release);
      } else {
        console.log(`   ✅ Good tracklist (${enTranslation.tracklist.length} chars)`);
        goodTracklists.push(release);
      }
      console.log('');
    });
    
    console.log('📊 SUMMARY:');
    console.log(`✅ Good tracklists: ${goodTracklists.length}`);
    console.log(`⚠️  Short tracklists: ${shortTracklists.length}`);
    console.log(`❌ Empty/missing tracklists: ${emptyTracklists.length}`);
    console.log('');
    
    if (emptyTracklists.length > 0) {
      console.log('❌ RELEASES WITH EMPTY/MISSING TRACKLISTS:');
      emptyTracklists.forEach(release => {
        console.log(`  - ID ${release.id}: "${release.title}"`);
      });
      console.log('');
    }
    
    if (shortTracklists.length > 0) {
      console.log('⚠️  RELEASES WITH SHORT TRACKLISTS:');
      shortTracklists.forEach(release => {
        console.log(`  - ID ${release.id}: "${release.title}"`);
      });
      console.log('');
    }
    
    if (goodTracklists.length > 0) {
      console.log('✅ RELEASES WITH GOOD TRACKLISTS:');
      goodTracklists.forEach(release => {
        console.log(`  - ID ${release.id}: "${release.title}"`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkAllTracklists();