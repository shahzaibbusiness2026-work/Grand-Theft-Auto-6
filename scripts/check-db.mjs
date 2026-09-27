import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envRaw = fs.readFileSync('.env.local', 'utf8');
const env = {};
for (const line of envRaw.split('\n')) {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const k = parts[0].trim();
    const v = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
    if (k && !k.startsWith('#')) env[k] = v;
  }
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const tables = ['missions', 'vehicles', 'weapons', 'locations', 'properties', 'radio_stations'];
  for (const t of tables) {
    const { data, error, count } = await supabase.from(t).select('id', { count: 'exact', head: true });
    if (error) {
      console.log(`Table ${t}: Error -> ${error.message}`);
    } else {
      console.log(`Table ${t}: ${count} rows`);
    }
  }
}

check();
