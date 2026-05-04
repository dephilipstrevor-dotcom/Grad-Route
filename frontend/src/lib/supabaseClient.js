import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// emergency check – will show in console if env vars missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase environment variables missing! Check your .env file.',
    { supabaseUrl, supabaseAnonKey }
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)