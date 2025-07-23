import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkSchema() {
  console.log('🔍 Checking current database schema...\n')
  
  // Check artists table
  console.log('📋 Artists Table:')
  const { data: artists, error: artistsError } = await supabase
    .from('artists')
    .select('*')
    .limit(1)
  
  if (artists && artists.length > 0) {
    console.log('Columns:', Object.keys(artists[0]).join(', '))
  } else {
    console.log('No artists found or error:', artistsError)
  }
  
  // Check releases table  
  console.log('\n📋 Releases Table:')
  const { data: releases, error: releasesError } = await supabase
    .from('releases')
    .select('*')
    .limit(1)
    
  if (releases && releases.length > 0) {
    console.log('Columns:', Object.keys(releases[0]).join(', '))
  } else {
    console.log('No releases found or error:', releasesError)
  }
  
  // Check videos table
  console.log('\n📋 Videos Table:')
  const { data: videos, error: videosError } = await supabase
    .from('videos')
    .select('*')
    .limit(1)
    
  if (videos && videos.length > 0) {
    console.log('Columns:', Object.keys(videos[0]).join(', '))
  } else {
    console.log('No videos found or error:', videosError)
  }
  
  // Check if new tables exist
  console.log('\n🔍 Checking for new tables...')
  
  const tablesToCheck = ['news', 'reviews', 'newsletter_subscribers', 'playlists', 'composers']
  
  for (const table of tablesToCheck) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1)
      
    if (error) {
      console.log(`❌ Table '${table}' does not exist`)
    } else {
      console.log(`✅ Table '${table}' exists`)
    }
  }
}

checkSchema().catch(console.error)