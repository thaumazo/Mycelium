<!-- src/routes/+page.svelte -->
<script lang="ts">
	import WelcomeUser from '../lib/components/WelcomeUser.svelte';

	export let data;
</script>

<svelte:head>
		<title>Home</title>
</svelte:head>

<h1 class="text-2xl">Welcome to the Community Mycelium</h1>

<a class="link" href="/people">People</a>

<div class="row flex-center flex">
	<div class="col-6 form-widget">
		<WelcomeUser />
	</div>
</div>
