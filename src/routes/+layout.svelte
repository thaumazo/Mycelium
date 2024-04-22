<script lang="ts">
	import '../app.css';
	// import '../styles.css'
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	import { profileStore } from '../lib/stores';
	import Navbar from '../lib/components/Navbar.svelte';

	let userSubscription = null;

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		if (session) {
			subscribeToUserProfile(session.user.id);
		}

		return () => {
			data.subscription.unsubscribe();
			if (userSubscription) {
				userSubscription.unsubscribe();
				userSubscription = null;
			}
		};
	});

	async function subscribeToUserProfile(profileId) {
		if (profileId) {
			let res = await supabase.from(`profiles`).select('*').eq('id', profileId).single();
			profileStore.set(res.data);
			console.log($profileStore);
		}
	}
</script>

<svelte:head>
	<title>User Management</title>
</svelte:head>

{#if session}
	<Navbar />
{/if}
<div class="container" style="padding: 50px 0 100px 0">
	<slot />
</div>
