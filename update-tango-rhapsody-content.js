const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateTangoRhapsodyContent() {
  console.log('📝 UPDATING TANGO RHAPSODY DESCRIPTION AND TRACKLIST\n');
  
  try {
    // Updated description
    const newDescription = `Described by Gramophone as "a formidable Duo", celebrated South-Americans virtuosi Karin Lechner and Sergio Tiempo invite you to discover Tango Rhapsody, their exciting new recording for Avanticlassic. For this project, the Duo Lechner Tiempo selected eight Tango pieces that were specially arranged or composed for them by the most famous Argentinean composers. You will find such beloved pieces as 'La Muerte Del Angel', 'Adios Nonino' and 'The Secret in Their Eyes' – the music theme from the Oscar winner movie 'El secreto de sus ojos'.

Central to the album is the world premiere recording of the 'Tango Rhapsody': a concertante-theatrical piece dedicated to Karin Lechner and Sergio Tiempo and composed by one of the leading film composers of his generation: Federico Jusid. Premiered at the famous Progetto Martha Argerich festival, Lugano, this overtly passionate, virtuosic and cinematic work is not only meant to be played but includes also a scenic action. To allow you to get all the intensity emanating from the Tango Rhapsody, this limited edition contains a Bonus DVD featuring a complete performance filmed in Argentina.`;

    // Updated tracklist with proper formatting
    const newTracklist = `1. Astor Piazzolla (1921 –1992) - Michelangelo '70 (arr. Féderico Jusid) - 03:10
2. Astor Piazzolla - Revirado (arr. Pablo Ziegler) - 03:27
3. Pablo Ziegler (1944) - El Empedrado - 05:49
4. Pablo Ziegler - Sandunga - 04:13
5. Pablo Ziegler - Asflato - 05:17
6-9. Féderico Jusid (1973) - Tango Rhapsody for 2 pianos and orchestra : concertante-theatrical piece dedicated to Ms Karin Lechner and Mr Sergio Tiempo - 18:44
10. Pablo Ziegler - Milongueta - 07:57
11. Astor Piazzolla - La Muerte Del Angel (arr. Pablo Ziegler) - 03:23
12. Astor Piazzolla - Adios Nonino (arr. Pablo Ziegler) - 08:30
13. Féderico Jusid - Emilio Kauderer (1950) - The Secret in Their Eyes (arr. Féderico Jusid), theme from the movie 'El secreto de sus ojos' - 03:35`;

    // Get the Tango Rhapsody release
    const { data: release } = await supabase
      .from('releases')
      .select('id')
      .ilike('title', '%Tango Rhapsody%')
      .single();
      
    if (!release) {
      console.error('❌ Tango Rhapsody release not found');
      return;
    }
    
    console.log(`✅ Found Tango Rhapsody release ID: ${release.id}`);
    
    // Check if English translation exists
    const { data: existingTranslation } = await supabase
      .from('release_translations')
      .select('id')
      .eq('release_id', release.id)
      .eq('language', 'en')
      .single();
    
    if (existingTranslation) {
      // Update existing translation
      const { error: updateError } = await supabase
        .from('release_translations')
        .update({
          description: newDescription,
          tracklist: newTracklist
        })
        .eq('release_id', release.id)
        .eq('language', 'en');
      
      if (updateError) {
        console.error('❌ Error updating translation:', updateError);
        return;
      }
      
      console.log('✅ Updated existing English translation');
    } else {
      // Create new translation
      const { error: insertError } = await supabase
        .from('release_translations')
        .insert({
          release_id: release.id,
          language: 'en',
          description: newDescription,
          tracklist: newTracklist
        });
      
      if (insertError) {
        console.error('❌ Error creating translation:', insertError);
        return;
      }
      
      console.log('✅ Created new English translation');
    }
    
    console.log('\n🎉 TANGO RHAPSODY CONTENT UPDATED!');
    console.log('  • Updated description with complete text');
    console.log('  • Updated tracklist with proper formatting');
    console.log('  • All changes applied to production database');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

updateTangoRhapsodyContent();