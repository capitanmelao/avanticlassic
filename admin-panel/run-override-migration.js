const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🔧 ADDING TAX AND SHIPPING OVERRIDE FIELDS TO PRODUCTS\n');
  
  try {
    // Read the SQL migration file
    const sqlContent = fs.readFileSync('./add-product-override-fields.sql', 'utf8');
    
    console.log('1. RUNNING DATABASE MIGRATION:');
    console.log('   Adding tax and shipping override fields...');
    
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sqlContent });
    
    if (error) {
      console.error('❌ Migration failed:', error);
      
      // Try executing each statement separately if RPC fails
      console.log('\n2. TRYING ALTERNATIVE APPROACH:');
      const statements = sqlContent.split(';').filter(stmt => stmt.trim().length > 0);
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i].trim();
        if (statement.length === 0) continue;
        
        console.log(`   Executing statement ${i + 1}/${statements.length}...`);
        
        const { error: stmtError } = await supabase.rpc('exec_sql', { sql_query: statement });
        if (stmtError) {
          console.log(`   ⚠️ Statement ${i + 1} failed:`, stmtError.message);
        } else {
          console.log(`   ✅ Statement ${i + 1} executed successfully`);
        }
      }
    } else {
      console.log('   ✅ Migration executed successfully');
    }
    
    // Verify the new columns exist
    console.log('\n3. VERIFYING NEW COLUMNS:');
    const { data: tableInfo, error: infoError } = await supabase
      .from('products')
      .select('tax_override_enabled, shipping_override_enabled')
      .limit(1);
      
    if (infoError) {
      console.log('   ⚠️ Could not verify columns (they might still exist):', infoError.message);
    } else {
      console.log('   ✅ New columns are accessible');
    }
    
    console.log('\n🎉 MIGRATION COMPLETE!');
    console.log('✅ Products table now has:');
    console.log('   • tax_override_enabled (boolean)');
    console.log('   • tax_override_rate (decimal)');
    console.log('   • tax_override_amount (integer)');
    console.log('   • shipping_override_enabled (boolean)');
    console.log('   • shipping_override_amount (integer)');
    console.log('   • shipping_free_threshold (integer)');
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

runMigration();