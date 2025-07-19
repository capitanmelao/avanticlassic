const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRLSPolicies() {
  console.log('🔒 Checking RLS policies for reviews tables...\n');
  
  try {
    // Check if RLS is enabled on reviews table
    const { data: reviewsTable, error: reviewsError } = await supabase
      .rpc('exec_sql', { 
        sql: `SELECT schemaname, tablename, rowsecurity, hasrls 
              FROM pg_tables 
              LEFT JOIN pg_class ON pg_class.relname = pg_tables.tablename 
              WHERE tablename IN ('reviews', 'review_translations') 
              AND schemaname = 'public';`
      });
      
    if (reviewsError) {
      console.error('Error checking RLS status:', reviewsError);
    } else {
      console.log('📋 Table RLS status:');
      console.log(reviewsTable);
    }
    
    // Check RLS policies for reviews table
    const { data: reviewsPolicies, error: policiesError } = await supabase
      .rpc('exec_sql', {
        sql: `SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
              FROM pg_policies 
              WHERE tablename IN ('reviews', 'review_translations') 
              AND schemaname = 'public';`
      });
      
    if (policiesError) {
      console.error('Error checking RLS policies:', policiesError);
    } else {
      console.log('\n🔐 RLS Policies:');
      console.log(reviewsPolicies);
    }

  } catch (error) {
    console.error('Error:', error);
    
    // Try simpler approach - just check if we can query the tables directly
    console.log('\n🧪 Testing direct table access...');
    
    const { data: reviewsData, error: reviewsQueryError } = await supabase
      .from('reviews')
      .select('id, publication')
      .limit(3);
      
    console.log('Reviews query (service role):', reviewsQueryError ? `Error: ${reviewsQueryError.message}` : `Success: ${reviewsData?.length} rows`);
    
    const { data: translationsData, error: translationsQueryError } = await supabase
      .from('review_translations')
      .select('id, language')
      .limit(3);
      
    console.log('Review translations query (service role):', translationsQueryError ? `Error: ${translationsQueryError.message}` : `Success: ${translationsData?.length} rows`);
  }
}

checkRLSPolicies();