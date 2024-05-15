import { loadUtil } from '$lib/apiUtils.js';

export async function load(event) {
  let table = 'tasks'
  let filters = {
    select: "id, name, status"
    // Add additional query parameters as needed, e.g., eq: "id=value", "name=test"
  };

  // Call loadUtil with the modified event
  return await loadUtil(event, table, filters);
}
