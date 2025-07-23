async function testAPIs() {
  const baseUrl = 'http://localhost:3003'
  
  console.log('🧪 Testing API Endpoints...\n')
  
  // Test Artists API
  console.log('📋 Testing Artists API:')
  try {
    const artistsResponse = await fetch(`${baseUrl}/api/artists?limit=2`)
    const artistsData = await artistsResponse.json()
    console.log('✅ Artists API working!')
    console.log('Sample data:', JSON.stringify(artistsData, null, 2))
  } catch (error) {
    console.log('❌ Artists API error:', error.message)
  }
  
  console.log('\n📋 Testing Releases API:')
  try {
    const releasesResponse = await fetch(`${baseUrl}/api/releases?limit=2`)
    const releasesData = await releasesResponse.json()
    console.log('✅ Releases API working!')
    console.log('Sample data:', JSON.stringify(releasesData, null, 2))
  } catch (error) {
    console.log('❌ Releases API error:', error.message)
  }
  
  console.log('\n📋 Testing Videos API:')
  try {
    const videosResponse = await fetch(`${baseUrl}/api/videos?limit=2`)
    const videosData = await videosResponse.json()
    console.log('✅ Videos API working!')
    console.log('Sample data:', JSON.stringify(videosData, null, 2))
  } catch (error) {
    console.log('❌ Videos API error:', error.message)
  }
  
  console.log('\n📋 Testing Search API:')
  try {
    const searchResponse = await fetch(`${baseUrl}/api/search?q=bach&limit=2`)
    const searchData = await searchResponse.json()
    console.log('✅ Search API working!')
    console.log('Sample data:', JSON.stringify(searchData, null, 2))
  } catch (error) {
    console.log('❌ Search API error:', error.message)
  }
}

testAPIs().catch(console.error)