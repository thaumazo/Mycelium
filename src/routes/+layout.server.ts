// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'

export const load = (async ({url, locals: { safeGetSession } }) => {
  const { session, user } = await safeGetSession()
  console.log(url);
  //really not sure about this !url.search case here. Right now when it's being redirected from google login without that case it will get stuck in an auth loop. Something isn't loading in the right order. I feel like it should be checking the code somehow perhaps? Or somehow waiting for the session to initialize?
  const code = url.searchParams.get('code')

  if (code) {
    throw redirect(303, `/auth/callback?code=${code}`)
  }
  else if (!session && url.pathname!='/auth') {
    console.log("TODO: redirect here for security. Currently getting caught in auth loop")
    throw redirect(303, '/auth/callback')
  }


  return {
    session,
    user,
  }
}) satisfies LayoutServerLoad