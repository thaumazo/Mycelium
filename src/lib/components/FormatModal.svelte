<script>
	import { onMount } from "svelte";
	import { createEventDispatcher } from 'svelte';

	export let show = false;
	export let format = {};

	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close', format);
	}

	onMount(() => {
		// console.log('format, ', format);
		// Object.entries(format).forEach(element => {
		// 	console.log(element);
		// });
	});
</script>

{#if show}
    <div class="modal modal-open">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Data Format</h3>
            <div>
                {#each Object.entries(format) as key}
                {#if key[0] !== 'displayId'}
                    <div>
                        <label>
                            <input type="checkbox" bind:checked={key[1].display}/> <strong>{key[0]}</strong>
                        </label>
                        {#if key[1].format.includes('foreign table')}
                            <ul>
                                {#each Object.entries(key[1]) as subKey}
                                    {#if subKey[1].format}
                                        <li class="ml-5">
                                            <label>
                                                <input type="checkbox" bind:checked={subKey[1].display}/> {subKey[0]}
                                            </label>
                                        </li>
                                    {/if}   
                                {/each}
                            </ul>
                        {/if}
                    </div>
                    {/if}
                {/each}
            </div>
            <div class="modal-action">
                <button type="button" class="btn" on:click={close}>Close</button>
            </div>
        </div>
        <div class="modal-overlay" on:click={close}></div>
    </div>
{/if}
