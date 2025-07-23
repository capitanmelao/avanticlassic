const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixMarthaBeethovenRavel() {
  console.log('🔧 FIXING MARTHA ARGERICH BEETHOVEN & RAVEL TRACKLIST\n');
  
  try {
    // Complete professional tracklist with proper composer and work information
    const completeTracklist = `**MARTHA ARGERICH PLAYS BEETHOVEN & RAVEL**

**IPO - LAHAV SHANI, CONDUCTOR**

─────────────────────────────────────────────────────

**Ludwig van Beethoven (1770-1827)**
*Piano Concerto No. 2 in B-flat major, Op. 19*

**1.** I. Allegro con brio **[14:23]**

**2.** II. Adagio **[09:19]**

**3.** III. Rondo Molto allegro **[06:14]**

**Maurice Ravel (1875-1937)**
*Piano Concerto in G Major*

**4.** I. Allegramente **[08:20]**

**5.** II. Adagio assai **[09:09]**

**6.** III. Presto **[04:29]**

─────────────────────────────────────────────────────

**Total Duration: 51:54**

**PERFORMERS:**
• **Martha Argerich**, piano
• **Israel Philharmonic Orchestra (IPO)**
• **Lahav Shani**, conductor`;

    // Update the release
    const { error: updateError } = await supabase
      .from('release_translations')
      .update({
        tracklist: completeTracklist,
        updated_at: new Date().toISOString()
      })
      .eq('release_id', 34)
      .eq('language', 'en');
      
    if (updateError) {
      console.error('❌ Error updating tracklist:', updateError);
      return;
    }
    
    console.log('✅ MARTHA ARGERICH BEETHOVEN & RAVEL TRACKLIST FIXED!');
    console.log('  • Added complete composer information');
    console.log('  • Added work titles and opus numbers');
    console.log('  • Added performer credits section');
    console.log('  • Professional classical music formatting');
    console.log('  • Total duration calculated');
    
  } catch (error) {
    console.error('❌ Fix error:', error);
  }
}

fixMarthaBeethovenRavel();