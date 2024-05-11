// src/hooks.server.ts
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY} from '$env/static/public'
import {SECRET_JWT_SECRET} from '$env/static/private'
import { createServerClient } from '@supabase/ssr'
import type { Handle } from '@sveltejs/kit'
import jwt from 'jsonwebtoken';
import { validateApiKey } from '$lib/secretApiUtils';

export const handle: Handle = async ({ event, resolve }) => {
  let token;
    const apiKey = event.request.headers.get('x-api-key');

    if (apiKey) {
        const isValid = await validateApiKey(apiKey);
        if (isValid) {
            token = jwt.sign({ role: 'api_user' }, SECRET_JWT_SECRET, { expiresIn: '1h' });  // Sign a JWT for the valid API key
            event.cookies.set('auth_token', token, { path: '/', httpOnly: true });  // Set the JWT in a secure cookie
        } else {
            throw new Error('Invalid API Key');  // Throw an error if the API key is invalid
        }
    }

    // Whether authenticated or not, create the client with proper cookie handling
    event.locals.supabase = createClient(PUBLIC_SUPABASE_URL, apiKey ? PUBLIC_SUPABASE_ANON_KEY : PUBLIC_SUPABASE_ANON_KEY, {
        headers: apiKey ? { Authorization: `Bearer ${token}` } : {},
        cookies: {
            get: (key) => event.cookies.get(key),
            set: (key, value, options) => event.cookies.set(key, value, { ...options, path: '/' }),
            remove: (key, options) => event.cookies.delete(key, { ...options, path: '/' })
        }
    });

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