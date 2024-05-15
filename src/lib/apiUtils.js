import { json } from '@sveltejs/kit'
import { checkApiKey } from '$lib/secretApiUtils';


// All of the functions in this file should be abstracted to a different utils file so they can be used in other routes.
export async function loadUtil({url, fetch}, table, filters) {
  console.log("loadUtil")
  let newUrl = new URL(url);

  for (const [key, value] of Object.entries(filters)) {
    newUrl.searchParams.append(key, value);
  }

  console.log(newUrl);

  try {
    let res = await fetch(`./${table + newUrl.search}`);
    //may want to update this so that its doing absolute and not relative URLs
    let data = await res.json();
    return { data };
  } catch (error) {
      console.error(error.message);
    return { data: [], error: error.message };
  }
}


// can take custom url parameters ex: fetch('/table/people?name=eq.reid+api+test')
export const GET = async ({request, locals: {supabase}}) => {
  console.log("getUtil")
  try {
    let url = new URL(request.url)
    let endpoint = url.pathname.split('/').at(-1);
    let searchParams = url.searchParams
    let query = supabase.from(endpoint).select(searchParams.get("select"));

    query.url.search = url.searchParams;

    const { data, error } = await query;
    if (error) console.log(error);
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
      acc[key] = obj[key];  // Assign each bon-null value back to a new object
      return acc;
    }, {});
}

export const POST = async ({request, locals: {supabase, safeGetSession}}) => {
  console.log("POST")
  try {
    let url = new URL(request.url)
    let table = url.pathname.split('/').at(-1);
    //never have more than 1 'await request.json()' it will throw an 'unusable body' error
    const dataEntry = removeNullProperties(await request.json());
    const { data, error } = await supabase
      .from(table)
      .insert([dataEntry]);

    if (error) throw new Error(error.message);
    return json({ message: 'New data added successfully!', data });
  } catch (error) {
    console.log('Server error:', error.message);
    return json({ error: error.message }, { status: error.status || 500 });
  }
};

export const PATCH = async ({request, locals: {supabase, safeGetSession}}) => {
  console.log("PATCH")
  try {
    let url = new URL(request.url)
    let table = url.pathname.split('/').at(-1);
    //never have more than 1 'await request.json()' it will throw an 'unusable body' error
    const dataEntry = removeNullProperties(await request.json());
    let result;
    const { data, error } = await supabase
      .from(table)
      .update({...dataEntry})
      .match({ id: dataEntry.id });

    result = { message: 'Data updated successfully!', data };
    if (error) throw new Error(error.message);
    return json(result)
  } catch (error) {
    console.log(error.message);
    return json({ error: error.message }, { status: 401 });
  }
}