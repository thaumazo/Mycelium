<!-- +page.svelte -->
<script>
	export let data;

	// Function to extract headers from the first entry
	let headers = [];
	$: {if (data.data.length > 0) {
		headers = Object.keys(data.data[0]);
		console.log(data);
	}}



	import GenericTable from '$lib/components/GenericTable.svelte';
</script>

<GenericTable {headers} data={data.data} format={data.format}/>

<!-- end file -->
