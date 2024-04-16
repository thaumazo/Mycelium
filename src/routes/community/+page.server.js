
import { json } from '@sveltejs/kit'

export async function load({fetch}) {
  let res = await fetch("./community");
  let data = await res.json();
  return {
    community: data ?? [],
  };
}