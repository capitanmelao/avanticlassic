const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkArtistTranslationsStructure() {
  console.log('🔍 CHECKING ARTIST TRANSLATIONS TABLE STRUCTURE\n');
  
  try {
    // Check if artist_translations table exists and its current state
    const { data: existingTranslations, error: fetchError } = await supabase
      .from('artist_translations')
      .select('*')
      .limit(5);
      
    if (fetchError) {
      console.error('❌ Error accessing artist_translations table:', fetchError);
      return;
    }
    
    console.log('✅ artist_translations table exists');
    console.log(`📊 Sample records found: ${existingTranslations?.length || 0}`);
    
    if (existingTranslations && existingTranslations.length > 0) {
      console.log('\n📋 EXISTING TRANSLATION STRUCTURE:');
      console.log(existingTranslations[0]);
    }
    
    // Get all artists from main table
    const { data: artists, error: artistError } = await supabase
      .from('artists')
      .select('id, name, url')
      .order('id');
      
    if (artistError) {
      console.error('❌ Error fetching artists:', artistError);
      return;
    }
    
    console.log(`\n👥 TOTAL ARTISTS IN DATABASE: ${artists.length}`);
    
    // Check current translation coverage
    const { data: allTranslations, error: allTransError } = await supabase
      .from('artist_translations')
      .select('artist_id, language, description')
      .order('artist_id');
      
    if (allTransError) {
      console.error('❌ Error fetching all translations:', allTransError);
      return;
    }
    
    const translationCounts = {
      en: allTranslations.filter(t => t.language === 'en').length,
      fr: allTranslations.filter(t => t.language === 'fr').length,
      de: allTranslations.filter(t => t.language === 'de').length
    };
    
    console.log('\n📊 CURRENT TRANSLATION COVERAGE:');
    console.log(`  English bios: ${translationCounts.en}/${artists.length}`);
    console.log(`  French bios: ${translationCounts.fr}/${artists.length}`);
    console.log(`  German bios: ${translationCounts.de}/${artists.length}`);
    
    // Show which artists need translations
    const artistsWithTranslations = new Set(allTranslations.map(t => t.artist_id));
    const artistsNeedingTranslations = artists.filter(a => !artistsWithTranslations.has(a.id));
    
    if (artistsNeedingTranslations.length > 0) {
      console.log('\n❌ ARTISTS MISSING TRANSLATIONS:');
      artistsNeedingTranslations.forEach(artist => {
        console.log(`  - ID ${artist.id}: ${artist.name} (${artist.url})`);
      });
    } else {
      console.log('\n✅ All artists have some translations');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkArtistTranslationsStructure();