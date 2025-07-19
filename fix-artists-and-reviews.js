const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const ssgData = JSON.parse(fs.readFileSync('/Users/carlos/Documents/GitHub/avanticlassic/old-astro-site/ssg-eta/i18n/en.json', 'utf8'));

// Better artist mappings based on actual titles
const artistMappings = {
  28: ["Martha Argerich"],
  31: ["Martha Argerich"], 
  36: ["Martha Argerich"],
  6: ["Dora Schwarzberg", "Martha Argerich"],
  32: ["Alexander Kniazev", "Kasparas Uinskas"],
  33: ["Dietrich Henschel", "Steven Sloane"],
  30: ["Dr L. Subramaniam", "Roby Lakatos"],
  27: ["Roby Lakatos", "Bireli Lagrene"],
  19: ["Philippe Quint", "Lily Maisky"],
  9: ["Sergio Tiempo", "Karin Lechner"],
  14: ["Sergio Tiempo", "Karin Lechner"],
  4: ["Dora Schwarzberg", "Polina Leschenko"],
  23: ["Matt Herskovitz Trio", "Philippe Quint"],
  25: ["Manu Comté"],
  34: ["Martha Argerich"],
  35: ["Sergio Tiempo"],
  20: ["Myriam Fuks"]
};

// Standard artist database entries
const standardArtists = {
  'Martha Argerich': { name: 'Martha Argerich', url: 'Martha-Argerich' },
  'Polina Leschenko': { name: 'Polina Leschenko', url: 'Polina-Leschenko' },
  'Pedro Burmester': { name: 'Pedro Burmester', url: 'Pedro-Burmester' },
  'Dora Schwarzberg': { name: 'Dora Schwarzberg', url: 'Dora-Schwarzberg' },
  'Roby Lakatos': { name: 'Roby Lakatos', url: 'Roby-Lakatos' },
  'Adriel Gomez-Mansur': { name: 'Adriel Gomez-Mansur', url: 'Adriel-Gomez-Mansur' },
  'Sergio Tiempo': { name: 'Sergio Tiempo', url: 'Sergio-Tiempo' },
  'Karin Lechner': { name: 'Karin Lechner', url: 'Karin-Lechner' },
  'Myriam Fuks': { name: 'Myriam Fuks', url: 'Myriam-Fuks' },
  'Alexander Gurning': { name: 'Alexander Gurning', url: 'Alexander-Gurning' },
  'Philippe Quint': { name: 'Philippe Quint', url: 'Philippe-Quint' },
  'Francesco Piemontesi': { name: 'Francesco Piemontesi', url: 'Francesco-Piemontesi' },
  'Lily Maisky': { name: 'Lily Maisky', url: 'Lily-Maisky' },
  'Manu Comté': { name: 'Manu Comté', url: 'Manu-Comté' },
  'Dietrich Henschel': { name: 'Baritone Dietrich Henschel', url: 'Baritone-Dietrich-Henschel' },
  'Steven Sloane': { name: 'Steven Sloane', url: 'Steven-Sloane' },
  'Evgeni Bozhanov': { name: 'Evgeni Bozhanov', url: 'Evgeni-Bozhanov' },
  'Alexander Kniazev': { name: 'Alexander Kniazev', url: 'Alexander-Kniazev' },
  'Kasparas Uinskas': { name: 'Kasparas Uinskas', url: 'Kasparas-Uinskas' },
  'Dr L. Subramaniam': { name: 'Dr L. Subramaniam', url: 'Dr-L-Subramaniam' },
  'Bireli Lagrene': { name: 'Bireli Lagrene', url: 'Bireli-Lagrene' },
  'Matt Herskovitz Trio': { name: 'Matt Herskovitz Trio', url: 'Matt-Herskovitz-Trio' }
};

// Parse reviews from press text
function parseReviews(pressText, releaseId) {
  if (!pressText) return [];
  
  const reviews = [];
  console.log(`    📝 Parsing press text (${pressText.length} chars)...`);
  
  // Split by <br><br> or similar patterns
  const blocks = pressText.split(/<br\s*\/?><br\s*\/?>/i);
  
  blocks.forEach((block, index) => {
    if (!block.trim()) return;
    
    // Look for quoted reviews (using Unicode curly quotes)
    const quoteMatches = [
      // Pattern: "Review text".<br>Author, Publication, Date (using Unicode escapes for curly quotes)
      /\u201c([^\u201d]+)\u201d[.]*<br>(.*)/i
    ];
    
    for (const pattern of quoteMatches) {
      const match = block.match(pattern);
      if (match) {
        const reviewText = match[1].trim();
        const attribution = match[2].trim();
        
        // Extract publication and reviewer
        let publication = 'Unknown';
        let reviewer = null;
        
        if (attribution.includes(',')) {
          const parts = attribution.split(',').map(p => p.trim());
          reviewer = parts[0];
          publication = parts[1] || 'Unknown';
        } else {
          publication = attribution;
        }
        
        reviews.push({
          release_id: releaseId,
          publication: publication,
          reviewer_name: reviewer,
          review_date: '2006-01-01',
          rating: null,
          review_url: null,
          featured: index === 0,
          sort_order: (index + 1) * 10,
          review_text: reviewText
        });
        
        console.log(`      ✅ Found review: ${publication} (${reviewText.length} chars)`);
        break;
      }
    }
  });
  
  return reviews;
}

async function fixArtistsAndReviews() {
  console.log('🔧 FIXING ARTISTS AND MIGRATING REVIEWS\\n');
  
  try {
    let artistsFixed = 0;
    let reviewsMigrated = 0;
    
    // Clean up existing bad artist associations first
    console.log('🧹 Cleaning up bad artist associations...');
    const badArtistNames = [
      'vous with Martha Argerich - Volume 2',
      'vous with Martha Argerich - Volume 3', 
      'vous with Martha Argerich - Martha Argerich',
      'Four Serious Songs Op. 121 - Alexander Kniazev - Kasparas Uinskas',
      'Dietrich Henschel - Bochumer Symphoniker - Steven Sloane',
      'Dr L. Subramaniam - Roby Lakatos',
      'Dora Schwarzberg - Martha Argerich',
      'Matt Herskovitz Trio - Philippe Quint',
      'Manu Comté - B\'Strings Quintet',
      'IPO - Lahav Shani',
      'Sergio Tiempo - Karin Lechner',
      'Philippe Quint - Lily Maisky',
      'Adriel Gomez - Mansur'
    ];
    
    for (const badName of badArtistNames) {
      const { data: badArtist } = await supabase
        .from('artists')
        .select('id')
        .eq('name', badName)
        .single();
        
      if (badArtist) {
        await supabase.from('release_artists').delete().eq('artist_id', badArtist.id);
        await supabase.from('artists').delete().eq('id', badArtist.id);
        console.log(`  ✅ Removed bad artist: ${badName}`);
      }
    }
    
    // Fix specific releases with correct artist mappings
    for (const [releaseId, artists] of Object.entries(artistMappings)) {
      console.log(`\n📀 Fixing release ${releaseId} artists...`);
      
      // Remove existing associations for this release
      await supabase.from('release_artists').delete().eq('release_id', parseInt(releaseId));
      
      // Add correct artists
      for (const artistName of artists) {
        const artistData = standardArtists[artistName];
        if (!artistData) {
          console.log(`  ⚠️  No mapping for artist: ${artistName}`);
          continue;
        }
        
        // Create or find artist
        const { data: artist, error: artistError } = await supabase
          .from('artists')
          .upsert(artistData, {
            onConflict: 'url',
            ignoreDuplicates: false
          })
          .select()
          .single();
          
        if (!artistError && artist) {
          // Link to release
          await supabase
            .from('release_artists')
            .insert({
              release_id: parseInt(releaseId),
              artist_id: artist.id
            });
            
          artistsFixed++;
          console.log(`    ✅ Fixed artist: ${artistData.name}`);
        }
      }
    }
    
    // Migrate reviews for releases with press data
    console.log('\\n📝 Migrating reviews...');
    
    for (let releaseId = 1; releaseId <= 37; releaseId++) {
      const ssgRelease = ssgData.releases?.[releaseId.toString()];
      if (!ssgRelease?.press) continue;
      
      console.log(`\n📰 Processing reviews for AC${releaseId.toString().padStart(3, '0')}...`);
      
      const reviews = parseReviews(ssgRelease.press, releaseId);
      
      for (const review of reviews) {
        // Insert review (with empty review_text since actual text goes in translations table)
        const { data: newReview, error: reviewError } = await supabase
          .from('reviews')
          .insert({
            release_id: review.release_id,
            publication: review.publication,
            reviewer_name: review.reviewer_name,
            review_date: review.review_date,
            rating: review.rating,
            review_text: '', // Empty string required for NOT NULL constraint
            review_url: review.review_url,
            featured: review.featured,
            sort_order: review.sort_order
          })
          .select()
          .single();
          
        if (!reviewError && newReview) {
          // Insert translation
          const { error: transError } = await supabase
            .from('review_translations')
            .insert({
              review_id: newReview.id,
              language: 'en',
              review_text: review.review_text
            });
            
          if (!transError) {
            reviewsMigrated++;
            console.log(`    ✅ Migrated review: ${review.publication}`);
          } else {
            console.log(`    ❌ Translation error:`, transError);
          }
        } else {
          console.log(`    ❌ Review insertion error:`, reviewError);
        }
      }
    }
    
    console.log(`\n🎉 FIXES COMPLETE!`);
    console.log(`  • Artists fixed: ${artistsFixed}`);
    console.log(`  • Reviews migrated: ${reviewsMigrated}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixArtistsAndReviews();