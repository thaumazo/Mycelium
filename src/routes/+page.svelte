<!-- src/routes/+page.svelte -->
<script lang="ts">
	import GenericCard from '../lib/components/GenericCard.svelte';
	import WelcomeUser from '../lib/components/WelcomeUser.svelte';

	export let data;
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>
<div class="hero min-h-full">
	<div class="hero-content text-center">
		<GenericCard title="Welcome to your Personal Mycelium">
			<div class="row flex-center flex">
				<div class="col-6 form-widget">
					<WelcomeUser />
				</div>
			</div>
		</GenericCard>
	</div>
</div>
