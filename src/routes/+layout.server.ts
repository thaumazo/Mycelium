// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'

export const load = (async ({url, locals: { safeGetSession } }) => {
  const { session, user } = await safeGetSession()

  if (!session && url.pathname != '/auth') {
    // console.log(url)
    // throw redirect(303, '/auth')
  }

  return {
    session,
    user,
  }
}) satisfies LayoutServerLoad