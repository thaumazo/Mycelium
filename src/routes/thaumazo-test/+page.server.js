/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    try {
        let response = await fetch('https://mycelium-thaumazo.netlify.app/table/reid_testing?select=data,person(name),other_column', {
            method: 'GET', // Adjust if necessary
            headers: {
                'x-api-key': '976c8316-3b94-4232-81c0-eadde11c29a8'
            }
        });

        if (!response.ok) {
            console.error(`Failed to fetch data: HTTP status ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();

        return { data };
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return {
            error: `Failed to load data: ${error.message}`
        };
    }
}
