// src/routes/auth/callback/+server.js
import { redirect } from '@sveltejs/kit'

export const GET = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get('code')

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }
  else {
    throw redirect(303, '/auth')
  }

  throw redirect(303, '/')
}
