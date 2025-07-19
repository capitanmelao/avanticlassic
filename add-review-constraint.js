const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addReviewConstraint() {
  console.log('🔧 ADDING UNIQUE CONSTRAINT TO PREVENT DUPLICATE REVIEWS\n');
  
  try {
    // Add unique constraint to prevent duplicate reviews
    // This prevents combinations of (release_id, publication, reviewer_name) from being duplicated
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE reviews 
        ADD CONSTRAINT unique_review_per_release_publication_reviewer 
        UNIQUE (release_id, publication, reviewer_name);
      `
    });
    
    if (error) {
      console.error('❌ Error adding constraint:', error);
      
      // Try alternative approach using direct SQL
      console.log('🔄 Trying alternative approach...');
      
      const { error: altError } = await supabase
        .from('reviews')
        .select('id')
        .limit(1);
        
      if (altError) {
        console.error('❌ Database connection failed:', altError);
        return;
      }
      
      console.log('✅ Database connection is working');
      console.log('⚠️  The constraint needs to be added manually via Supabase dashboard or SQL editor');
      console.log('\n📋 SQL Command to run:');
      console.log('```sql');
      console.log('ALTER TABLE reviews');
      console.log('ADD CONSTRAINT unique_review_per_release_publication_reviewer');
      console.log('UNIQUE (release_id, publication, reviewer_name);');
      console.log('```');
      
    } else {
      console.log('✅ Successfully added unique constraint!');
      console.log('   Constraint name: unique_review_per_release_publication_reviewer');
      console.log('   Columns: (release_id, publication, reviewer_name)');
      console.log('\n🛡️  Future duplicate reviews will be prevented automatically');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    console.log('\n⚠️  Manual constraint addition required');
    console.log('📋 Run this SQL in Supabase dashboard:');
    console.log('```sql');
    console.log('ALTER TABLE reviews');
    console.log('ADD CONSTRAINT unique_review_per_release_publication_reviewer');
    console.log('UNIQUE (release_id, publication, reviewer_name);');
    console.log('```');
  }
}

addReviewConstraint();