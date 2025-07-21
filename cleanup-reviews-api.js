// Database cleanup via API route to remove mock reviews
const cleanupReviews = async () => {
  try {
    console.log('🗑️ Starting cleanup of mock reviews via API...')
    
    // Use the production API to clean up reviews
    const response = await fetch('https://avanticlassic.vercel.app/api/admin/cleanup-reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'remove_mock_reviews',
        mock_reviewer_names: ['Music Review Editor', 'Senior Classical Critic']
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Cleanup completed:', result)
    } else {
      console.error('❌ API cleanup failed:', response.status, response.statusText)
    }
    
  } catch (error) {
    console.error('❌ Cleanup error:', error.message)
  }
}

cleanupReviews()