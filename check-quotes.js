const fs = require('fs');
const path = require('path');

function checkQuotes() {
  const filePath = path.join(__dirname, 'old-astro-site/ssg-eta/i18n/en.json');
  const rawData = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(rawData);
  
  // Check release 2 which we know has press content
  const release2Press = data.releases["2"].press;
  
  console.log('First 200 characters of release 2 press:');
  console.log(release2Press.substring(0, 200));
  
  console.log('\nCharacter codes for first 10 characters:');
  for (let i = 0; i < Math.min(10, release2Press.length); i++) {
    const char = release2Press[i];
    console.log(`${i}: "${char}" (code: ${char.charCodeAt(0)})`);
  }
  
  // Look for quote patterns
  console.log('\nSearching for quote patterns:');
  console.log('Has straight quote (U+0022):', release2Press.includes('"'));
  console.log('Has left double quote (U+201C):', release2Press.includes('\u201C'));
  console.log('Has right double quote (U+201D):', release2Press.includes('\u201D'));
  console.log('Has left single quote (U+2018):', release2Press.includes('\u2018'));
  console.log('Has right single quote (U+2019):', release2Press.includes('\u2019'));
}

checkQuotes();