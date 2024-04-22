<!-- +page.svelte -->
<script>
	export let data;

	// Function to extract headers from the first entry
	let headers = [];
	if (data.community.length > 0) {
		headers = Object.keys(data.community[0]);
	}

	async function handleNewRow(person) {
		const response = await fetch('./community', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ ...person }) // Example data, adjust as needed
		});

		if (response.ok) {
			console.log('Data posted successfully');
		} else {
			console.error('Failed to post data');
		}
	}

	import FormModal from '$lib/components/FormModal.svelte';

	let showModal = false;
	let currentPerson = {}; // Example initial structure

	function openModal(isNew = true, person = {}) {
		showModal = true;
		currentPerson = isNew ? { name: '' } : person;
	}

	import { invalidateAll } from '$app/navigation';

	async function handleSave(event) {
		console.log('Saving', event.detail.person);
		showModal = false;
		await handleNewRow(event.detail.person);

		//used to refresh the data on the page. Should be using some form of invalidate('/pathname') but that isn't working. InvalidateAll() is the nuclear option which clears all pages/everything.
		invalidateAll();
	}

	function handleClose() {
		showModal = false;
	}
</script>

<div class="overflow-x-auto scrollbar-styled m-4 border border-gray-300 rounded-lg">
    <table class="table table-zebra w-full border-collapse border border-gray-400">
        <thead>
            <tr class="border-b border-gray-300">
                <th class="border-r border-gray-300">Actions</th>
                {#each headers as header}
                    <th class="border-r border-gray-300">{header}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each data.community as person, index}
                <tr class="border-b border-gray-300">
                    <td class="border-r border-gray-300">
                        <button
                            class="btn btn-xs btn-accent"
                            on:click={() => openModal(false, person)}
                        >
                            Edit
                        </button>
                    </td>
                    {#each headers as key}
                        <td class="border-r border-gray-300">{person[key]}</td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<button class="btn btn-primary" on:click={() => openModal()}>Add new row</button>

<FormModal show={showModal} person={currentPerson} on:save={handleSave} on:close={handleClose} />

<!-- end file -->
