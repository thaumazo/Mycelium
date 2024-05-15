<script
    export let title;
</script>

<div class="hero min-h-screen bg-base-200">
	<div class="hero-content text-center">
		<div class="card w-96 bg-neutral text-neutral-content">
			<div class="card-body items-center text-center">
				<h1 class="text-2xl">{title}</h1>
                <slot />
			</div>
		</div>
	</div>
</div>
