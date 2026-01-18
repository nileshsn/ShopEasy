const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runSQLFile(filename) {
  const filePath = path.join(__dirname, 'scripts', filename);
  const sql = fs.readFileSync(filePath, 'utf8');
  
  console.log(`\n📝 Running ${filename}...`);
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      // If exec_sql doesn't exist, we need to use the REST API directly
      console.log('⚠️  Using alternative method...');
      
      // For creating tables, we can try using the REST API
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({ sql_query: sql })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log(`✅ ${filename} executed successfully`);
    } else {
      console.log(`✅ ${filename} executed successfully`);
    }
  } catch (err) {
    console.error(`❌ Error executing ${filename}:`, err.message);
    throw err;
  }
}

async function setupDatabase() {
  console.log('🚀 Setting up ShopEasy database...\n');
  console.log('📍 Supabase URL:', supabaseUrl);
  
  try {
    // Test connection
    const { data, error } = await supabase.from('products').select('count').limit(1);
    console.log('\n🔌 Testing connection...');
    
    if (error && error.code === '42P01') {
      console.log('✓ Connection successful! Tables not found (expected).\n');
    } else if (!error) {
      console.log('⚠️  Tables already exist. This script will update them.\n');
    }
    
    // Run migration scripts
    await runSQLFile('001_create_tables.sql');
    await runSQLFile('002_seed_products.sql');
    
    // Verify setup
    const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
    console.log(`\n✅ Database setup complete!`);
    console.log(`📊 Products in database: ${count}`);
    console.log('\n🎉 You can now run: pnpm dev\n');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error('\n💡 Please run the SQL scripts manually in Supabase SQL Editor:');
    console.error('   1. Go to your Supabase Dashboard');
    console.error('   2. Click "SQL Editor"');
    console.error('   3. Run scripts/001_create_tables.sql');
    console.error('   4. Run scripts/002_seed_products.sql\n');
    process.exit(1);
  }
}

setupDatabase();
