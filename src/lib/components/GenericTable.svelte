<script>
    export let data = [];
    export let headers = [];
    import FormModal from '$lib/components/FormModal.svelte';

    let showModal = false;
    let currentItem = {};

    function openModal(isNew = true, item = {}) {
        showModal = true;
        currentItem = isNew ? { name: '' } : item;
    }

    function closeModal() {
        showModal = false;
    }

    // Events for adding/updating items
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    function handleSave(item) {
        dispatch('save', { item });
        closeModal();
    }
</script>

<div class="overflow-x-auto scrollbar-styled m-4 border border-gray-300 rounded-lg">
    <table class="table table-zebra w-full border-collapse border border-gray-400">
        <thead>
            <tr class="border-b border-gray-300">
                <th class="border-r border-gray-300">Actions</th>
                {#each headers as header}
                    <th class="border-r border-gray-300">{header}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each data as item, index}
                <tr class="border-b border-gray-300">
                    <td class="border-r border-gray-300">
                        <button
                            class="btn btn-xs btn-accent"
                            on:click={() => openModal(false, item)}
                        >
                            Edit
                        </button>
                    </td>
                    {#each headers as key}
                        <td class="border-r border-gray-300">{item[key]}</td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<button class="btn btn-primary" on:click={() => openModal()}>Add new row</button>
<FormModal show={showModal} item={currentItem} on:save={handleSave} on:close={closeModal} />
