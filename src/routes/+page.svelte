<!-- src/routes/+page.svelte -->
<script lang="ts">
	import GenericCard from '../lib/components/GenericCard.svelte';
import WelcomeUser from '../lib/components/WelcomeUser.svelte';

	export let data;
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>
<GenericCard title='Welcome to the Community Mycelium'>
	<div class="row flex-center flex">
		<div class="col-6 form-widget">
			<WelcomeUser />
		</div>
	</div>
</GenericCard>

<GenericCard title='People'>
	<a class="link" href="/people">People</a>

	<div class="row flex-center flex">
		<div class="col-6 form-widget">
			<WelcomeUser />
		</div>
	</div>
</GenericCard>


