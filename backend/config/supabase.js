const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const url = process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.SUPABASE_ANON_KEY

if (!url || !serviceKey || !anonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.')
  process.exit(1)
}

// Admin client – used for all database operations
const supabase = createClient(url, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Auth client – used for token verification
const supabaseAuth = createClient(url, anonKey)

module.exports = { supabase, supabaseAuth }