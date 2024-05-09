// src/routes/auth/callback/+server.js
import { redirect, error } from '@sveltejs/kit'

export const GET = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get('code')

  if (code) {
    try {
      const { error: authError } = await supabase.auth.exchangeCodeForSession(code)

      if (authError) {
        console.error('Error exchanging code:', authError.message)
        throw error(500, authError.message)
      }

      throw redirect(303, '/')
    } catch (err) {
      console.error('Unexpected error during the callback:', err)
      throw error(500, 'Internal server error during authentication callback')
    }
  } else {
    console.error('Missing auth code in query parameters')
    throw redirect(303, '/auth')
  }
}
