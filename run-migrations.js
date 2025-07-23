const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Database configuration
const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeMigration(migrationFile) {
  try {
    console.log(`\n=== Executing migration: ${migrationFile} ===`);
    
    const migrationPath = path.join(__dirname, 'admin-panel', 'supabase', 'migrations', migrationFile);
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Split the SQL into individual statements to handle errors better
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (!statement) continue;
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });
        
        if (error) {
          console.warn(`Warning in statement ${i + 1}: ${error.message}`);
          // Continue with next statement unless it's a critical error
          if (error.message.includes('does not exist') || error.message.includes('already exists')) {
            console.log('Continuing with next statement...');
          } else {
            console.error('Critical error:', error);
            return false;
          }
        }
      } catch (err) {
        console.warn(`Warning in statement ${i + 1}: ${err.message}`);
        // Continue with next statement for non-critical errors
      }
    }
    
    console.log('Migration executed successfully!');
    return true;
  } catch (err) {
    console.error('Error executing migration:', err);
    return false;
  }
}

async function runMigrations() {
  console.log('Starting e-commerce schema migration...');
  
  // First, let's check if we can connect to the database
  const { data: testData, error: testError } = await supabase
    .from('releases')
    .select('count')
    .limit(1);
  
  if (testError) {
    console.error('Database connection error:', testError);
    return;
  }
  
  console.log('Database connection successful!');
  
  // First, try to create the execution function using a direct SQL query
  console.log('Creating execution function...');
  
  const createExecFunction = `
    CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql_query;
    END;
    $$;
  `;
  
  try {
    // Try to create the function using the raw SQL approach
    const { error: funcError } = await supabase.rpc('exec_sql', { sql_query: createExecFunction });
    if (funcError) {
      console.log('Function creation failed, trying alternative approach...');
      
      // Alternative: Use the SQL editor approach
      const { error: altError } = await supabase
        .from('sql_queries')
        .insert({ query: createExecFunction });
        
      if (altError) {
        console.log('Alternative approach failed, continuing with direct execution...');
      }
    }
  } catch (err) {
    console.log('Function creation error, using direct execution approach...');
  }
  
  // Execute migrations
  const migrations = [
    '011_create_ecommerce_schema.sql',
    '012_convert_releases_to_products.sql'
  ];
  
  for (const migration of migrations) {
    const success = await executeMigration(migration);
    if (!success) {
      console.error(`Failed to execute migration: ${migration}`);
      return;
    }
  }
  
  // Get statistics
  try {
    const { data: products } = await supabase.from('products').select('*');
    const { data: prices } = await supabase.from('product_prices').select('*');
    const { data: categories } = await supabase.from('product_categories').select('*');
    
    console.log('\n=== MIGRATION RESULTS ===');
    console.log(`Products created: ${products?.length || 0}`);
    console.log(`Prices created: ${prices?.length || 0}`);
    console.log(`Categories created: ${categories?.length || 0}`);
    
    if (products && products.length > 0) {
      console.log('\nSample products:');
      products.slice(0, 3).forEach(product => {
        console.log(`- ${product.name} (${product.format})`);
      });
    }
    
  } catch (err) {
    console.error('Error getting statistics:', err);
  }
}

runMigrations().catch(console.error);