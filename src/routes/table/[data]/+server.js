//<!-- +server.js -->

import { json } from '@sveltejs/kit'
import { checkApiKey } from '$lib/secretApiUtils';
import { getUtil } from '$lib/apiUtils.js';

// All of the functions in this file should be abstracted to a different utils file so they can be used in other routes.

export const GET = async ({ request, url, locals: { supabase, safeGetSession } }) => {
  let endpoint = url.toString().split('/').at(-1)
  let data;
  try {
    data = await getUtil(request, endpoint, supabase, safeGetSession)
  } catch (error) {
    console.log(error.message)
  }
  return data;
};


//needs to be updated to accept API keys. 
// export async function POST({ request }) {
//   try {
//     const dataEntry = await request.json();
//     let result;

//     if (dataEntry.id) {
//       // If an ID is present, update the existing record
//       const { data, error } = await supabase
//         .from('people')
//         .update(dataEntry)
//         .match({ id: dataEntry.id });  // Ensure to match the correct record by ID

//       result = { message: 'Community member updated successfully!', data };
//       if (error) throw new Error(error.message);
//     } else {
//       // No ID, insert a new record
//       const { data, error } = await supabase
//         .from('people')
//         .insert([dataEntry]);

//       result = { message: 'New community member added successfully!', data };
//       if (error) throw new Error(error.message);
//     }

//     return json(result, { status: 200 });
//   } catch (error) {
//     return json({ error: error.message }, { status: 500 });
//   }
// }