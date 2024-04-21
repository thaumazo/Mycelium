<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';

	export let data;
	console.log(data);
</script>

<svelte:head>
	<title>User Management</title>
</svelte:head>

<h1 class="text-2xl">Welcome to the Community Mycelium</h1>

<a class="link" href="/people">People</a>

<div class="row flex-center flex">
	<div class="col-6 form-widget">
		{#if data.session}
			<p>Hello user!</p>
		{:else}
			<Auth
				supabaseClient={data.supabase}
				view="sign_in"
				redirectTo={`${data.url}/auth/callback`}
				showLinks={false}
				appearance={{ theme: ThemeSupa, style: { input: 'color: #fff' } }}
			/>
		{/if}
	</div>
</div>
