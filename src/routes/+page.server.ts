// src/routes/+page.server.ts

import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, locals: { safeGetSession, supabase } }) => {
  const { session } = await safeGetSession()

  const {data: profile} = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id);

    console.log("profile: ", profile);

  // if the user is already logged in return them to the account page
  

  return { url: url.origin, profile: profile[0] }
}
