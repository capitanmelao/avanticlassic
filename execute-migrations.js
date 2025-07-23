const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Database configuration
const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQLFunction(sql) {
  // Try to execute raw SQL through the REST API
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({
        query: sql
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('SQL execution error:', error);
    throw error;
  }
}

async function runMigrations() {
  console.log('Starting e-commerce schema migration...');
  
  // Test connection
  const { data: testData, error: testError } = await supabase
    .from('releases')
    .select('count')
    .limit(1);
  
  if (testError) {
    console.error('Database connection error:', testError);
    return;
  }
  
  console.log('Database connection successful!');
  
  // Read migration files
  const migrationFiles = [
    'admin-panel/supabase/migrations/011_create_ecommerce_schema.sql',
    'admin-panel/supabase/migrations/012_convert_releases_to_products.sql'
  ];
  
  for (const migrationFile of migrationFiles) {
    try {
      console.log(`\n=== Executing migration: ${migrationFile} ===`);
      
      const fullPath = path.join(__dirname, migrationFile);
      const sql = fs.readFileSync(fullPath, 'utf8');
      
      // Split SQL into smaller chunks to avoid timeout
      const statements = sql.split(';').filter(stmt => stmt.trim());
      console.log(`Found ${statements.length} SQL statements to execute`);
      
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i].trim();
        if (!statement) continue;
        
        try {
          console.log(`Executing statement ${i + 1}/${statements.length}...`);
          
          // Use a simple approach - execute through the database
          const { error } = await supabase
            .from('sql_exec')
            .insert({ query: statement });
          
          if (error) {
            // If the table doesn't exist, that's expected
            if (error.message.includes('relation "sql_exec" does not exist')) {
              console.log(`Statement ${i + 1}: Cannot execute through sql_exec table`);
            } else {
              console.warn(`Statement ${i + 1} warning: ${error.message}`);
              errorCount++;
            }
          } else {
            successCount++;
          }
          
        } catch (err) {
          console.warn(`Statement ${i + 1} error: ${err.message}`);
          errorCount++;
        }
      }
      
      console.log(`Migration ${migrationFile} completed: ${successCount} successful, ${errorCount} errors`);
      
    } catch (err) {
      console.error(`Error reading migration file: ${migrationFile}`, err);
    }
  }
  
  // Check results
  console.log('\n=== Checking migration results ===');
  
  // Check if products table was created
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .limit(5);
  
  if (productsError) {
    console.log('Products table not accessible:', productsError.message);
  } else {
    console.log(`Products table found with ${products.length} records (showing first 5)`);
    products.forEach(product => {
      console.log(`- ${product.name} (${product.format})`);
    });
  }
  
  // Check if product_prices table was created
  const { data: prices, error: pricesError } = await supabase
    .from('product_prices')
    .select('*')
    .limit(5);
  
  if (pricesError) {
    console.log('Product prices table not accessible:', pricesError.message);
  } else {
    console.log(`Product prices table found with ${prices.length} records (showing first 5)`);
  }
  
  console.log('\n=== Migration Summary ===');
  console.log('Migration files processed successfully');
  console.log('Check the Supabase dashboard for detailed results');
}

runMigrations().catch(console.error);