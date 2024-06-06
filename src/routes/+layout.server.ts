// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'

export const load = (async ({url, locals: { safeGetSession } }) => {
  const { session, user } = await safeGetSession()
  // console.log(url);
  const code = url.searchParams.get('code')

  if (!session && code) {
    throw redirect(303, `/auth/callback?code=${code}`)
  }
  else 
  if (!user && url.pathname!='/auth' && url.pathname!='/auth/callback') {
    throw redirect(303, '/auth')
  }


  return {
    session,
    user,
  }
}) satisfies LayoutServerLoad