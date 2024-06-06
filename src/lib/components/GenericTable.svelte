<script>
	export let data = [];
	export let headers = [];
	export let table = '';
	export let format = '';
	import NestedTable from './NestedTable.svelte';
	import FormatModal from '$lib/components/FormatModal.svelte';
	import { writable } from 'svelte/store';
	import {profileStore} from '$lib/stores.js';

	let showFormatModal = false;

	let selectedProperties = writable({});
	let initialSelectedProperties = headers.reduce((obj, header) => {
		if (format[header] && format[header].format === 'foreign table') {
			obj[header] = 'id';
		}
		return obj;
	}, {});
	selectedProperties.set(initialSelectedProperties);

	function openFormatModal() {
        console.log('opening format modal')
		console.log($profileStore)
        console.log(format)
		showFormatModal = true;
	}

	async function closeFormatModal(event) {
		showFormatModal = false;
        format = event.detail;
		console.log(format)
		console.log(table);
		let endpoint;
		if (table) {
			endpoint = table;
		} else endpoint = $page.url.pathname.split('/').at(-1);
		
		let body = { display: format, table: endpoint, user: $profileStore.id };
		if(format.displayId) {
			body.id = format.displayId;
		}
		let {data, error} = await fetch('./views', {
			method: format.displayId ? 'PATCH' : 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({...body})
		});
		console.log(data, error);
		
	}

	function handlePropertyChange(header, event) {
		selectedProperties.update((properties) => {
			properties[header] = event.target.value;
			return properties;
		});
	}

	onMount(async () => {
		console.log(format);
		console.log(data);
	});

	import FormModal from '$lib/components/FormModal.svelte';

	import { invalidateAll } from '$app/navigation';

	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let showModal = false;
	let currentItem = {};
	let isNew;

	const defaultValues = headers.reduce((obj, header) => {
		obj[header] = null;
		return obj;
	}, {});

	function openModal(newItem = true, item = {}) {
		showModal = true;
		isNew = newItem;
		currentItem = newItem ? defaultValues : item;
	}

	function closeModal() {
		showModal = false;
	}

	// Events for adding/updating items

	async function handleNewRow(item, isNew) {
		let endpoint;
		if (table) {
			endpoint = table;
		} else endpoint = $page.url.pathname.split('/').at(-1);

		console.log(endpoint, item, isNew);
		if (isNew) {
			delete item.id;
		}

		try {
			console.log(endpoint, item);

			const response = await fetch(`./${endpoint}`, {
				method: isNew ? 'POST' : 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ...item })
			});

			if (response.ok) {
				console.log('Data posted successfully', response);
			} else {
				const errorData = await response.json();
				console.error('Failed to post data', errorData);
			}
		} catch (error) {
			console.error('Error posting data', error);
		}
	}

	async function handleSave(event) {
		console.log('Saving', event.detail.item);
		showModal = false;
		handleNewRow(event.detail.item, event.detail.isNew);

		//used to refresh the data on the page. Should be using some form of invalidate('/pathname') but that isn't working. InvalidateAll() is the nuclear option which clears all pages/everything.
		invalidateAll();
	}

	async function handleDelete(event) {
		let endpoint;
		if (table) {
			endpoint = table;
		} else endpoint = $page.url.pathname.split('/').at(-1);
		let item = event.detail.item;
		console.log('Deleting...', item);
		showModal = false;
		console.log();
		const response = await fetch(`./${endpoint}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ ...item })
		});

		//used to refresh the data on the page. Should be using some form of invalidate('/pathname') but that isn't working. InvalidateAll() is the nuclear option which clears all pages/everything.
		invalidateAll();
	}
</script>

<div class="overflow-x-auto scrollbar-styled m-4 border border-gray-300 rounded-lg">
	<table class="table table-zebra w-full border-collapse border border-gray-400">
		<thead>
			<tr class="border-b border-gray-300">
				<th class="border-r border-gray-300">
                    <button class="btn btn-xs btn-primary" on:click={openFormatModal}>
                        Display
                    </button>
                </th>
				{#each headers as header}
					{#if format[header]?.format && format[header].display}
						<th class="border-r border-gray-300"
							>{header}{` <${format[header].format}>`}
                            <input type="checkbox" name="" id="" bind:checked={format[header].display}>
							</th
						>
					{/if}
				{/each}
			</tr>
		</thead>
		<tbody>
			<slot>
				{#each data as item, index}
					<tr class="border-b border-gray-300">
						<td class="border-r border-gray-300">
							<button class="btn btn-xs btn-accent" on:click={() => openModal(false, item)}>
								Edit
							</button>
						</td>
						{#each headers as key}
							{#if format[key]?.format && format[key].display}
								<td class="border-r border-gray-300"
									>{#if format[key].format.includes('foreign table')}
										<NestedTable
											data={item[key]}
											format={format[key]}
											display={format[key].display}
											table={format[key].table}
										/>
									{:else}
										{item[key]}
									{/if}</td
								>
							{/if}
						{/each}
					</tr>
				{/each}
			</slot>
		</tbody>
	</table>
</div>

<button class="btn btn-primary" on:click={() => openModal()}>Add new row</button>

<FormModal
	show={showModal}
	item={currentItem}
	{format}
	{isNew}
	on:remove={handleDelete}
	on:save={handleSave}
	on:close={closeModal}
/>


<FormatModal show={showFormatModal} {format} on:close={closeFormatModal} />
