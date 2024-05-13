import { loadUtil } from '$lib/apiUtils.js';

export async function load({ fetch }) {
    let data = []
    try {
        data = await loadUtil(fetch, './table/tasks?select=*')
        console.log(data);
    } catch (error) {
        console.log(error.message)
    }
    return { tasks: data };
}

/** @type {import('./$types').Actions} */
export const actions = {
    edit: async ({ request, locals }) => {
        const form = await request.formData();
        const id = form.get('id');

        const name = form.get('name');
        const status = form.get('status');
        const { data, error } = await locals.supabase
            .from('tasks')
            .update({ name, status })
            .eq('id', id)
            .select()

        return { success: true };
    },
    delete: async (event) => {
        // TODO register the user
    }
};

// src/routes/tasks.js