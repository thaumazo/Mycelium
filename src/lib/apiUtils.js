import { json } from '@sveltejs/kit'
import { checkApiKey } from '$lib/secretApiUtils';

// All of the functions in this file should be abstracted to a different utils file so they can be used in other routes.
export async function loadUtil(fetch, endpoint) {
    try {
      let res = await fetch(`./${endpoint}`);
      let data = await res.json();
      return {data};
    } catch (error) {
      console.error(error.message);
      return {data: []};
    }
  }

export const getUtil = async (request, endpoint, supabase, safeGetSession) => {
    const { session } = await safeGetSession()
    try {
        // Only check the API key if the user is not authenticated via normal web session
        if (!session && !await checkApiKey(request, supabase)) {
            throw new Error('Authentication required');
        }

        const { data, error } = await supabase.from(endpoint).select("*");
        if (error) throw new Error(error.message);
        return json(data);
    } catch (error) {
        console.log(error.message);
        return json({ error: error.message }, { status: 401 });
    }
};