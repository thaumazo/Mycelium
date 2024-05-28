<script>
	import { goto } from '$app/navigation';
	import LogSuggestion from '../../lib/components/LogSuggestion.svelte';
	import FormModal from '$lib/components/FormModal.svelte';

	let showModal = false;

	let displayInput = true;
	let tags,
		items,
		suggestions = [],
		resolved = [];
	// tags = [{ name: 'work', id: 1 }];
	// items = [{ name: 'Programming', id: 9 }];
	// suggestions = [
	// 	{
	// 		name: 'programming',
	// 		description: 'spent the morning programming'
	// 	},
	// 	{
	// 		name: 'shower',
	// 		description: 'took a shower'
	// 	},
	// 	{
	// 		name: 'programming',
	// 		description: 'back to programming'
	// 	}
	// ];

	let value = '';
	async function handleSubmit() {
		suggestions = [];
		resolved = [];
		console.log(value);
		let headersList = {
			Accept: '*/*',
			key: 'mycelium',
			'Content-Type': 'application/json'
		};

		let bodyContent = JSON.stringify({
			content: value
		});

		let response = await fetch('/new-log', {
			method: 'POST',
			body: bodyContent,
			headers: headersList
		});

		let data = await response.json();
		suggestions = data.suggestions;
		items = data.items;
		tags = data.tags;
		console.log(data);
	}
	async function handleReject(event, index) {
		//remove the item from the suggestions list
		let removedItem = suggestions.splice(index, 1)[0];
		console.log(removedItem);
		//reassign for reactivity
		resolved = [...resolved, { ...removedItem, status: '❌' }];
		suggestions = [...suggestions];
	}

	async function handleAccept(event, index) {
		let res = await fetch('./table/log', {
			method: 'POST',
			body: JSON.stringify({
				item: event.detail.id,
				description: event.detail.description
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		let removedItem = suggestions.splice(index, 1)[0];
		console.log(removedItem);
		//reassign for reactivity
		resolved = [...resolved, { ...removedItem, status: '✅' }];
		suggestions = [...suggestions];
		console.log(res);
	}
	let isNew = false;
	let currentItem = {};
	async function handleCreateNew(event, index) {
		console.log(event);
		isNew = true;
		currentItem = { name: event.detail.name };
		showModal = true;
		_i = index;
	}

	async function handleNew(event) {
		console.log("handleNew", event.detail.item);
		showModal = false;
		let res = await fetch('./table/items', {
			method: 'POST',
			body: JSON.stringify({
				name: event.detail.item.name
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		let data = await res.json();
		console.log(data);
		items = [...items, data.data[0]];
		console.log('items: ', items);
		const updatedItem = data.data[0];
		console.log(updatedItem);
		console.log(_i, suggestions[_i])
		suggestions[_i] = {...suggestions[_i], ...updatedItem};
		suggestions = [...suggestions];
		console.log(suggestions);
	}

	let _i;
	function openEdit(event, index) {
		_i = index;
		isNew = false;
		let itemCopy = { ...suggestions[index] };
		currentItem = itemCopy;
		showModal = true;
	}

	async function handleEdit(event) {
		// Create a copy of the original array
		const updatedItem = event.detail.item;
		suggestions[_i] = updatedItem;
	console.log(suggestions);

	}
</script>

<div class="hero min-h-screen bg-base-200">
	<div class="hero-content text-center w-full h-full">
		{#if suggestions.length > 0}
			<div class="flex-col">
				{#each suggestions as item, index (index)}
					<LogSuggestion
						{item}
						{tags}
						{items}
						on:accept={handleAccept}
						on:createNew={(event)=>{handleCreateNew(event, index)}}
						on:edit={(event) => {
							openEdit(event, index);
						}}
						on:reject={(event) => {
							handleReject(event, index);
						}}
					/>
				{/each}
				{#if resolved.length > 0}
					<div class="flex-col">
						{#each resolved as resolvedItem}
							<p>{resolvedItem.name}{resolvedItem.status}</p>
						{/each}
					</div>
				{/if}
			</div>
		{:else}
			<form
				class="flex flex-col h-4/5 w-4/5"
				on:submit={(event) => {
					event.preventDefault();
					handleSubmit();
				}}
			>
				<textarea
					class="textarea textarea-primary m-1 textarea-lg flex-1"
					name="input"
					placeholder="Log your day!"
					bind:value
				></textarea>
				<button class="btn btn-primary m-1" action="submit">Submit</button>
			</form>
		{/if}
	</div>
</div>

<FormModal
	show={showModal}
	item={currentItem}
	{isNew}
	on:save={(event) => {
		if (isNew) handleNew(event, _i);
		else handleEdit(event);
		showModal = false;
	}}
	on:close={() => {
		showModal = false;
	}}
/>
