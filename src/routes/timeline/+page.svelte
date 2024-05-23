<!-- +page.svelte -->
<script>
	export let data;

	// Function to extract headers from the first entry
	let headers = [];
	let log = [];
	$: {
		if (data.data.length > 0) {
			console.log(data);

			data.data.forEach((element) => {
				let tags = [];
				console.log(element);
				if (element.item.tags) {
					element.item.tags.forEach((tag) => {
						tags.push(tag.name);
					});
				}
				//TODO: Update this and add ui features as a privacy screen
				if (!element.item.name.toLowerCase().includes('weed')) {
					log.push({
						created_at: new Date(element.created_at).toLocaleString(),
						item: element.item.name,
						tags: tags,
						description: element.description
					});
				}
			});
			headers = Object.keys(log[0]);
			console.log(log);
		}
	}

	import GenericTable from '$lib/components/GenericTable.svelte';
</script>

{#if data.data}
	<GenericTable {headers} data={log} />
{/if}

<!-- end file -->
