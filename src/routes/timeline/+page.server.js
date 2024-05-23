//<!-- +page.server.js -->
import { loadUtil } from '$lib/apiUtils.js';

export async function load(event) {
  // Define searchParams as an object with default parameters
  let filter = {
    select: "created_at, item(name, tags!inner(name)), description", // ex: id, name, profile!inner(id, name) 
    limit: 10,
    order: "created_at.desc"
    // Add additional query parameters as needed, e.g., eq: "id=value", "name=test"
  };
  let table = "table/log";

  // Call loadUtil with the modified event
  return await loadUtil(event, table, filter);
}