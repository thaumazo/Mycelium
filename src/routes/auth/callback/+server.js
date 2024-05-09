import { redirect } from '@sveltejs/kit'
export const GET = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get('code')

  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code)
  } catch (error) {}
  }
  else {
    throw redirect(303, '/auth')
  }
  throw redirect(303, '/')
}