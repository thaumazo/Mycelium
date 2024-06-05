<script>
	import { onMount } from 'svelte';

	export let data = {};
	export let format = {};
	export let level = 0;
	export let table = '';
	// export let display = 'id'; // Key to display for nested objects

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
								<!-- <NestedTable {data: value} {format: format[key]} {level: level + 1} {table: table}/> -->
							</div>
						{/if}
					{/each}
					<a href={`${table}?id=eq.${item.id}`}><button class="btn">view</button></a>
				</li>
				---
			{/each}
		</ul>
	{:else if isObject(data)}
		<!-- {#if format[Object.entries(data)[0]].display}
            {data}
        {/if} -->
		{#each Object.entries(data) as [key, value]}
			{#if format[key].display}
				<div>
					<strong>{key}:</strong>{value}
					<!-- <NestedTable {data: value} {format: format[key]} {level: level + 1} {table: table}/> -->
				</div>
			{/if}
		{/each}
		<a href={`${table}?id=eq.${data.id}`}><button class="btn">view</button></a>
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
