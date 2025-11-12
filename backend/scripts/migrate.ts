import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_url' || supabaseKey === 'your_supabase_anon_key') {
  console.error('❌ Error: Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
  console.error('   Get these from: Supabase Dashboard → Settings → API');
  process.exit(1);
}

// Read migration file
const migrationPath = join(__dirname, '../migrations/001_initial_schema.sql');
const migrationSQL = readFileSync(migrationPath, 'utf-8');

// Extract project ref from URL
const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');

console.log('📋 Migration SQL ready to execute\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\nTo run this migration, use one of these methods:\n');
console.log('1️⃣  Supabase Dashboard (Recommended):');
console.log(`   → https://supabase.com/dashboard/project/${projectRef}/sql/new`);
console.log('   → Copy/paste the SQL below and click "Run"\n');
console.log('2️⃣  Using npx supabase CLI:');
console.log('   → npx supabase@latest link --project-ref ' + projectRef);
console.log('   → npx supabase@latest db push\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('SQL Migration:\n');
console.log(migrationSQL);
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

