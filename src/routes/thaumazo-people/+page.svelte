<script>
	export let data = [];

	// Function to extract headers from the first entry
	let headers = [];
	$: {
		if (data.data.length > 0) {
			headers = Object.keys(data.data[0]);
		}
	}

	onMount(() => {
		console.log(data);
	});

	import GenericTable from '$lib/components/GenericTable.svelte';
	import { onMount } from 'svelte';
</script>

{#if data}
	<GenericTable {headers} data={data.data} />
{/if}
