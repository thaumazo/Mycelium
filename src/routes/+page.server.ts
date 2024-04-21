// src/routes/+page.server.ts

import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, locals: { safeGetSession, supabase } }) => {
  const { session } = await safeGetSession()

  

  return { url: url.origin}
}
