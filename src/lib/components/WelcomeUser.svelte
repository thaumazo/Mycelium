<script>
	import { onMount } from 'svelte';
	import { profileStore } from '$lib/stores';
</script>

{#if $profileStore}
	<p>Hello {$profileStore.full_name}</p>
{/if}
