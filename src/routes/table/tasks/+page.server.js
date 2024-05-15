import { loadUtil } from '$lib/apiUtils.js';

export async function load(event) {
  // Define searchParams as an object with default parameters
  let searchParams = {
    select: "name, status"
    // Add additional query parameters as needed, e.g., eq: "id=value", "name=test"
  };
  let url = new URL(event.url);
  // Convert searchParams to an array of key-value pairs and append them to event.url.searchParams
  for (const [key, value] of Object.entries(searchParams)) {
    url.searchParams.append(key, value);
  }

  // Call loadUtil with the modified event
  return await loadUtil({...event, url});
}
