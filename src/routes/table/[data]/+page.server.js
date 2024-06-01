//<!-- +page.server.js -->
import { loadUtil, fetchGeneratedTypes } from '$lib/apiUtils.js';

export async function load(event) {
  // Define searchParams as an object with default parameters
  let filter = {
    select: "*" // ex: id, name, profile!inner(id, name) 
    // Add additional query parameters as needed, e.g., eq: "id=value", "name=test"
  };
  let table = event.url.pathname.split('/').at(-1);
  // let types = await fetchGeneratedTypes(event.fetch);
  // console.log("types", types);

  // Call loadUtil with the modified event
  return await loadUtil(event, table, filter);
}