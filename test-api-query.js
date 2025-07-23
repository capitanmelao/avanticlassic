const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNDc3MTgsImV4cCI6MjA2NzcyMzcxOH0.0AYDyBT9ESSnVdj9weHekl1suHlrekJNYnO-zW8iL6c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testApiQuery() {
  console.log('🔍 Testing API query for release 2...\n');
  
  const { data: release, error } = await supabase
    .from('releases')
    .select(`
      *,
      release_translations(
        language,
        description,
        tracklist
      ),
      release_artists(
        artist:artists(
          id,
          name,
          url
        )
      ),
      reviews(
        id,
        publication,
        reviewer_name,
        review_date,
        rating,
        review_url,
        featured,
        sort_order,
        review_translations(
          language,
          review_text
        )
      )
    `)
    .eq('id', 2)
    .single();

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log('✅ Release found:', release.title);
  console.log('📝 Reviews count:', release.reviews?.length || 0);
  
  if (release.reviews && release.reviews.length > 0) {
    console.log('\n📄 Reviews:');
    release.reviews.forEach((review, index) => {
      console.log(`  ${index + 1}. ${review.publication} by ${review.reviewer_name || 'Unknown'}`);
      console.log(`     Date: ${review.review_date}`);
      console.log(`     Featured: ${review.featured}`);
      console.log(`     Translations: ${review.review_translations?.length || 0}`);
      if (review.review_translations?.[0]) {
        console.log(`     Text: ${review.review_translations[0].review_text.substring(0, 100)}...`);
      }
      console.log('');
    });
  } else {
    console.log('❌ No reviews found in the query result');
  }
}

testApiQuery();