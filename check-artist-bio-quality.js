const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkArtistBioQuality() {
  console.log('🔍 CHECKING ARTIST BIO QUALITY AND CONTENT\n');
  
  try {
    // Get all artists and their translations
    const { data: artists, error: artistError } = await supabase
      .from('artists')
      .select(`
        id,
        name,
        url,
        artist_translations (
          language,
          description
        )
      `)
      .order('id');
      
    if (artistError) {
      console.error('❌ Error fetching artists:', artistError);
      return;
    }
    
    console.log(`👥 ANALYZING ${artists.length} ARTISTS\n`);
    
    // Check for generic or poor quality translations
    let genericCount = 0;
    let shortBioCount = 0;
    
    for (const artist of artists) {
      console.log(`🎭 ${artist.name} (ID: ${artist.id})`);
      
      const translations = artist.artist_translations || [];
      const enTranslation = translations.find(t => t.language === 'en');
      const frTranslation = translations.find(t => t.language === 'fr');
      const deTranslation = translations.find(t => t.language === 'de');
      
      // Check English bio quality
      if (enTranslation) {
        const enLength = enTranslation.description.length;
        console.log(`  EN: ${enLength} chars - "${enTranslation.description.substring(0, 60)}..."`);
        
        if (enLength < 200) {
          shortBioCount++;
          console.log(`    ⚠️  Short bio (${enLength} chars)`);
        }
      } else {
        console.log(`  EN: ❌ MISSING`);
      }
      
      // Check French bio quality
      if (frTranslation) {
        const frLength = frTranslation.description.length;
        console.log(`  FR: ${frLength} chars - "${frTranslation.description.substring(0, 60)}..."`);
        
        // Check for generic French phrases
        const genericPhrases = [
          'est un artiste remarquable',
          'musicien accompli',
          'interprète de talent',
          'artiste de renom'
        ];
        
        const hasGeneric = genericPhrases.some(phrase => 
          frTranslation.description.toLowerCase().includes(phrase.toLowerCase())
        );
        
        if (hasGeneric) {
          genericCount++;
          console.log(`    ⚠️  Contains generic phrases`);
        }
      } else {
        console.log(`  FR: ❌ MISSING`);
      }
      
      // Check German bio quality  
      if (deTranslation) {
        const deLength = deTranslation.description.length;
        console.log(`  DE: ${deLength} chars - "${deTranslation.description.substring(0, 60)}..."`);
      } else {
        console.log(`  DE: ❌ MISSING`);
      }
      
      console.log(''); // Empty line for readability
    }
    
    // Summary
    console.log('\n📊 QUALITY ASSESSMENT SUMMARY:');
    console.log(`  Total artists analyzed: ${artists.length}`);
    console.log(`  Artists with short bios (<200 chars): ${shortBioCount}`);
    console.log(`  Artists with generic French text: ${genericCount}`);
    
    if (shortBioCount > 0 || genericCount > 0) {
      console.log('\n⚠️  ISSUES DETECTED - Need to create proper translations');
    } else {
      console.log('\n✅ All artist bios appear to have good quality content');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkArtistBioQuality();