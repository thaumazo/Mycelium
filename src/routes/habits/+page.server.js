//<!-- +page.server.js -->
import { loadUtil } from '../../lib/apiUtils.js';
import { page } from '$app/stores';

export async function load({ fetch, url }) {
  let endpoint = url.pathname.split('/')[1];
  console.log(endpoint)
  let data = []
  try {
    data = await loadUtil(fetch, endpoint) 
  } catch (error) {
    console.log(error.message)
  }
  return data;
}