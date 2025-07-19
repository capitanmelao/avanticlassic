const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function executePlaylistMigration() {
  console.log('🔄 Updating playlist category constraint...')

  try {
    // Drop the existing constraint
    const { error: dropError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public.playlists DROP CONSTRAINT IF EXISTS playlists_category_check;'
    })

    if (dropError) {
      console.log('⚠️ Drop constraint (might not exist):', dropError.message)
    }

    // Add new constraint with by_theme
    const { error: addError } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE public.playlists ADD CONSTRAINT playlists_category_check 
            CHECK (category IN ('by_artist', 'by_composer', 'by_theme'));`
    })

    if (addError) {
      throw addError
    }

    // Add comment
    const { error: commentError } = await supabase.rpc('exec_sql', {
      sql: `COMMENT ON COLUMN public.playlists.category IS 'Playlist category: by_artist, by_composer, or by_theme';`
    })

    if (commentError) {
      console.log('⚠️ Comment warning:', commentError.message)
    }

    console.log('✅ Successfully updated playlist category constraint!')
    console.log('✅ Now supports: by_artist, by_composer, by_theme')

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    
    // Try direct SQL execution approach
    console.log('🔄 Trying direct SQL approach...')
    
    try {
      const { error } = await supabase
        .from('playlists')
        .select('category')
        .limit(1)

      if (!error) {
        console.log('✅ Database connection successful')
        console.log('ℹ️ You may need to run this migration directly in Supabase dashboard:')
        console.log('')
        console.log('ALTER TABLE public.playlists DROP CONSTRAINT IF EXISTS playlists_category_check;')
        console.log("ALTER TABLE public.playlists ADD CONSTRAINT playlists_category_check CHECK (category IN ('by_artist', 'by_composer', 'by_theme'));")
        console.log('')
      }
    } catch (connError) {
      console.error('❌ Database connection failed:', connError.message)
    }
  }
}

executePlaylistMigration()