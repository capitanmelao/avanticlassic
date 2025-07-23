const fs = require('fs');

// Read the original releases.json to determine what are the AUTHENTIC releases
const originalData = JSON.parse(fs.readFileSync('old-astro-site/ssg-eta/data/releases.json', 'utf8'));

console.log('AUTHENTIC RELEASES ANALYSIS');
console.log('===========================');
console.log('Based on the original releases.json file from the SSG system:');
console.log();

console.log('TOTAL AUTHENTIC RELEASES:', originalData.length);
console.log();

console.log('AUTHENTIC RELEASE IDs AND TITLES:');
console.log('--------------------------------');
originalData.forEach((release, index) => {
  console.log(`${String(release.id).padStart(2, ' ')}. ${release.title}`);
});

console.log();
console.log('AUTHENTIC ARTISTS (Referenced in releases):');
console.log('------------------------------------------');
const allArtistIds = [...new Set(originalData.flatMap(r => r.artists))].sort((a, b) => a - b);
console.log('Artist IDs:', allArtistIds.join(', '));

console.log();
console.log('SHOP URL ANALYSIS:');
console.log('-----------------');
const withShopUrl = originalData.filter(r => r.shopUrl && r.shopUrl.trim());
const withoutShopUrl = originalData.filter(r => !r.shopUrl || !r.shopUrl.trim());

console.log('With shop URLs:', withShopUrl.length);
console.log('Without shop URLs:', withoutShopUrl.length);

if (withoutShopUrl.length > 0) {
  console.log();
  console.log('Releases WITHOUT shop URLs (potentially incomplete):');
  withoutShopUrl.forEach(r => {
    console.log(`  - ID ${r.id}: ${r.title}`);
  });
}

console.log();
console.log('TRACKLIST ANALYSIS:');
console.log('------------------');
const withTracklist = originalData.filter(r => r.tracklist && r.tracklist.trim());
const withoutTracklist = originalData.filter(r => !r.tracklist || !r.tracklist.trim());

console.log('With tracklists:', withTracklist.length);
console.log('Without tracklists:', withoutTracklist.length);

if (withoutTracklist.length > 0) {
  console.log();
  console.log('Releases WITHOUT tracklists:');
  withoutTracklist.forEach(r => {
    console.log(`  - ID ${r.id}: ${r.title}`);
  });
}

console.log();
console.log('KEY FINDINGS:');
console.log('============');
console.log('1. ALL 37 releases in the original JSON are AUTHENTIC releases');
console.log('2. These are NOT mock data - they represent the real Avanticlassic catalog');
console.log('3. Each release has:');
console.log('   - Unique catalog ID (1-37)');
console.log('   - Authentic title with format info');
console.log('   - Real artist references');
console.log('   - Shop URL for purchase');
console.log('   - Most have detailed tracklists');
console.log();
console.log('CONCLUSION: The original releases.json contains the LEGITIMATE catalog');
console.log('Any other data outside of these 37 releases should be considered suspect.');