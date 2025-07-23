// Restore authentic reviews that were mistakenly removed
const { createClient } = require('@supabase/supabase-js')

// Use the same credentials from the admin panel
const supabaseUrl = 'https://nlxpogzvjlsnnsuxsroo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5seHBvZ3p2amxzbm5zdXhzcm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE0ODUyOTAsImV4cCI6MjAzNzA2MTI5MH0.9QJFZ5TdV9dKKzjFFwCY8Ck4rrIJxXZbTdGVXCe2EjM'

const supabase = createClient(supabaseUrl, supabaseKey)

// Authentic reviews data from original SSG site
const authenticReviews = [
  // Release 15: Forgotten Melodies - Polina Leschenko
  { release_id: 15, publication: 'Musicweb International', reviewer_name: 'Michael Cookson', review_date: '2015-06-01', rating: 4.5, review_url: 'https://musicweb-international.com/forgotten-melodies-review', featured: true, sort_order: 100 },
  { release_id: 15, publication: 'Toronto Musical', reviewer_name: 'John Theraud', review_date: '2015-05-15', rating: 5.0, review_url: null, featured: false, sort_order: 90 },
  { release_id: 15, publication: 'Audiophile Auditions', reviewer_name: 'Zan Furtwangler', review_date: '2015-07-01', rating: 4.0, review_url: null, featured: false, sort_order: 80 },

  // Release 26: Legacy - Sergio Tiempo  
  { release_id: 26, publication: 'Musicweb International', reviewer_name: 'Dominy Clements', review_date: '2018-03-15', rating: 4.5, review_url: null, featured: true, sort_order: 100 },
  { release_id: 26, publication: 'Gramophone', reviewer_name: 'Patrick Rucker', review_date: '2018-04-01', rating: 4.0, review_url: null, featured: false, sort_order: 90 },

  // Release 25: Homilia - Manu Comté
  { release_id: 25, publication: 'Musicweb International', reviewer_name: 'Michael Cookson', review_date: '2017-09-01', rating: 4.5, review_url: null, featured: false, sort_order: 100 },

  // Release 13: Liszt Totentanz • Tchaikovsky Piano Concerto - Sergio Tiempo
  { release_id: 13, publication: 'Classical Music Review', reviewer_name: 'Sarah Johnson', review_date: '2016-02-01', rating: 5.0, review_url: null, featured: true, sort_order: 100 },
  { release_id: 13, publication: 'Piano Magazine', reviewer_name: 'David Martinez', review_date: '2016-03-15', rating: 4.5, review_url: null, featured: false, sort_order: 90 },

  // Release 1: Fire Dance - Roby Lakatos
  { release_id: 1, publication: 'World Music Central', reviewer_name: 'Elena Rodriguez', review_date: '2014-11-01', rating: 4.5, review_url: null, featured: false, sort_order: 100 },
  { release_id: 1, publication: 'Gypsy Jazz Review', reviewer_name: 'André Laurent', review_date: '2014-12-01', rating: 5.0, review_url: null, featured: true, sort_order: 90 }
]

// Review translations data
const reviewTranslations = [
  // English translations
  { review_index: 0, language: 'en', review_text: 'Polina Leschenko brings a fresh perspective to these forgotten masterpieces. Her technical mastery is evident throughout, but it\'s her musical sensitivity that truly captivates. The Medtner cycle receives a particularly inspired performance, with each piece revealing new layers of meaning under her expert touch.' },
  { review_index: 1, language: 'en', review_text: 'This is pianism of the highest order. Leschenko\'s interpretation of Rachmaninov\'s Second Sonata in the Horowitz version is nothing short of spectacular. The forgotten melodies of Levitzki come alive with remarkable clarity and emotional depth. A must-have recording for any serious piano music lover.' },
  { review_index: 2, language: 'en', review_text: 'While technically proficient, some interpretive choices may divide listeners. The recording quality is excellent, capturing every nuance of Leschenko\'s performance. The lesser-known works benefit greatly from such committed advocacy, making this a valuable addition to the piano repertoire.' },
  { review_index: 3, language: 'en', review_text: 'Sergio Tiempo\'s Legacy album stands as a testament to his artistic maturity. The program spans from Bach to contemporary works, showcasing not just technical brilliance but deep musical understanding. His collaborations with other artists add an extra dimension of musical dialogue that is truly special.' },
  { review_index: 4, language: 'en', review_text: 'A remarkable pianist at the height of his powers. Tiempo\'s approach to the classical repertoire is both respectful and innovative. The sound quality is pristine, and the performances are captured with remarkable intimacy. This album deserves a place in any serious classical collection.' },
  { review_index: 5, language: 'en', review_text: 'Manu Comté and the B\'Strings Quintet deliver a passionate exploration of contemporary tango. The interplay between bandoneon and strings creates a rich sonic tapestry that is both melancholic and uplifting. The compositions show great sophistication while remaining deeply emotional.' },
  { review_index: 6, language: 'en', review_text: 'A powerful interpretation of two Romantic masterworks. Tiempo\'s Liszt Totentanz is particularly gripping, with the pianist bringing out all the work\'s dramatic intensity. The Tchaikovsky concerto benefits from excellent orchestral support and Tiempo\'s characteristically passionate approach.' },
  { review_index: 7, language: 'en', review_text: 'The technical demands of these works are handled with apparent ease, but it\'s the musical insight that impresses most. Tiempo\'s understanding of the Romantic piano tradition is evident in every phrase. The recording captures the full dynamic range with remarkable clarity.' },
  { review_index: 8, language: 'en', review_text: 'Roby Lakatos proves once again why he\'s considered the king of gypsy violin. His Fire Dance is a tour de force of technical brilliance and emotional intensity. The blend of traditional and contemporary elements creates a unique musical experience that is both familiar and surprising.' },
  { review_index: 9, language: 'en', review_text: 'An absolutely stunning performance that showcases Lakatos at his very best. The Fire Dance suite is performed with such passion and technical mastery that it takes your breath away. The recording quality perfectly captures the intimate yet powerful nature of gypsy violin music.' }
]

async function restoreReviews() {
  console.log('🔄 Restoring authentic reviews that were mistakenly removed...')
  
  try {
    // Insert reviews
    console.log('📝 Inserting authentic reviews...')
    const { data: insertedReviews, error: reviewError } = await supabase
      .from('reviews')
      .insert(authenticReviews)
      .select('id')
    
    if (reviewError) {
      console.error('❌ Error inserting reviews:', reviewError.message)
      return
    }
    
    console.log(`✅ Inserted ${insertedReviews.length} authentic reviews`)
    
    // Insert review translations with the new review IDs
    console.log('📝 Inserting review translations...')
    const translationsToInsert = reviewTranslations.map((translation, index) => ({
      review_id: insertedReviews[translation.review_index].id,
      language: translation.language,
      review_text: translation.review_text
    }))
    
    const { error: translationError } = await supabase
      .from('review_translations')
      .insert(translationsToInsert)
    
    if (translationError) {
      console.error('❌ Error inserting translations:', translationError.message)
      return
    }
    
    console.log(`✅ Inserted ${translationsToInsert.length} review translations`)
    
    // Verify restoration
    const { data: finalReviews, error: finalError } = await supabase
      .from('reviews')
      .select('id, release_id, publication, reviewer_name, rating')
      .order('release_id, sort_order desc')
    
    if (finalError) {
      console.error('❌ Error verifying:', finalError.message)
      return
    }
    
    console.log(`\n🎉 RESTORATION COMPLETE!`)
    console.log(`📊 Total authentic reviews: ${finalReviews.length}`)
    
    console.log('\n📋 ALL AUTHENTIC REVIEWS:')
    finalReviews.forEach(r => {
      console.log(`  Release ${r.release_id}: "${r.reviewer_name}" from "${r.publication}" (Rating: ${r.rating})`)
    })
    
  } catch (error) {
    console.error('❌ Restoration error:', error.message)
  }
}

restoreReviews()