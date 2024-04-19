import { env } from '$env/static/public'

export async function getSupabaseURL() {
  console.log(env.PUBLIC_SUPABASE_URL);
  return env.PUBLIC_SUPABASE_URL // 🤫
}

export async function getSupabaseAnonKey() {
  return env.PUBLIC_SUPABASE_ANON_KEY // 🤫
}