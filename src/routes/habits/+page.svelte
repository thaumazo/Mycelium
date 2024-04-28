<!-- +page.svelte -->
<script>
	export let data;

	// Function to extract headers from the first entry
	let headers = [];
	if (data.data.length > 0) {
		headers = Object.keys(data.data[0]);
	}

	// async function handleNewRow(person) {
	// 	const response = await fetch('./community', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify({ ...person }) // Example data, adjust as needed
	// 	});

	// 	if (response.ok) {
	// 		console.log('Data posted successfully');
	// 	} else {
	// 		console.error('Failed to post data');
	// 	}
	// }

	import FormModal from '$lib/components/FormModal.svelte';

	let showModal = false;
	let currentPerson = {}; // Example initial structure

	function openModal(isNew = true, person = {}) {
		showModal = true;
		currentPerson = isNew ? { name: '' } : person;
	}

	import { invalidateAll } from '$app/navigation';
	import GenericTable from '../../lib/components/GenericTable.svelte';

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

<GenericTable {headers} data={data.data} />

<!-- end file -->
