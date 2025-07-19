const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Convert original markdown table tracklist to professional format
function convertToProFormat(originalTracklist, releaseTitle) {
  if (!originalTracklist) {
    console.log('   ⚠️  No original tracklist found');
    return null;
  }
  
  console.log('   🎵 Converting tracklist to professional format');
  
  // Clean the markdown table format
  const lines = originalTracklist.split('\n');
  const tracks = [];
  let currentComposer = '';
  let currentWork = '';
  let workDescription = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip separators and empty lines
    if (trimmedLine.startsWith('|-') || trimmedLine === '' || trimmedLine === '| |') continue;
    
    // Parse table cells
    if (trimmedLine.startsWith('|') && trimmedLine.includes('|')) {
      const cells = trimmedLine.split('|').map(cell => cell.trim()).filter(cell => cell !== '');
      
      if (cells.length >= 3) {
        // Check for composer information (bold text)
        if (cells[1] && cells[1].includes('**') && !cells[0].match(/^\d/)) {
          currentComposer = cells[1].replace(/\*\*/g, '').trim();
          continue;
        }
        
        // Check for work title (no track number, descriptive text)
        if (cells[1] && !cells[0].match(/^\d/) && !cells[1].includes('**') && cells[1].length > 10) {
          if (currentWork) {
            workDescription += ' / ' + cells[1];
          } else {
            currentWork = cells[1];
            workDescription = cells[1];
          }
          continue;
        }
        
        // Track information (starts with number)
        if (cells[0].match(/^\d/)) {
          const trackNum = cells[0].replace(/\./g, '').trim();
          const trackInfo = cells[1] || '';
          const duration = cells[2] || '';
          
          tracks.push({
            number: trackNum,
            composer: currentComposer,
            work: currentWork,
            title: trackInfo,
            duration: duration
          });
        }
      }
    }
  }
  
  // Generate professional format
  let proTracklist = `**${releaseTitle.replace(/\s*\(.*?\)$/, '').toUpperCase()}**\n\n`;
  proTracklist += '─────────────────────────────────────────────────────\n\n';
  
  let lastComposer = '';
  let lastWork = '';
  
  tracks.forEach(track => {
    // Add composer header if changed
    if (track.composer && track.composer !== lastComposer) {
      if (lastComposer) proTracklist += '\n';
      proTracklist += `**${track.composer}**\n`;
      lastComposer = track.composer;
    }
    
    // Add work header if changed
    if (track.work && track.work !== lastWork) {
      proTracklist += `*${track.work}*\n\n`;
      lastWork = track.work;
    }
    
    // Add track
    proTracklist += `**${track.number}.** ${track.title}`;
    if (track.duration) {
      proTracklist += ` **[${track.duration}]**`;
    }
    proTracklist += '\n\n';
  });
  
  // Add total time if found in original
  const totalMatch = originalTracklist.match(/TOTAL TIME:\s*([^\|]+)/i);
  if (totalMatch) {
    proTracklist += '─────────────────────────────────────────────────────\n\n';
    proTracklist += `**Total Duration: ${totalMatch[1].trim()}**\n`;
  }
  
  return proTracklist.trim();
}

async function restoreAllTracklists() {
  console.log('🔧 RESTORING ALL TRACKLISTS FROM ORIGINAL DATA\n');
  
  try {
    // Load original data
    const originalDataPath = path.join(__dirname, 'old-astro-site', 'ssg-eta', 'data', 'releases.json');
    
    if (!fs.existsSync(originalDataPath)) {
      console.error('❌ Original releases.json not found at:', originalDataPath);
      return;
    }
    
    const originalData = JSON.parse(fs.readFileSync(originalDataPath, 'utf8'));
    console.log(`📋 Loaded ${originalData.length} original releases\n`);
    
    // Get current releases from database
    const { data: currentReleases } = await supabase
      .from('releases')
      .select(`
        id,
        title,
        url,
        release_translations (
          id,
          language,
          tracklist
        )
      `)
      .order('id');
    
    let restoredCount = 0;
    
    for (const currentRelease of currentReleases) {
      console.log(`🎵 Processing: "${currentRelease.title}" (ID: ${currentRelease.id})`);
      
      // Find matching original release
      const originalRelease = originalData.find(orig => orig.id === currentRelease.id);
      
      if (!originalRelease) {
        console.log('   ⚠️  No matching original release found');
        continue;
      }
      
      if (!originalRelease.tracklist) {
        console.log('   ⚠️  No tracklist in original data');
        continue;
      }
      
      const enTranslation = currentRelease.release_translations?.find(t => t.language === 'en');
      
      if (!enTranslation) {
        console.log('   ❌ No English translation found');
        continue;
      }
      
      // Check if current tracklist is short/empty and needs restoration
      const currentLength = enTranslation.tracklist?.length || 0;
      if (currentLength > 500) {
        console.log(`   ✅ Tracklist already good (${currentLength} chars)`);
        continue;
      }
      
      // Convert original tracklist to professional format
      const professionalTracklist = convertToProFormat(originalRelease.tracklist, currentRelease.title);
      
      if (!professionalTracklist) {
        console.log('   ❌ Failed to convert tracklist');
        continue;
      }
      
      // Update database
      const { error: updateError } = await supabase
        .from('release_translations')
        .update({
          tracklist: professionalTracklist,
          updated_at: new Date().toISOString()
        })
        .eq('id', enTranslation.id);
      
      if (updateError) {
        console.error('   ❌ Error updating tracklist:', updateError);
        continue;
      }
      
      console.log(`   ✅ Tracklist restored (${professionalTracklist.length} chars)`);
      restoredCount++;
    }
    
    console.log(`\n🎉 TRACKLIST RESTORATION COMPLETE!`);
    console.log(`  • Total releases processed: ${currentReleases.length}`);
    console.log(`  • Tracklists restored: ${restoredCount}`);
    console.log(`  • All releases now have professional tracklist formatting`);
    
  } catch (error) {
    console.error('❌ Restoration error:', error);
  }
}

restoreAllTracklists();