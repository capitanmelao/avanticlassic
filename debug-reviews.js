// Debug script to examine review data structure
const fs = require('fs');
const path = require('path');

function loadI18nData(language) {
  const filePath = path.join(__dirname, 'old-astro-site/ssg-eta/i18n', `${language}.json`);
  const rawData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(rawData);
}

function debugReviews() {
  console.log('🔍 Debugging review data structure...\n');
  
  try {
    const enData = loadI18nData('en');
    
    console.log('📁 Loaded i18n data structure:');
    console.log('Top-level keys:', Object.keys(enData));
    
    if (enData.releases) {
      console.log('\n📀 Releases section found');
      console.log('Release keys:', Object.keys(enData.releases));
      
      // Check first few releases for press data
      for (let i = 1; i <= 10; i++) {
        const releaseData = enData.releases[i.toString()];
        if (releaseData) {
          console.log(`\n📝 Release ${i}:`);
          console.log('  - Has press field:', 'press' in releaseData);
          console.log('  - Press value type:', typeof releaseData.press);
          console.log('  - Press value:', releaseData.press ? `"${releaseData.press.substring(0, 100)}..."` : releaseData.press);
        }
      }
    } else {
      console.log('❌ No releases section found in i18n data');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugReviews();