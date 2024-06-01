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
	<GenericTable {headers} data={data.data} >
		{#each data.data as item, index}     
                <tr class="border-b border-gray-300">
                    <td class="border-r border-gray-300">
                        <button
                            class="btn btn-xs btn-accent"
                            on:click={() => openModal(false, item)}
                        >
                            Edit
                        </button>
                    </td>
                    <td class="border-r border-gray-300">{item.data}</td>
					<td class="border-r border-gray-300">{item.other_column}</td>
					{#if item.person}
						<td class="border-r border-gray-300">{item.person.name}</td>
					{/if}
                </tr>
            {/each}
	</GenericTable>
{/if}
