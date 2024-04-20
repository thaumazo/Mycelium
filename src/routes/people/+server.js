import { json } from '@sveltejs/kit'
import { supabase } from "$lib/supabaseClient";

export async function GET(event) {
  try {
    const { data, error } = await supabase.from("people").select("*");
    return json(data)
  } catch (error) {
    console.log(error.message)
  }
}

export async function POST({ request }) {
  try {
    const dataEntry = await request.json();
    let result;

    if (dataEntry.id) {
      // If an ID is present, update the existing record
      const { data, error } = await supabase
        .from('people')
        .update(dataEntry)
        .match({ id: dataEntry.id });  // Ensure to match the correct record by ID

      result = { message: 'Community member updated successfully!', data };
      if (error) throw new Error(error.message);
    } else {
      // No ID, insert a new record
      const { data, error } = await supabase
        .from('people')
        .insert([dataEntry]);

      result = { message: 'New community member added successfully!', data };
      if (error) throw new Error(error.message);
    }

    return json(result, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}