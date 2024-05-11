// src/hooks.server.ts
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY} from '$env/static/public'
import {SECRET_JWT_SECRET} from '$env/static/private'
import { createServerClient } from '@supabase/ssr'
import type { Handle } from '@sveltejs/kit'
import jwt from 'jsonwebtoken';
import { validateApiKey } from '$lib/secretApiUtils';
import { createClient } from '@supabase/supabase-js'

export const handle: Handle = async ({ event, resolve }) => {
  console.log('hooks')
  console.log(event.request)
  const apiKey = event.request.headers.get('x-api-key');
    let supabase;

    if (apiKey) {
        const isValid = await validateApiKey(apiKey);
        if (isValid) {
            const token = jwt.sign({ role: 'api_user' }, SECRET_JWT_SECRET, { expiresIn: '1h' });
            event.cookies.set('auth_token', token, { path: '/', httpOnly: true });

            // Create the client with the JWT if the API key is valid
            supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('api-key supabase')
            console.log(supabase)
        } else {
            throw new Error('Invalid API Key');
        }
    } else {
        // Use the server-side client for users without an API key
        supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
            cookies: {
                get: (key) => event.cookies.get(key),
                set: (key, value, options) => event.cookies.set(key, value, { ...options, path: '/' }),
                remove: (key, options) => event.cookies.delete(key, { ...options, path: '/' })
            }
        });
        console.log('server supabase')
        console.log(supabase)
    }

    // Attach the supabase client to event.locals for use in endpoints and other hooks
    event.locals.supabase = supabase;
    console.log('locals supabase')
    console.log(supabase)


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