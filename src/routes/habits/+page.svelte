<script>
	import { onMount } from 'svelte';

    export let data;

    let habits = [];

    onMount(() => {
        if (data && data.data) {
            habits = data.data;
            console.log(habits);
        }
    });
</script>

<style>
    .habit {
        padding: 10px;
        margin: 5px 0;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #f9f9f9;
    }
</style>

<p>Habits Testing</p>
{#if habits.length > 0}
    <ul>
        {#each habits as habit}
            <li class="habit">
                <p><strong>Created At:</strong> {habit.created_at}</p>
                <p><strong>ID:</strong> {habit.item.id}</p>
                <p><strong>Name:</strong> {habit.item.name}</p>
            </li>
        {/each}
    </ul>
{:else}
    <p>No habits found for today.</p>
{/if}
