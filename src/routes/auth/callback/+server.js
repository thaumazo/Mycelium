// src/routes/auth/callback/+server.js
import { redirect } from '@sveltejs/kit'

export const GET = async ({ url, locals: { supabase, safeGetSession } }) => {
  const code = url.searchParams.get('code')
  const session = await safeGetSession();

  if (session?.user) {
    throw redirect(303, '/')
  }
  else if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch (error) {
      console.log(error)
    }
  }
  else {
    throw redirect(303, '/auth')
  }

  throw redirect(303, '/')

}
