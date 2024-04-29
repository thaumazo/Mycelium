<!-- src/lib/Modal.svelte -->
<script>
    import { createEventDispatcher } from 'svelte';

    export let show = false;
    export let item = {};
    export let isNew;

    const dispatch = createEventDispatcher();

    function save() {
        dispatch('save', { item, isNew });
    }

    function close() {
        dispatch('close');
    }

    // Dynamically determine the fields from the item object
    $: fields = item ? Object.keys(item) : [];
</script>

{#if show}
<div class="modal modal-open">
    <div class="modal-box">
        <form on:submit|preventDefault={save}>
            {#each fields as field}
                <div class="form-control">
                    <label class="label" for={field}>
                        <span class="label-text capitalize">{field}:</span>
                    </label>
                    <input type="text" id={field} class="input input-bordered" bind:value={item[field]}>
                </div>
            {/each}
            <div class="modal-action">
                <button type="submit" class="btn btn-primary">Save</button>
                <button type="button" class="btn" on:click={close}>Cancel</button>
            </div>
        </form>
    </div>
    <div class="modal-overlay" on:click={close}></div>
</div>
{/if}
