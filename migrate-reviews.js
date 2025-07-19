// Migration script: Extract reviews from original SSG i18n data
// Run with: node migrate-reviews.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Load original i18n data
function loadI18nData(language) {
  const filePath = path.join(__dirname, 'old-astro-site/ssg-eta/i18n', `${language}.json`);
  const rawData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(rawData);
}

// Parse individual review from HTML string
function parseReview(reviewHtml, reviewIndex) {
  // Remove quotes and extract text - handle Unicode curly quotes
  const quoteMatch = reviewHtml.match(/^[\u201C\u201D"']([^\u201C\u201D"']+)[\u201C\u201D"']/);
  if (!quoteMatch) {
    return null;
  }
  
  const reviewText = quoteMatch[1];
  
  // Extract attribution - look for text after the quote and period
  const afterQuotePattern = /^[\u201C\u201D"'][^\u201C\u201D"']+[\u201C\u201D"']\.?\s*(.+)$/;
  const afterQuoteMatch = reviewHtml.match(afterQuotePattern);
  
  let reviewerName = null;
  let publication = null; 
  let reviewDate = null;
  
  if (afterQuoteMatch) {
    const attribution = afterQuoteMatch[1];
    
    // Look for date pattern and convert to proper format
    const datePattern = /(\d{1,2}\/\d{2,4}|\d{4})/;
    const dateMatch = attribution.match(datePattern);
    if (dateMatch) {
      const rawDate = dateMatch[1];
      
      // Convert various date formats to ISO date
      if (rawDate.includes('/')) {
        const parts = rawDate.split('/');
        let month = parseInt(parts[0]);
        let day = 1;
        const year = parts[1];
        
        // If month > 12, assume it's day/month format, swap them
        if (month > 12 && parts.length === 2) {
          day = month;
          month = parseInt(year.substring(0, 2)) || 1;
          const fullYear = `20${year.substring(2)}`;
          reviewDate = `${fullYear}-${month.toString().padStart(2, '0')}-01`;
        } else {
          // Handle 2-digit years (assume 2000s)
          const fullYear = year.length === 2 ? `20${year}` : year;
          
          // Ensure month is valid (1-12)
          month = Math.min(Math.max(month, 1), 12);
          
          // Create first day of month for partial dates
          reviewDate = `${fullYear}-${month.toString().padStart(2, '0')}-01`;
        }
      } else if (rawDate.length === 4) {
        // Year only - use January 1st
        reviewDate = `${rawDate}-01-01`;
      }
    }
    
    // Split by comma to separate reviewer, publication, date
    const parts = attribution.split(',').map(p => p.trim());
    
    if (parts.length >= 2) {
      // Standard format: "Reviewer, Publication, Date" or "Publication, Reviewer, Date"
      const part1 = parts[0];
      const part2 = parts[1];
      
      // Check if first part looks like a publication
      if (part1.includes('.com') || part1.includes('www.') || 
          part1.includes('Magazine') || part1.includes('Review') ||
          part1.includes('News') || part1.includes('Standard') || 
          part1.includes('Telegraph') || part1.includes('Gramophone')) {
        publication = part1;
        reviewerName = part2.replace(/\d{1,2}\/\d{2,4}|\d{4}/g, '').trim();
      } else {
        reviewerName = part1;
        publication = part2.replace(/\d{1,2}\/\d{2,4}|\d{4}/g, '').trim();
      }
    } else if (parts.length === 1) {
      // Only one part - assume it's the publication
      publication = parts[0].replace(/\d{1,2}\/\d{2,4}|\d{4}/g, '').trim();
    }
  }

  return {
    reviewText: reviewText.trim(),
    reviewerName: reviewerName || null,
    publication: publication || 'Unknown Publication',
    reviewDate: reviewDate || '2006-01-01', // Default date for reviews without dates
    featured: reviewIndex === 0, // First review is featured
    sortOrder: (reviewIndex + 1) * 10
  };
}

// Extract reviews from press field
function extractReviews(pressContent) {
  if (!pressContent || typeof pressContent !== 'string' || pressContent.trim() === '') {
    return [];
  }
  
  // Split by double line breaks to separate individual reviews
  const reviewStrings = pressContent.split('<br><br>').filter(r => r.trim());
  
  return reviewStrings.map((reviewHtml, index) => {
    const cleaned = reviewHtml.replace(/<br>/g, ' ').trim();
    return parseReview(cleaned, index);
  }).filter(review => review !== null);
}

// Get existing releases from database to map old IDs
async function getReleaseMapping() {
  const { data: releases, error } = await supabase
    .from('releases')
    .select('id, catalog_number');
    
  if (error) {
    console.error('Error fetching releases:', error);
    return {};
  }
  
  // Create mapping from old ID to new UUID
  // Catalog numbers are in format AC001, AC002, etc.
  const mapping = {};
  releases.forEach(release => {
    const oldId = parseInt(release.catalog_number.replace('AC', '').replace(/^0+/, ''));
    mapping[oldId] = release.id;
  });
  
  return mapping;
}

async function migrateReviews() {
  console.log('🎼 Starting reviews migration from original SSG data...\n');
  
  try {
    // Load i18n data
    const enData = loadI18nData('en');
    const frData = loadI18nData('fr');  
    const deData = loadI18nData('de');
    
    // Get release mapping
    const releaseMapping = await getReleaseMapping();
    console.log(`📀 Found ${Object.keys(releaseMapping).length} releases in database\n`);
    
    let totalReviews = 0;
    let processedReleases = 0;
    
    // Process each release in English data
    if (enData.releases) {
      for (const [releaseIdStr, releaseData] of Object.entries(enData.releases)) {
        const releaseId = parseInt(releaseIdStr);
        
        // Skip non-numeric keys
        if (isNaN(releaseId)) continue;
        
        const newReleaseId = releaseMapping[releaseId];
        if (!newReleaseId) {
          console.log(`⚠️  Skipping release ${releaseId} - not found in database`);
          continue;
        }
        
        // Extract reviews from press field
        const reviews = extractReviews(releaseData.press);
        
        if (reviews.length === 0) {
          console.log(`📝 Release ${releaseId}: No reviews found`);
          continue;
        }
        
        console.log(`📝 Release ${releaseId}: Found ${reviews.length} reviews`);
        processedReleases++;
        
        // Insert each review
        for (const review of reviews) {
          try {
            // Insert review record
            const { data: reviewData, error: reviewError } = await supabase
              .from('reviews')
              .insert({
                release_id: newReleaseId,
                publication: review.publication.substring(0, 255), // Truncate if too long
                reviewer_name: review.reviewerName ? review.reviewerName.substring(0, 255) : null,
                review_date: review.reviewDate,
                rating: null, // Original reviews don't have ratings
                review_url: null, // Original reviews don't have URLs
                review_text: '', // Empty string for reviews table constraint
                featured: review.featured,
                sort_order: review.sortOrder
              })
              .select()
              .single();
              
            if (reviewError) {
              console.error(`❌ Error inserting review:`, reviewError);
              continue;
            }
            
            // Insert English translation
            const { error: translationError } = await supabase
              .from('review_translations')
              .insert({
                review_id: reviewData.id,
                language: 'en',
                review_text: review.reviewText
              });
              
            if (translationError) {
              console.error(`❌ Error inserting English translation:`, translationError);
              continue;
            }
            
            totalReviews++;
            console.log(`  ✅ Inserted review by ${review.reviewerName || 'Unknown'} from ${review.publication}`);
            
          } catch (error) {
            console.error(`❌ Unexpected error inserting review:`, error);
          }
        }
      }
    }
    
    // Clear sample data first
    console.log('\n🧹 Removing sample review data...');
    const { error: deleteError } = await supabase
      .from('reviews')
      .delete()
      .in('publication', ['Musicweb International', 'Toronto Musical', 'Audiophile Auditions', 'Classical Music Review', 'Piano Magazine', 'World Music Central', 'Gypsy Jazz Review']);
      
    if (deleteError) {
      console.error('Error removing sample data:', deleteError);
    } else {
      console.log('✅ Sample data removed');
    }
    
    console.log(`\n🎉 Migration completed successfully!`);
    console.log(`📊 Migration Summary:`);
    console.log(`   📀 Processed releases: ${processedReleases}`);
    console.log(`   📝 Total reviews migrated: ${totalReviews}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run the migration
migrateReviews();