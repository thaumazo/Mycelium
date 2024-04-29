import { json } from '@sveltejs/kit'
import { checkApiKey } from '$lib/secretApiUtils';

// All of the functions in this file should be abstracted to a different utils file so they can be used in other routes.
export async function loadUtil(fetch, endpoint) {
  try {
    let res = await fetch(`./${endpoint}`);
    let data = await res.json();
    return { data };
  } catch (error) {
    console.error(error.message);
    return { data: [] };
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

function removeNullProperties(obj) {
  return Object.keys(obj)
      .filter(key => obj[key] !== null)  // Keep only keys where value is not null
      .reduce((acc, key) => {
          acc[key] = obj[key];  // Assign each non-null value back to a new object
          return acc;
      }, {});
}

export const postUtil = async (request, endpoint, supabase, safeGetSession) => {
  const { session } = await safeGetSession();
  console.log('Request:', request);
  try {
    if (!session && !await checkApiKey(request, supabase)) {
      throw new Error('Authentication required');
    }
    const dataEntry = removeNullProperties(await request.json());
    const { data, error } = await supabase
      .from(endpoint)
      .insert([dataEntry]);

    if (error) throw new Error(error.message);
    return json({ message: 'New data added successfully!', data });
  } catch (error) {
    console.log('Server error:', error.message);
    return json({ error: error.message }, { status: error.status || 500 });
  }
};

export const patchUtil = async (request, endpoint, supabase, safeGetSession) => {
  const { session } = await safeGetSession()
  try {
    if (!session && !await checkApiKey(request, supabase)) {
      throw new Error('Authentication required');
    }
    const dataEntry = removeNullProperties(await request.json());
    let result;
    const { data, error } = await supabase
            .from(endpoint)
            .update(dataEntry)
            .match({ id: dataEntry.id });

    result = { message: 'Data updated successfully!', data };
    if (error) throw new Error(error.message);
    return json(result)
  } catch (error) {
    console.log(error.message);
    return json({ error: error.message }, { status: 401 });
  }
}
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