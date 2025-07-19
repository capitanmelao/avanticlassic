const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Load original SSG data
const ssgData = JSON.parse(fs.readFileSync('/Users/carlos/Documents/GitHub/avanticlassic/old-astro-site/ssg-eta/i18n/en.json', 'utf8'));

// Artist name mappings for database
const artistMappings = {
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

// Extract artist names from release titles
function extractArtistsFromTitle(title) {
  // Remove format info first
  let cleanTitle = title.replace(/\s*\([^)]*\)\s*$/, '');
  
  // Split by common separators to find artists
  let parts = cleanTitle.split(/\s*[-–—]\s*/);
  
  // The last part before format is usually the artist(s)
  if (parts.length >= 2) {
    return parts.slice(1).join(' - ').trim();
  }
  
  return '';
}

// Parse review text from press field
function parseReviews(pressText, releaseId) {
  if (!pressText) return [];
  
  const reviews = [];
  
  // Split by <br><br> to separate reviews
  const reviewBlocks = pressText.split(/<br\s*\/?><br\s*\/?>/);
  
  reviewBlocks.forEach((block, index) => {
    if (!block.trim()) return;
    
    // Look for quoted text followed by attribution
    const quoteMatch = block.match(/^[\u201C\u201D"']([^\u201C\u201D"']+)[\u201C\u201D"'](.*)$/);
    
    if (quoteMatch) {
      const reviewText = quoteMatch[1].trim();
      const attribution = quoteMatch[2].trim();
      
      // Extract publication and reviewer
      const attrMatch = attribution.match(/<br\s*\/?>(.*?)(?:,\s*(.*))?$/);
      
      if (attrMatch) {
        const publication = attrMatch[1] || 'Unknown';
        const reviewer = attrMatch[2] || null;
        
        reviews.push({
          release_id: releaseId,
          publication: publication.trim(),
          reviewer_name: reviewer ? reviewer.trim() : null,
          review_date: '2006-01-01', // Default date
          rating: null,
          review_url: null,
          featured: index === 0, // First review is featured
          sort_order: (index + 1) * 10,
          review_text: reviewText
        });
      }
    }
  });
  
  return reviews;
}

async function migrateAllReleases() {
  console.log('🚀 COMPREHENSIVE RELEASE MIGRATION STARTING\\n');
  
  try {
    let totalArtists = 0;
    let totalDescriptions = 0;
    let totalReviews = 0;
    
    // Process each release from SSG data (1-37)
    for (let releaseNum = 1; releaseNum <= 37; releaseNum++) {
      const ssgRelease = ssgData.releases?.[releaseNum.toString()];
      if (!ssgRelease) {
        console.log(`⚠️  No SSG data for release ${releaseNum}`);
        continue;
      }
      
      console.log(`\\n📀 Processing AC${releaseNum.toString().padStart(3, '0')}...`);
      
      // Get current release from database
      const { data: dbRelease, error: fetchError } = await supabase
        .from('releases')
        .select('id, title, catalog_number')
        .eq('id', releaseNum)
        .single();
        
      if (fetchError || !dbRelease) {
        console.log(`❌ Release ${releaseNum} not found in database`);
        continue;
      }
      
      // 1. Extract and fix artists
      const artistsString = extractArtistsFromTitle(dbRelease.title);
      console.log(`  🎨 Artists: ${artistsString}`);
      
      if (artistsString) {
        // Split artists and create/link them
        const individualArtists = artistsString.split(/[,&]|\sand\s/).map(a => a.trim()).filter(a => a);
        
        for (const artistName of individualArtists) {
          // Create or find artist
          const mapping = artistMappings[artistName] || { name: artistName, url: artistName.replace(/\s+/g, '-') };
          
          const { data: artist, error: artistError } = await supabase
            .from('artists')
            .upsert({
              name: mapping.name,
              url: mapping.url,
              featured: true,
              sort_order: 1
            }, {
              onConflict: 'url',
              ignoreDuplicates: false
            })
            .select()
            .single();
            
          if (!artistError && artist) {
            // Link artist to release
            const { error: linkError } = await supabase
              .from('release_artists')
              .upsert({
                release_id: releaseNum,
                artist_id: artist.id
              }, {
                onConflict: 'release_id,artist_id',
                ignoreDuplicates: true
              });
              
            if (!linkError) {
              totalArtists++;
              console.log(`    ✅ Linked artist: ${mapping.name}`);
            }
          }
        }
      }
      
      // 2. Update description
      if (ssgRelease.description) {
        const { error: descError } = await supabase
          .from('release_translations')
          .upsert({
            release_id: releaseNum,
            language: 'en',
            description: ssgRelease.description
          }, {
            onConflict: 'release_id,language',
            ignoreDuplicates: false
          });
          
        if (!descError) {
          totalDescriptions++;
          console.log(`    ✅ Updated description (${ssgRelease.description.length} chars)`);
        }
      }
      
      // 3. Migrate reviews
      if (ssgRelease.press) {
        const reviews = parseReviews(ssgRelease.press, releaseNum);
        
        for (const review of reviews) {
          // Insert review
          const { data: newReview, error: reviewError } = await supabase
            .from('reviews')
            .insert({
              release_id: review.release_id,
              publication: review.publication,
              reviewer_name: review.reviewer_name,
              review_date: review.review_date,
              rating: review.rating,
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
              totalReviews++;
              console.log(`    ✅ Added review: ${review.publication}`);
            }
          }
        }
      }
    }
    
    console.log(`\\n🎉 MIGRATION COMPLETE!`);
    console.log(`  • Artists created/linked: ${totalArtists}`);
    console.log(`  • Descriptions updated: ${totalDescriptions}`);
    console.log(`  • Reviews migrated: ${totalReviews}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

migrateAllReleases();