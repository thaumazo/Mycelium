<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import GenericCard from './GenericCard.svelte';
	let dispatch = createEventDispatcher();

	// export let suggestedItem;
	export let item;
	export let items;
	export let tags;
	let newItem = false;

    $: {

        console.log(item, items);
        let existingItem = items.find((i) => i.name.toLowerCase() === item.name.toLowerCase());
        console.log(existingItem);
        if (existingItem) {
            item = {...item, id: existingItem.id};
        }
        
        if (item.id) newItem = false;
        else newItem = true;
        console.log(item, newItem);
    }
</script>

<div class="m-4">
    {#if item}
        <GenericCard title={item.name}>
            <p>{item.description}</p>
            {#if item.tags}
                {#each item.tags as tag}
                    <p>#{tag.name}</p>
                {/each}
            {/if}

            <!-- edit button -->
            <div>
                <button
                    class="btn btn-error"
                    on:click={() => {
                        dispatch('reject', item);
                    }}>Reject</button
                >
                <button
                    class="btn btn-warning"
                    on:click={() => {
                        dispatch('edit', item);
                    }}>Edit</button
                >
                
                {#if newItem}
                    <button
                        class="btn btn-info"
                        on:click={() => {
                            dispatch('createNew', item);
                        }}>Create New</button
                    >
                {:else}
                    <button
                        class="btn btn-success"
                        on:click={() => {
                            dispatch('accept', item);
                        }}>Accept</button
                    >
                {/if}
            </div>
        </GenericCard>
    {/if}
</div>
