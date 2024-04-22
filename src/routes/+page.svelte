<!-- src/routes/+page.svelte -->
<script lang="ts">
	import WelcomeUser from '../lib/components/WelcomeUser.svelte';

	export let data;
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>
<div class="hero min-h-screen bg-base-200">
	<div class="hero-content text-center">
		<div class="card w-96 bg-neutral text-neutral-content">
			<div class="card-body items-center text-center">
				<h1 class="text-2xl">Welcome to the Community Mycelium</h1>

				<a class="link" href="/people">People</a>

				<div class="row flex-center flex">
					<div class="col-6 form-widget">
						<WelcomeUser />
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
