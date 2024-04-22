// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'

export const load = (async ({url, locals: { safeGetSession } }) => {
  const { session, user } = await safeGetSession()
  console.log(url);
  const code = url.searchParams.get('code')

  if (code) {
    throw redirect(303, `/auth/callback?code=${code}`)
  }
  else if (!session && url.pathname!='/auth') {
    throw redirect(303, '/auth/callback')
  }


  return {
    session,
    user,
  }
}) satisfies LayoutServerLoad