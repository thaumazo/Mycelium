import { createClient } from '@supabase/supabase-js'
import { getSupabaseURL, getSupabaseAnonKey } from '$lib/server/data'

export const supabase = createClient(getSupabaseURL(), getSupabaseAnonKey())