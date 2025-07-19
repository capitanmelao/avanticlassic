const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixTangoRhapsodyReviews() {
  console.log('🔧 FIXING CORRUPTED TANGO RHAPSODY REVIEWS\n');
  
  try {
    // First, get the release ID for Tango Rhapsody
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
    
    // Delete existing corrupted reviews and their translations
    const { error: deleteTransError } = await supabase
      .from('review_translations')
      .delete()
      .in('review_id', [114, 115, 116, 117]);
    
    if (deleteTransError) {
      console.log('⚠️ Warning deleting translations:', deleteTransError);
    }
    
    const { error: deleteError } = await supabase
      .from('reviews')
      .delete()
      .eq('release_id', release.id);
      
    if (deleteError) {
      console.error('❌ Error deleting corrupted reviews:', deleteError);
      return;
    }
    
    console.log('🗑️  Deleted corrupted reviews');
    
    // Insert correctly formatted reviews
    const correctReviews = [
      {
        release_id: release.id,
        publication: 'Audiophile Audition',
        reviewer_name: null,
        review_date: '2012-01-01',
        rating: null,
        review_url: null,
        featured: true,
        sort_order: 100,
        review_text: `The brother and sister duo-pianists, one born in Argentina and the other in Venezuela, perform nine two-piano tango pieces on the SACD, and in the middle we hear their performance with a student orchestra of the Tango Rhapsody by Federico Jusid, written especially for them. The composer says he had great pleasure working with the piano duo on developing the Rhapsody. It is described as a concertante-theatrical piece which borrows the rhythmic and harmonic flavors of the tango and also its dramatic tone, theatricality, uninhibited way of being romantic, and its sensuality. He felt the orchestra could accompany the two pianists in their discourse, or enrich the conflict by taking an opposite position. Though in rhapsodic form it still has three movements and is said to tell a tacit story of seduction, dance, love, dispute, solitude, reencounter and celebration. The DVD of the Tango Rhapsody only is an interesting accompaniment to the complete SACD. It stresses the theatrical aspects of the work, with pianist Tiempo starting by sort of sneaking through the orchestra to get to the piano. Later his sister displays scowling while playing more intense portions of the score, and ultimately takes off and throws her red shoes into the orchestra in a fit of pique; they don't seem the least bit surprised. Four of the two-piano selections on the SACD are by Piazzolla, with three of them arranged by tango pianist Pablo Ziegler. Another four are original tangos composed by Ziegler. The over eight-minute arrangement of Piazzolla's lovely Adios Nonino is a highlight of the concert. I believe one of the best versions of this classic I've ever heard. The audio disc closes with a further set of Tangos. The sound presents a rich and dynamic recording quality.`
      },
      {
        release_id: release.id,
        publication: 'Dance Today',
        reviewer_name: 'Nicola Rayner',
        review_date: '2013-01-01',
        rating: null,
        review_url: null,
        featured: false,
        sort_order: 90,
        review_text: `Recently released on the Avanti Classic label, Tango Rhapsody features Venezuelan-born pianist Sergio Tiempo performing with his piano duo partner, sister Karin Lechner, and the Orchestra della Svizzera Italiana led by Jacek Kaspszyk. The title track is a new work by film composer, Federico Jusid (who, with Emilio Kauderer co-wrote the music for the Oscar-winning El Secreto de Sus Ojos (The Secret in their Eyes)). A friend of Jusid's, Tiempo had asked him to compose a piece that would delve deep into the tango's drama, anger, passion, as well as the form's choreographic qualities. The result is a leviathan almost 19 minutes of music composed for two pianos and an orchestra. The accompanying DVD presents the work as a performance piece, with the siblings variously foot-stamping, storming around, throwing shoes and so on, with Lechner at one point slamming her hand down on Tiempo's piano strings. While the acting does not always convince, the music does, with the title track appearing alongside wonderfully arranged and performed tango works by Astor Piazzolla and Pablo Ziegler, both friends of the siblings' family. From a dancing point of view, I would argue that these are tangos for showdancers rather than social dancers. All the same, Tango Rhapsody is a feast for the ears.`
      },
      {
        release_id: release.id,
        publication: 'Gramophone',
        reviewer_name: 'Guy Richards',
        review_date: '2013-01-01',
        rating: null,
        review_url: null,
        featured: false,
        sort_order: 80,
        review_text: `Piazzolla's music, and tango nuevo itself, is a bit like marmite. I will confess to being a lover - in small doses. Brother-and-sister duo Karin Lechner and Sergio Tiempo's programme is dazzlingly executed, as one would expect: Lechner is an accompanist for Barbara Hendricks and Viktoria Mullova among others, while Tiempo's earlier solo and chamber recordings have been well received in these pages. That shows in their evolving expressive elaborations of these pieces, playing directly on the strings, clapping the music stands, stamping and so on. Piazzolla's are the most individual items on the disc, with Adios Nonino and La Muerte Del Angel two of his most recorded. Michelangelo '70 is a typical - perhaps too typical - example of his tango style, although Revirado presents a different side to him. I last encountered Pablo Ziegler's music on Erwin Schrott's fun Latin disc 'Rojotango'. Duo Lechner-Tiempo took lessons from him, reigniting their passion for tango; his four pieces are less distinctive than Piazzolla's but neatly put together. Federico Jusid's Tango Rhapsody is a playful concerto best appreciated on the bonus DVD where its theatricality (with pianists stealings-on and stormings-off, a huge row in the central section with borderline maltreatment of the instruments and a gushing, Rachmaninovian reconciliation) can be seen. Without the visual element it struck me as a vibrant, dynamically scored work with a Latin flavour, toying at times with jazz, Hollywood film scores and with a rhythmic interplay owing as much to Bartok and Stravinsky as to tango. Undeniably fun!`
      }
    ];
    
    const { data: insertedReviews, error: insertError } = await supabase
      .from('reviews')
      .insert(correctReviews)
      .select('id, publication, reviewer_name');
      
    if (insertError) {
      console.error('❌ Error inserting reviews:', insertError);
      return;
    }
    
    console.log('✅ Inserted corrected reviews:', insertedReviews);
    
    console.log('\n🎉 TANGO RHAPSODY REVIEWS FIXED!');
    console.log('  • Removed corrupted reviews');
    console.log('  • Added 3 properly formatted reviews');
    console.log('  • Fixed publication names and reviewer attribution');
    console.log('  • Added complete review texts');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixTangoRhapsodyReviews();