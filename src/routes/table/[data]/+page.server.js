//<!-- +page.server.js -->
import { loadUtil, postUtil, fetchGeneratedTypes } from '$lib/apiUtils.js';

export async function load(event) {
  // Define searchParams as an object with default parameters
  let table = event.url.pathname.split('/').at(-1);

  let { query, format } = await fetchGeneratedTypes(event.fetch, table);


  // console.log(query, format);

  let filter = {
    select: query // ex: id, name, profile!inner(id, name) 
    // Add additional query parameters as needed, e.g., eq: "id=value", "name=test"
  };

  // let types = await fetchGeneratedTypes(event.fetch);
  // console.log("types", types);

  // Call loadUtil with the modified event
  let { data, error } = await loadUtil(event, table, filter);
  return { format, data, error };
}