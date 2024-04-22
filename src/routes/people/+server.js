import { json } from '@sveltejs/kit'
import { checkApiKey } from '$lib/apiUtils';

// All of the functions in this file should be abstracted to a different utils file 

export const GET = async ({ request, locals: { supabase, safeGetSession } }) => {
  const { session } = await safeGetSession()
    try {
        // Only check the API key if the user is not authenticated via normal web session
        if (!session && !await checkApiKey(request, supabase)) {
            throw new Error('Authentication required');
        }

        const { data, error } = await supabase.from("people").select("*");
        if (error) throw new Error(error.message);
        return json(data);
    } catch (error) {
        console.log(error.message);
        return json({ error: error.message }, { status: 401 });
    }
};


//needs to be updated to accept API keys. 
export async function POST({ request }) {
  try {
    const dataEntry = await request.json();
    let result;

    if (dataEntry.id) {
      // If an ID is present, update the existing record
      const { data, error } = await supabase
        .from('people')
        .update(dataEntry)
        .match({ id: dataEntry.id });  // Ensure to match the correct record by ID

      result = { message: 'Community member updated successfully!', data };
      if (error) throw new Error(error.message);
    } else {
      // No ID, insert a new record
      const { data, error } = await supabase
        .from('people')
        .insert([dataEntry]);

      result = { message: 'New community member added successfully!', data };
      if (error) throw new Error(error.message);
    }

    return json(result, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}