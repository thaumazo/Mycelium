<script>
	import { onMount } from 'svelte';
	import { profileStore } from '$lib/stores';
</script>

{#if $profileStore}
	<p>Hello {$profileStore.full_name}</p>
	<button class="btn btn-primary m-4"><a href="new-log">New Log</a></button>
{/if}
