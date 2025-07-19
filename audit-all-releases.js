const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function auditAllReleases() {
  console.log('🔍 COMPREHENSIVE RELEASE AUDIT\n');
  
  // Get all releases with their data
  const { data: releases, error } = await supabase
    .from('releases')
    .select(`
      id,
      title,
      catalog_number,
      release_artists(
        artist:artists(
          id,
          name,
          url
        )
      ),
      release_translations(
        language,
        description
      ),
      reviews(id)
    `)
    .order('id');
    
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  console.log(`📊 Found ${releases.length} releases in database\n`);
  
  let issuesFound = 0;
  const problemReleases = [];
  
  releases.forEach(release => {
    const issues = [];
    
    // Check for Test Artist or missing artists
    const artists = release.release_artists?.map(ra => ra.artist?.name) || [];
    if (artists.includes('Test Artist') || artists.length === 0) {
      issues.push('❌ Artist: Test Artist or missing');
    }
    
    // Check for missing descriptions
    const hasDescription = release.release_translations?.some(rt => rt.description && rt.description.trim());
    if (!hasDescription) {
      issues.push('❌ Description: Missing');
    }
    
    // Check for missing reviews
    const reviewCount = release.reviews?.length || 0;
    if (reviewCount === 0) {
      issues.push(`⚠️  Reviews: None (${reviewCount})`);
    }
    
    if (issues.length > 0) {
      issuesFound++;
      problemReleases.push({
        id: release.id,
        catalog: release.catalog_number,
        title: release.title,
        artists: artists,
        issues: issues
      });
      
      console.log(`${release.catalog_number}: ${release.title.substring(0, 50)}...`);
      console.log(`  Artists: ${artists.join(', ') || 'NONE'}`);
      issues.forEach(issue => console.log(`  ${issue}`));
      console.log('');
    }
  });
  
  console.log(`\n📈 SUMMARY: ${issuesFound}/${releases.length} releases have issues`);
  
  // Group issues by type
  const artistIssues = problemReleases.filter(r => r.issues.some(i => i.includes('Artist')));
  const descriptionIssues = problemReleases.filter(r => r.issues.some(i => i.includes('Description')));
  const reviewIssues = problemReleases.filter(r => r.issues.some(i => i.includes('Reviews')));
  
  console.log(`\n🎯 ISSUE BREAKDOWN:`);
  console.log(`  • Artist problems: ${artistIssues.length} releases`);
  console.log(`  • Missing descriptions: ${descriptionIssues.length} releases`);
  console.log(`  • No reviews: ${reviewIssues.length} releases`);
  
  return problemReleases;
}

auditAllReleases();