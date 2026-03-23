const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize Supabase client with service role key (bypasses RLS)
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || '',
  {
    auth: {
      persistSession: false,
    },
  }
);

module.exports = {
  query: (text, params) => pool.query(text, params),
  supabase,
  pool,
};

