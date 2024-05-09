// src/routes/auth/callback/+server.js
import { redirect } from '@sveltejs/kit'

export const GET = async ({ url, locals: { supabase, safeGetSession } }) => {
  const code = url.searchParams.get('code')
  const session = await safeGetSession();

  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code)
  } catch (error) {
    console.log(error)
  }
  }
  else if(session)
    throw redirect(303, '/')
  else {
    throw redirect(303, '/auth')
  }

  throw redirect(303, '/')

}
