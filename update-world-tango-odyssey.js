const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateWorldTangoOdyssey() {
  console.log('📝 UPDATING WORLD TANGO ODYSSEY TRACKLIST FORMAT\n');
  
  try {
    // Professional classical music tracklist format
    const newTracklist = `**WORLD TANGO ODYSSEY**

**ROBY LAKATOS**, violin
**GANG TANGO** & **THE NEW VIBES STRING QUARTET**

─────────────────────────────────────────────────────

**1.** Carlos Gardel (1890-1935): **Volver** (Argentina) **[6:03]**

**2.** Gerardo Matos Rodriguez (1897-1948): **La Cumparsita** (Uruguay) **[5:40]**

**3.** Izaak Dunajewski (1900-1955): **Sierdce** (Russia) **[5:49]**

**4.** Astor Piazzolla (1921-1992): **Chiquilin de Bachin** (Argentina) **[7:39]**

**5.** Jacob Gade (1879-1963): **Jalousie** (Denmark - Gypsy) **[3:24]**

**6.** Despina Olympiou (b. 1975): **Vale Mousiki** (Greece) **[6:12]**

**7.** Oskar Strok (1893-1975): **Czornyje Glaza** (Russia) **[8:37]**

**8.** Astor Piazzolla (1921-1992): **Oblivion** (Argentina) **[5:17]**

**9.** Unto Mononen (1930-1968): **Satuma (Dreamland)** (Finland) **[7:05]**

**10.** Anon.: **Turkish Tango** (Turkey) **[5:52]**

**11.** Dirk Van Esbroeck (1946-2007) & Juan Masondo (b. 1944): **Rookgordijnen** (Belgium/Flanders) **[4:28]**

**12.** Aleksander Olshanetsky (1892-1946): **Jewish Tango** **[9:27]**

**13.** Jerzy Petersburski (1895-1979): **This is the Last Sunday** (Poland) **[4:11]**

─────────────────────────────────────────────────────

**Total Duration: 77:08**

**PERFORMERS:**

**ROBY LAKATOS**, violin

**GANG TANGO:**
• **Grzegorz Lalek**, violin & mandoline
• **Piotr Kopietz**, bandoneon
• **Marcin Olak**, guitar  
• **Miroslaw Feldgebel**, piano
• **Sebastian Wypych**, double bass

**THE NEW VIBES STRING QUARTET:**
• **Anna Wandtke**, 1st violin
• **Malgorzata Wójcik**, 2nd violin
• **Michal Styczynski**, viola
• **Tomasz Blaszczak**, cello

**Sebastian Wypych**: Conductor, Artistic Director & Founder

**ARRANGEMENTS:**
• **Krzysztof Herdzin**: tracks 1, 4, 6, 7, 10, 11, 12, 13
• **Urszula Borkowska**: tracks 2, 3, 9
• **Gang Tango**: tracks 5, 8`;

    // Find the World Tangos Odyssey release
    const { data: release } = await supabase
      .from('releases')
      .select('id, title')
      .ilike('title', '%World Tangos Odyssey%')
      .single();
      
    if (!release) {
      console.error('❌ World Tangos Odyssey release not found');
      return;
    }
    
    console.log(`✅ Found release: "${release.title}" (ID: ${release.id})`);
    
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
          tracklist: newTracklist,
          updated_at: new Date().toISOString()
        })
        .eq('release_id', release.id)
        .eq('language', 'en');
      
      if (updateError) {
        console.error('❌ Error updating translation:', updateError);
        return;
      }
      
      console.log('✅ Updated existing English translation');
    } else {
      // Create new translation (keeping existing description if any)
      const { error: insertError } = await supabase
        .from('release_translations')
        .insert({
          release_id: release.id,
          language: 'en',
          tracklist: newTracklist
        });
      
      if (insertError) {
        console.error('❌ Error creating translation:', insertError);
        return;
      }
      
      console.log('✅ Created new English translation');
    }
    
    console.log('\n🎉 WORLD TANGOS ODYSSEY TRACKLIST UPDATED!');
    console.log('  • Professional classical music format applied');
    console.log('  • Clear track numbering and composer information');
    console.log('  • Organized performer credits section');
    console.log('  • Clean typography with proper spacing');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

updateWorldTangoOdyssey();