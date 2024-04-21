<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';
	import WelcomeUser from '../lib/components/WelcomeUser.svelte';

	export let data;
</script>

<svelte:head>
	<title>User Management</title>
</svelte:head>

<h1 class="text-2xl">Welcome to the Community Mycelium</h1>

<a class="link" href="/people">People</a>

<div class="row flex-center flex">
	<div class="col-6 form-widget">
		<WelcomeUser />
	</div>
</div>
