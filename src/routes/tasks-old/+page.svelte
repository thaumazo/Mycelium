<script>
	import { onMount } from 'svelte';
	import TaskItem from '../../lib/components/TaskItem.svelte';

    export let data;

    onMount(()=> {
        console.log(data.tasks);
    })

</script>

<h1>Tasks</h1>
{#if data.tasks}
    {#each data.tasks.data as task}
        <TaskItem {task} />
    {/each}
{/if}

