/** @type {import('./$types').PageServerLoad} */
export async function load({fetch}) {
    let response = await fetch('https://mycelium-thaumazo.netlify.app/table/people', {
    method: 'GET', // Adjust if necessary
    headers: {
        'x-api-key': '976c8316-3b94-4232-81c0-eadde11c29a8'
    }});

    let data = await response.json()

    return {data}
}