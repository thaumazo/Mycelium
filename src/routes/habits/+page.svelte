<script>
	import { onMount } from 'svelte';

	export let data;

	let habits = [];

	onMount(() => {
		console.log(data.habits);
		if (data.habits) {
			habits = data.habits.all;
		}
	});

	function isCompleted(habit) {
		return data.habits.completed.some((entry) => entry.item.id === habit.id);
	}
</script>

<p>Habits Testing</p>
<div>
	{#if habits.length > 0}
		<ul>
			{#each habits as habit}
				<div class="card w-96 bg-base-100 shadow-xl m-4">
					<div class="card-body">
						<h2 class="card-title">{habit.name}</h2>
						<div class="card-actions">
							{#if isCompleted(habit)}
								✅
							{:else}
								❌
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</ul>
	{:else}
		<p>No habits found for today.</p>
	{/if}
</div>
