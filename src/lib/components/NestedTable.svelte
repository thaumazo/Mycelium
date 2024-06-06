<script>
	import { onMount } from 'svelte';

	export let data = {};
	export let format = {};
	export let level = 0;
	export let table = '';

	function isObject(val) {
		return val && typeof val === 'object' && !Array.isArray(val);
	}

	onMount(() => {
		// console.log(format);
		// console.log(table);
	});
</script>

<div class="nested-table" style="margin-left: {level * 20}px;">
	{#if Array.isArray(data)}
		<ul>
			{#each data as item}
				<li>
					{#each Object.entries(item) as [key, value]}
						{#if format[key].display}
							<div>
								<strong>{key}:</strong>{value}
							</div>
						{/if}
					{/each}
					<a href={`${table}?id=eq.${item.id}`}><button class="btn btn-accent btn-xs">view</button></a>
				</li>
				---
			{/each}
		</ul>
	{:else if isObject(data)}
		{#each Object.entries(data) as [key, value]}
			{#if format[key].display}
				<div>
					<strong>{key}:</strong>{value}
				</div>
			{/if}
		{/each}
		<a href={`${table}?id=eq.${data.id}`}><button class="btn btn-accent btn-xs">view</button></a>
	{:else}
		{data}
	{/if}
</div>

<style>
	.nested-table {
		margin-top: 10px;
		margin-bottom: 10px;
	}
</style>
