import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

let _supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (_supabase) return _supabase
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase env vars not set. Auth and persistence disabled.')
    return null
  }
  _supabase = createClient(supabaseUrl, supabaseAnonKey)
  return _supabase
}
