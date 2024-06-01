<script>
    export let data = [];
    export let headers = [];
    export let table = '';
    import FormModal from '$lib/components/FormModal.svelte';

    import { invalidateAll } from '$app/navigation';
    
    import { page } from '$app/stores';

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
    if(table){
        endpoint = table;
    }
    else endpoint = $page.url.pathname.split('/').at(-1);

    console.log(endpoint, item, isNew);
    if (isNew) {
        delete item.id;
    }

    try {
        console.log(endpoint, item)

        const response = await fetch(`./${endpoint}`, {
            method: isNew ? 'POST' : 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({...item})
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
		handleNewRow(event.detail.item, event.detail.isNew)

		//used to refresh the data on the page. Should be using some form of invalidate('/pathname') but that isn't working. InvalidateAll() is the nuclear option which clears all pages/everything.
		invalidateAll();
	}

    async function handleDelete(event) {
        let endpoint;
        if(table){
        endpoint = table;
    }
    else endpoint = $page.url.pathname.split('/').at(-1);
        let item = event.detail.item;
		console.log('Deleting...', item);
		showModal = false;
        console.log()
        const response = await fetch(`./${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({...item})
        });


		//used to refresh the data on the page. Should be using some form of invalidate('/pathname') but that isn't working. InvalidateAll() is the nuclear option which clears all pages/everything.
		invalidateAll();
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
            <slot>
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
            </slot>
        </tbody>
    </table>
</div>

<button class="btn btn-primary" on:click={() => openModal()}>Add new row</button>

<FormModal show={showModal} item={currentItem} {isNew} on:remove={handleDelete} on:save={handleSave} on:close={closeModal}  />
