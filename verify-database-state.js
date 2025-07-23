const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyDatabaseState() {
  console.log('🔍 VERIFYING PRODUCTION DATABASE STATE\n');
  
  try {
    // Check Manu Comté artist URL
    console.log('1. CHECKING MANU COMTÉ ARTIST URL:');
    const { data: manuArtist, error: manuError } = await supabase
      .from('artists')
      .select('id, name, url')
      .eq('name', 'Manu Comté')
      .single();
      
    if (manuError) {
      console.error('❌ Error fetching Manu Comté:', manuError);
    } else if (manuArtist) {
      console.log(`  ✅ ID: ${manuArtist.id}`);
      console.log(`  ✅ Name: ${manuArtist.name}`);
      console.log(`  ✅ URL: ${manuArtist.url}`);
    } else {
      console.log('  ❌ Manu Comté not found');
    }
    
    // Check release descriptions translations
    console.log('\n2. CHECKING RELEASE TRANSLATIONS STATUS:');
    const { data: translations, error: transError } = await supabase
      .from('release_translations')
      .select('release_id, language, description')
      .order('release_id')
      .order('language');
      
    if (transError) {
      console.error('❌ Error fetching translations:', transError);
    } else {
      // Count translations by language
      const translationCounts = {
        en: translations.filter(t => t.language === 'en').length,
        fr: translations.filter(t => t.language === 'fr').length,
        de: translations.filter(t => t.language === 'de').length
      };
      
      console.log(`  📊 English descriptions: ${translationCounts.en}/37`);
      console.log(`  📊 French descriptions: ${translationCounts.fr}/37`);
      console.log(`  📊 German descriptions: ${translationCounts.de}/37`);
      
      // Check for generic placeholders
      const genericFrench = translations.filter(t => 
        t.language === 'fr' && 
        t.description && 
        t.description.includes('Cet enregistrement présente des performances exceptionnelles')
      );
      
      console.log(`  🔍 Generic French placeholders found: ${genericFrench.length}`);
      
      if (genericFrench.length > 0) {
        console.log('  ❌ STILL HAS GENERIC PLACEHOLDERS:');
        genericFrench.slice(0, 5).forEach(t => {
          console.log(`    - Release ${t.release_id}: "${t.description.substring(0, 80)}..."`);
        });
      } else {
        console.log('  ✅ No generic placeholders found');
      }
    }
    
    // Sample specific releases
    console.log('\n3. CHECKING SPECIFIC RELEASE DESCRIPTIONS:');
    const sampleReleases = [1, 10, 20, 37];
    
    for (const releaseId of sampleReleases) {
      console.log(`\n  📀 Release ${releaseId}:`);
      const { data: sampleTrans, error: sampleError } = await supabase
        .from('release_translations')
        .select('language, description')
        .eq('release_id', releaseId)
        .order('language');
        
      if (sampleError) {
        console.error(`    ❌ Error: ${sampleError.message}`);
      } else {
        sampleTrans.forEach(t => {
          const preview = t.description ? t.description.substring(0, 60) + '...' : 'NO DESCRIPTION';
          console.log(`    ${t.language.toUpperCase()}: ${preview}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

verifyDatabaseState();