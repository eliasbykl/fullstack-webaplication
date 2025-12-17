import { createClient } from '@supabase/supabase-js'

// Use empty string fallbacks to avoid passing `undefined` to createClient at runtime.
// This prevents unexpected runtime TypeErrors when env vars aren't set locally.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn('Warning: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
