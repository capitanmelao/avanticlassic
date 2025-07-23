const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mapping from release data - this is the correct data from the fallback
const releaseCorrections = {
  "34": {
    title: "Martha Argerich plays Beethoven & Ravel",
    artist: "Martha Argerich",
    description: "Iconic piano concertos with the Israel Philharmonic Orchestra, showcasing Argerich's legendary artistry."
  },
  // Add more corrections as needed
};

async function fixDatabaseData() {
  console.log('🔧 Starting database data cleanup...\n');
  
  try {
    // Step 1: Check current state of problematic releases
    console.log('📊 Checking current database state...');
    const { data: releases, error: fetchError } = await supabase
      .from('releases')
      .select(`
        id,
        title,
        release_artists(
          artist:artists(
            id,
            name,
            url
          )
        ),
        release_translations(
          language,
          description
        )
      `)
      .eq('id', 34);
      
    if (fetchError) {
      console.error('❌ Error fetching releases:', fetchError);
      return;
    }
    
    console.log(`Found ${releases.length} releases to check\n`);
    
    // Step 2: Fix artist data for release 34
    console.log('🎯 Fixing release 34 (Martha Argerich)...');
    
    const release34 = releases.find(r => r.id === 34);
    if (release34) {
      console.log('Current state:', {
        title: release34.title,
        artists: release34.release_artists?.map(ra => ra.artist?.name),
        descriptions: release34.release_translations?.map(rt => ({ lang: rt.language, hasDesc: !!rt.description }))
      });
      
      // Step 3: Create or update Martha Argerich artist
      console.log('\n🎨 Creating/updating Martha Argerich artist...');
      const { data: marthaArtist, error: artistError } = await supabase
        .from('artists')
        .upsert({
          name: 'Martha Argerich',
          url: 'Martha-Argerich',
          image_url: '/images/artists/martha-argerich.jpg',
          featured: true,
          sort_order: 1
        }, {
          onConflict: 'url',
          ignoreDuplicates: false
        })
        .select()
        .single();
        
      if (artistError) {
        console.error('❌ Error creating Martha Argerich artist:', artistError);
        return;
      }
      
      console.log('✅ Martha Argerich artist:', marthaArtist);
      
      // Step 4: Update release_artists association
      console.log('\n🔗 Updating release-artist association...');
      
      // First, remove existing associations for this release
      const { error: deleteError } = await supabase
        .from('release_artists')
        .delete()
        .eq('release_id', 34);
        
      if (deleteError) {
        console.error('❌ Error removing old associations:', deleteError);
        return;
      }
      
      // Add new association
      const { error: insertError } = await supabase
        .from('release_artists')
        .insert({
          release_id: 34,
          artist_id: marthaArtist.id
        });
        
      if (insertError) {
        console.error('❌ Error creating new association:', insertError);
        return;
      }
      
      console.log('✅ Release-artist association updated');
      
      // Step 5: Add missing description to release_translations
      console.log('\n📝 Adding missing description...');
      
      const description = "Iconic piano concertos with the Israel Philharmonic Orchestra, showcasing Argerich's legendary artistry.";
      
      // Upsert descriptions for all languages
      const languages = ['en', 'fr', 'de'];
      for (const lang of languages) {
        const { error: translationError } = await supabase
          .from('release_translations')
          .upsert({
            release_id: 34,
            language: lang,
            description: description
          }, {
            onConflict: 'release_id,language',
            ignoreDuplicates: false
          });
          
        if (translationError) {
          console.error(`❌ Error updating ${lang} description:`, translationError);
        } else {
          console.log(`✅ ${lang} description updated`);
        }
      }
    }
    
    // Step 6: Verify the fix
    console.log('\n🔍 Verifying the fix...');
    const { data: verifyRelease, error: verifyError } = await supabase
      .from('releases')
      .select(`
        id,
        title,
        release_artists(
          artist:artists(
            id,
            name,
            url
          )
        ),
        release_translations(
          language,
          description
        )
      `)
      .eq('id', 34)
      .single();
      
    if (verifyError) {
      console.error('❌ Error verifying fix:', verifyError);
      return;
    }
    
    console.log('\n✅ Fixed state:', {
      title: verifyRelease.title,
      artists: verifyRelease.release_artists?.map(ra => ra.artist?.name),
      descriptions: verifyRelease.release_translations?.map(rt => ({ 
        lang: rt.language, 
        description: rt.description?.substring(0, 50) + '...' 
      }))
    });
    
    console.log('\n🎉 Database cleanup completed successfully!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixDatabaseData();