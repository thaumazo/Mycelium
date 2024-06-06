//<!-- +page.server.js -->
import { loadUtil } from '$lib/apiUtils.js';

export async function load(event) {
  // Define searchParams as an object with default parameters
  let filter = {
    select: "id, created_at, item(id, name, tags(name)), description", // ex: id, name, profile!inner(id, name) 
    limit: 20,
    order: "created_at.desc"
    // Add additional query parameters as needed, e.g., eq: "id=value", "name=test"
  };
  let table = "table/log";
'.'
  // Call loadUtil with the modified event
  return await loadUtil(event, table, filter);
}