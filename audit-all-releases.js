const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function auditAllReleases() {
  console.log('🔍 AUDITING ALL RELEASES FOR FORMATTING ISSUES\n');
  
  try {
    // Get all releases with their translations and reviews
    const { data: releases } = await supabase
      .from('releases')
      .select(`
        id,
        title,
        url,
        release_translations (
          language,
          description,
          tracklist
        ),
        reviews (
          id,
          publication,
          reviewer_name,
          review_text,
          rating
        )
      `)
      .order('id');
    
    console.log(`📋 FOUND ${releases.length} RELEASES\n`);
    
    const issues = [];
    
    releases.forEach((release) => {
      const releaseIssues = {
        id: release.id,
        title: release.title,
        url: release.url,
        problems: []
      };
      
      // Check English translation
      const enTranslation = release.release_translations?.find(t => t.language === 'en');
      
      if (!enTranslation) {
        releaseIssues.problems.push('❌ Missing English translation');
      } else {
        // Check description for HTML artifacts
        if (enTranslation.description) {
          if (enTranslation.description.includes('<br>') || 
              enTranslation.description.includes('<br/>') || 
              enTranslation.description.includes('<br />')) {
            releaseIssues.problems.push('🔧 Description contains <br> tags');
          }
          
          if (enTranslation.description.includes('&nbsp;') ||
              enTranslation.description.includes('&amp;') ||
              enTranslation.description.includes('&quot;') ||
              enTranslation.description.includes('&#')) {
            releaseIssues.problems.push('🔧 Description contains HTML entities');
          }
          
          if (enTranslation.description.includes('<p>') || 
              enTranslation.description.includes('</p>') ||
              enTranslation.description.includes('<div>') ||
              enTranslation.description.includes('</div>')) {
            releaseIssues.problems.push('🔧 Description contains HTML tags');
          }
        } else {
          releaseIssues.problems.push('❌ Missing description');
        }
        
        // Check tracklist formatting
        if (enTranslation.tracklist) {
          if (enTranslation.tracklist.includes('|-|-|-|') || 
              enTranslation.tracklist.includes('| | | |')) {
            releaseIssues.problems.push('🎵 Tracklist uses old markdown table format');
          }
          
          if (enTranslation.tracklist.includes('<br>') || 
              enTranslation.tracklist.includes('&nbsp;')) {
            releaseIssues.problems.push('🔧 Tracklist contains HTML artifacts');
          }
        } else {
          releaseIssues.problems.push('❌ Missing tracklist');
        }
      }
      
      // Check reviews formatting
      if (release.reviews && release.reviews.length > 0) {
        const hasOldFormat = release.reviews.some(review => 
          !review.review_text || 
          review.review_text.length < 50 || 
          !review.rating
        );
        
        if (hasOldFormat) {
          releaseIssues.problems.push(`📝 Reviews need Tango Rhapsody template format (${release.reviews.length} reviews)`);
        }
      } else {
        releaseIssues.problems.push('📝 No reviews found');
      }
      
      if (releaseIssues.problems.length > 0) {
        issues.push(releaseIssues);
      }
    });
    
    // Report summary
    console.log('📊 AUDIT SUMMARY:\n');
    console.log(`✅ Total releases: ${releases.length}`);
    console.log(`⚠️  Releases with issues: ${issues.length}`);
    console.log(`✅ Clean releases: ${releases.length - issues.length}\n`);
    
    // Detailed issues report
    if (issues.length > 0) {
      console.log('🚨 ISSUES FOUND:\n');
      
      issues.forEach((issue, index) => {
        console.log(`${index + 1}. "${issue.title}" (ID: ${issue.id})`);
        console.log(`   URL: ${issue.url}`);
        issue.problems.forEach(problem => {
          console.log(`   ${problem}`);
        });
        console.log('');
      });
      
      // Category summary
      const categoryCount = {};
      issues.forEach(issue => {
        issue.problems.forEach(problem => {
          const category = problem.split(' ')[0];
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        });
      });
      
      console.log('📈 ISSUE CATEGORIES:');
      Object.entries(categoryCount).forEach(([category, count]) => {
        console.log(`   ${category} ${count} occurrences`);
      });
    } else {
      console.log('🎉 All releases are properly formatted!');
    }
    
  } catch (error) {
    console.error('❌ Audit error:', error);
  }
}

auditAllReleases();