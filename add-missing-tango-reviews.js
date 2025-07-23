const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addMissingTangoReviews() {
  console.log('📝 ADDING MISSING TANGO RHAPSODY REVIEWS\n');
  
  try {
    // Get the release ID for Tango Rhapsody
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
    
    // Add the 2 missing reviews
    const missingReviews = [
      {
        release_id: release.id,
        publication: 'SACD.net',
        reviewer_name: 'John Broggio',
        review_date: '2012-12-01',
        rating: null,
        review_url: null,
        featured: false,
        sort_order: 110,
        review_text: `A life-affirming thrilling disc from two pianists who clearly love every note. All the Piazzolla and the Jusid-Kauderer are arranged by either Pablo Ziegler or Federico Jusid for the two pianos that are caressed and toyed with in all manner of ways by Karin Lechner & Sergio Tiempo. Tiempo hails from Caracas (Venezuala) but it is clear that the Buenos Aires-born raised Lerchner has thoroughly primed him in the almost unrecognizable subtleties of the Tango phrasing emphasis (akin to a gifted musician from Vienna schooling you in how to play the Strauss family). For all the sultry passion that is vividly portrayed, there is a delightful playful to the playing of both pianists that never fails to raise a smile; needless to say the Piazzolla items are the best known. The centrepiece of the disc is Jusid's Tango Rhapsody for 2 pianos and orchestra. Unlike the rest of the programme, which was recorded in studio conditions in the Auditorio Stelio Molo (Lugano), this concertante work was recorded at concerts of the Progetto Martha Argerich 2010 (Lugano); applause is excised on the SACD and audience noise is mercifully absent. As the accompanying DVD shows - this work is one where Tiempo and Lechner not only prowl around the piano & orchestra figuratively but literally as well - this is a work of performance art as well as music. The DVD was filmed in Buenos Aires with the local youth orchestra providing a setting for our pianists; the soundtrack though is the same as presented on SACD (albeit only in stereo) and now with accompanying applause. Although part of me thinks it may have been a shame that the youth orchestra was not heard (because everyone was obviously enjoying themselves), I am glad we can at least see how the piece works spatially. There are some obvious visual artefacts in the filming but it does not detract greatly from the extra enjoyment. By means of "encores", a further set of Tangos conclude the disc.The sound presents a rich, dark texture from the pianos without the merest hint of hardness even when Tiempo & Lechner unleash their full potential. The balance in the concertante item however favours the pianos too much at the expense of the orchestra to be ideal.Enthusiastically recommended.`
      },
      {
        release_id: release.id,
        publication: 'The Arts Desk',
        reviewer_name: 'Graham Rickson',
        review_date: '2013-02-25',
        rating: null,
        review_url: null,
        featured: false,
        sort_order: 70,
        review_text: `[Tango Rhapsody] In which the brilliant Argentinian pianist Sergio Tiempo joins forces with his equally talented sister Karin Lechner, in an album of arrangements and newly commissioned tango-related works for two pianos and orchestra. The main attraction here is Federico Jusid's three-movement Tango Rhapsody, a dazzler of a showpiece accentuating the tango's potential for conflict between partners: "That confrontation between the performers that could swing from the most loving accordance to the sourest contention." You have to watch the accompanying DVD. Orchestral players stamp feet, tap mouthpieces, before Tiempo sneaks on like a naughty child and begins pounding away. Predictably, but wittily, Lechner creeps on stage accompanied by a bluesy muted trumpet solo, her own music appropriately sultry. It's brilliantly theatrical and darkly comic, and so consistently entertaining that you readily forgive Jusid any number of cheeky borrowings from Gershwin and Stravinsky. There's not a wasted second in the work's 18 minutes, the mood alternating between sweaty noir and exultant aggression. Possibly a modern masterpiece. You'd be willing to pay full whack for the Tango Rhapsody on its own. Happily, the duo also provide a generous smattering of better known pieces by Astor Piazzola and Pablo Ziegler, who also provides the inventive arrangements. Unmissable-the most enjoyable disc I've heard so far this year.`
      }
    ];
    
    const { data: insertedReviews, error: insertError } = await supabase
      .from('reviews')
      .insert(missingReviews)
      .select('id, publication, reviewer_name');
      
    if (insertError) {
      console.error('❌ Error inserting missing reviews:', insertError);
      return;
    }
    
    console.log('✅ Inserted missing reviews:', insertedReviews);
    
    // Update the existing Audiophile Audition review with correct reviewer name and corrected text
    const { error: updateError } = await supabase
      .from('reviews')
      .update({
        reviewer_name: 'John Sunier',
        review_text: `The brother and sister duo-pianists, one born in Argentina and the other in Venezuela, perform nine two-piano tango pieces on the SACD, and in the middle we hear their performance with a student orchestra of the Tango Rhapsody by Federico Jusid, written especially for them. The composer says he had great pleasure working with the piano duo on developing the Rhapsody. It is a described as a concertante-theatrical piece which borrow the rhythmic and harmonic flavors of the tango and also its dramatic tone, theatricality, uninhabited way of being romantic, and its sensuality. He felt the orchestra could accompany the two pianists in their discourse, or enrich the conflict by taking an opposite position. Though in rhapsodic form it still has three movements and is said to tell a tacit story of seduction, dance, love, dispute, solitude, reencounter and celebration. The DVD of the Tango Rhapsody only is an interesting accompaniment to the complete SACD. It stresses the theatrical aspects of the work, with pianist Tiempo starting by sort of sneaking thru the orchestra to get to the piano. Later his sister displays scowling while playing more intense portions of the score, and ultimately takes off and throws her red shoes into the orchestra in a fit of pique; they don't seem the least bit surprised. Four of the two-piano selections on the SACD are by Piazzolla, with three of them arranged by tango pianist Pablo Ziegler. Another four are original tangos composed by Ziegler. The over eight-minute arrangement of Piazzolla's lovely Adios Nonino is a highlight of the concert. I believe one of the best versions of this classic I've ever heard. The audio disc closes with a two-piano version of "The Secret in Their Eyes," which Jusid wrote together with Emilio Kauderer for a 1950 Spanish film of the same name which won a Best Foreign Language Film Oscar.`
      })
      .eq('publication', 'Audiophile Audition')
      .eq('release_id', release.id);
    
    if (updateError) {
      console.error('❌ Error updating Audiophile Audition review:', updateError);
    } else {
      console.log('✅ Updated Audiophile Audition review with correct reviewer and text');
    }
    
    console.log('\n🎉 ALL TANGO RHAPSODY REVIEWS COMPLETE!');
    console.log('  • Added SACD.net review by John Broggio');
    console.log('  • Added The Arts Desk review by Graham Rickson');  
    console.log('  • Updated Audiophile Audition with correct reviewer');
    console.log('  • Total: 5 complete reviews now available');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

addMissingTangoReviews();