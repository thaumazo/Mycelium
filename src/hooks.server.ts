// src/hooks.server.ts
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, SECRET_JWT_SECRET } from '$env/static/public'
import { createServerClient } from '@supabase/ssr'
import type { Handle } from '@sveltejs/kit'
import jwt from 'jsonwebtoken';
import { validateApiKey } from '$lib/secretApiUtils';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => event.cookies.get(key),
      /**
       * Note: You have to add the `path` variable to the
       * set and remove method due to sveltekit's cookie API
       * requiring this to be set, setting the path to `/`
       * will replicate previous/standard behaviour (https://kit.svelte.dev/docs/types#public-types-cookies)
       */
      set: (key, value, options) => {
        event.cookies.set(key, value, { ...options, path: '/' })
      },
      remove: (key, options) => {
        event.cookies.delete(key, { ...options, path: '/' })
      },
    },
  })

  const apiKey = event.request.headers.get('x-api-key');
  if (apiKey) {
    const isValid = await validateApiKey(apiKey);  // You need to implement this function
    if (isValid) {
      const token = jwt.sign({role: 'api_user'}, SECRET_JWT_SECRET, { expiresIn: '1h' });
      event.cookies.set('auth_token', token, { path: '/', httpOnly: true });
      await event.locals.supabase.auth.setAuth(token);  // Set the JWT for all Supabase requests
    } else {
      throw new Error('Invalid API Key');
    }
  }

  /**
   * Unlike `supabase.auth.getSession`, which is unsafe on the server because it
   * doesn't validate the JWT, this function validates the JWT by first calling
   * `getUser` and aborts early if the JWT signature is invalid.
   */
  event.locals.safeGetSession = async () => {
    const { data: { user }, error } = await event.locals.supabase.auth.getUser()

    if (error || !user) return { session: null, user: null, profile: null }

    const { data: { session } } = await event.locals.supabase.auth.getSession()


    

    return { session, user }
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range'
    },
  })
}