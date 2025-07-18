const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Database configuration
const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  console.log('Starting e-commerce schema migration...');
  
  // First, let's test database connection
  console.log('Testing database connection...');
  const { data: testData, error: testError } = await supabase
    .from('releases')
    .select('count')
    .limit(1);
  
  if (testError) {
    console.error('Database connection error:', testError);
    return;
  }
  
  console.log('Database connection successful!');
  
  // Check current table structure
  console.log('Checking existing tables...');
  const { data: tables, error: tableError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public');
  
  if (tables) {
    console.log('Existing tables:', tables.map(t => t.table_name).join(', '));
  }
  
  // Let's check how many releases we have
  const { data: releases, error: releasesError } = await supabase
    .from('releases')
    .select('*');
  
  if (releases) {
    console.log(`Found ${releases.length} releases to convert to products`);
  }
  
  // Check if e-commerce tables already exist
  const { data: productTables, error: productError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .like('table_name', '%product%');
  
  if (productTables && productTables.length > 0) {
    console.log('E-commerce tables already exist:', productTables.map(t => t.table_name).join(', '));
  } else {
    console.log('No e-commerce tables found, migration needed');
  }
  
  // Read and display migration files
  const migrationFiles = [
    'admin-panel/supabase/migrations/011_create_ecommerce_schema.sql',
    'admin-panel/supabase/migrations/012_convert_releases_to_products.sql'
  ];
  
  for (const migrationFile of migrationFiles) {
    try {
      const fullPath = path.join(__dirname, migrationFile);
      const content = fs.readFileSync(fullPath, 'utf8');
      console.log(`\n=== Migration file: ${migrationFile} ===`);
      console.log(`File size: ${content.length} characters`);
      console.log('File exists and is readable');
    } catch (err) {
      console.error(`Error reading migration file: ${migrationFile}`, err);
    }
  }
  
  console.log('\n=== Migration Summary ===');
  console.log('Status: Database connection successful');
  console.log('Next steps: Execute migrations manually or use alternative approach');
  console.log('Database URL:', supabaseUrl);
  console.log('Ready for migration execution');
}

runMigrations().catch(console.error);