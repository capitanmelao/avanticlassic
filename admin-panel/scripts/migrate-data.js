// Migration script: JSON data to Supabase
// Run with: node scripts/migrate-data.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Load JSON data
const loadJsonData = (filename) => {
  const filePath = path.join(__dirname, '../../src/data', filename);
  const rawData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(rawData);
};

// Load translation data
const loadTranslationData = (language) => {
  const filePath = path.join(__dirname, '../../src/i18n', `${language}.json`);
  const rawData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(rawData);
};

async function migrateArtists() {
  console.log('🎵 Migrating artists...');
  
  const artists = loadJsonData('artists.json');
  const enTranslations = loadTranslationData('en');
  const frTranslations = loadTranslationData('fr');
  const deTranslations = loadTranslationData('de');
  
  for (const artist of artists) {
    try {
      // Insert artist
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .insert({
          id: artist.id,
          url: artist.url,
          name: artist.name,
          facebook: artist.facebook || null,
          image_url: `/images/artists/${artist.id}-800.jpeg`,
          featured: false,
          sort_order: artist.id
        })
        .select()
        .single();

      if (artistError) {
        console.error(`Error inserting artist ${artist.name}:`, artistError);
        continue;
      }

      console.log(`✅ Inserted artist: ${artist.name}`);

      // Insert translations
      const translations = [];
      
      if (enTranslations.artists?.[artist.id]?.description) {
        translations.push({
          artist_id: artist.id,
          language: 'en',
          description: enTranslations.artists[artist.id].description
        });
      }
      
      if (frTranslations.artists?.[artist.id]?.description) {
        translations.push({
          artist_id: artist.id,
          language: 'fr',
          description: frTranslations.artists[artist.id].description
        });
      }
      
      if (deTranslations.artists?.[artist.id]?.description) {
        translations.push({
          artist_id: artist.id,
          language: 'de',
          description: deTranslations.artists[artist.id].description
        });
      }

      if (translations.length > 0) {
        const { error: translationError } = await supabase
          .from('artist_translations')
          .insert(translations);

        if (translationError) {
          console.error(`Error inserting translations for ${artist.name}:`, translationError);
        } else {
          console.log(`  📝 Added ${translations.length} translations`);
        }
      }

    } catch (error) {
      console.error(`Unexpected error with artist ${artist.name}:`, error);
    }
  }
}

async function migrateReleases() {
  console.log('💿 Migrating releases...');
  
  const releases = loadJsonData('releases.json');
  
  for (const release of releases) {
    try {
      // Insert release
      const { data: releaseData, error: releaseError } = await supabase
        .from('releases')
        .insert({
          id: release.id,
          url: release.url,
          title: release.title,
          shop_url: release.shopUrl || null,
          catalog_number: `AC${release.id.toString().padStart(3, '0')}`,
          image_url: `/images/releases/${release.id}.jpeg`,
          featured: false,
          sort_order: release.id
        })
        .select()
        .single();

      if (releaseError) {
        console.error(`Error inserting release ${release.title}:`, releaseError);
        continue;
      }

      console.log(`✅ Inserted release: ${release.title}`);

      // Insert release-artist relationships
      if (release.artists && Array.isArray(release.artists)) {
        const relationships = release.artists.map(artistId => ({
          release_id: release.id,
          artist_id: artistId
        }));

        if (relationships.length > 0) {
          const { error: relationError } = await supabase
            .from('release_artists')
            .insert(relationships);

          if (relationError) {
            console.error(`Error inserting artist relationships for ${release.title}:`, relationError);
          } else {
            console.log(`  🎭 Linked to ${relationships.length} artists`);
          }
        }
      }

      // Insert tracklist as translation
      if (release.tracklist) {
        const { error: tracklistError } = await supabase
          .from('release_translations')
          .insert({
            release_id: release.id,
            language: 'en',
            tracklist: release.tracklist,
            description: null
          });

        if (tracklistError) {
          console.error(`Error inserting tracklist for ${release.title}:`, tracklistError);
        } else {
          console.log(`  📋 Added tracklist`);
        }
      }

    } catch (error) {
      console.error(`Unexpected error with release ${release.title}:`, error);
    }
  }
}

async function migrateVideos() {
  console.log('📹 Migrating videos...');
  
  const videos = loadJsonData('videos.json');
  
  for (const video of videos) {
    try {
      // Extract YouTube ID from URL
      let youtubeId = null;
      if (video.url) {
        const embedMatch = video.url.match(/\/embed\/([a-zA-Z0-9_-]+)/);
        if (embedMatch) {
          youtubeId = embedMatch[1];
        }
      }

      // Insert video
      const { data: videoData, error: videoError } = await supabase
        .from('videos')
        .insert({
          id: video.id,
          youtube_url: video.url,
          youtube_id: youtubeId,
          title: `Video ${video.id}`,
          artist_name: null,
          featured: false,
          sort_order: video.id
        })
        .select()
        .single();

      if (videoError) {
        console.error(`Error inserting video ${video.id}:`, videoError);
        continue;
      }

      console.log(`✅ Inserted video: ${video.id} (${youtubeId})`);

    } catch (error) {
      console.error(`Unexpected error with video ${video.id}:`, error);
    }
  }
}

async function migrateDistributors() {
  console.log('🌍 Migrating distributors...');
  
  const distributors = loadJsonData('distributors.json');
  
  for (const distributor of distributors) {
    try {
      const { data: distributorData, error: distributorError } = await supabase
        .from('distributors')
        .insert({
          id: distributor.id,
          name: distributor.name,
          url: distributor.url,
          email: distributor.email || null,
          phone: distributor.phone || null,
          country_id: distributor.countryId || null,
          address: distributor.address || null,
          sort_order: distributor.id
        })
        .select()
        .single();

      if (distributorError) {
        console.error(`Error inserting distributor ${distributor.name}:`, distributorError);
        continue;
      }

      console.log(`✅ Inserted distributor: ${distributor.name}`);

    } catch (error) {
      console.error(`Unexpected error with distributor ${distributor.name}:`, error);
    }
  }
}

async function runMigration() {
  console.log('🚀 Starting Avanticlassic data migration...\n');
  
  try {
    // Test connection
    const { data, error } = await supabase.from('artists').select('count').single();
    if (error) {
      console.error('❌ Failed to connect to Supabase:', error);
      return;
    }
    console.log('✅ Connected to Supabase successfully\n');

    // Run migrations
    await migrateArtists();
    console.log('');
    await migrateReleases();
    console.log('');
    await migrateVideos();
    console.log('');
    await migrateDistributors();
    
    console.log('\n🎉 Migration completed successfully!');
    
    // Show summary
    const { data: artistCount } = await supabase.from('artists').select('id', { count: 'exact' });
    const { data: releaseCount } = await supabase.from('releases').select('id', { count: 'exact' });
    const { data: videoCount } = await supabase.from('videos').select('id', { count: 'exact' });
    const { data: distributorCount } = await supabase.from('distributors').select('id', { count: 'exact' });
    
    console.log('\n📊 Migration Summary:');
    console.log(`🎵 Artists: ${artistCount?.length || 0}`);
    console.log(`💿 Releases: ${releaseCount?.length || 0}`);
    console.log(`📹 Videos: ${videoCount?.length || 0}`);
    console.log(`🌍 Distributors: ${distributorCount?.length || 0}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run the migration
runMigration();