<script>
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';
	import GenericCard from '$lib/components/GenericCard.svelte';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	

	let redirect = 'https://mycelium-thaumazo.netlify.app/auth/callback'

	export let data;

	onMount(() => {
		if (dev) {
			redirect = 'https://localhost:5173/auth/callback';
		}
		console.log(redirect);
	});
</script>

<GenericCard title="Log In">
		<Auth supabaseClient={data.supabase} view="sign_in" showlinks="true" providers={["google"]} redirectTo{redirect}/>
</GenericCard>
