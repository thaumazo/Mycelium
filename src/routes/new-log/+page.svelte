<script>
	import { goto } from '$app/navigation';

	let value = '';
	async function handleSubmit() {
		console.log(value);
		let headersList = {
			Accept: '*/*',
			key: 'mycelium',
			'Content-Type': 'application/json'
		};

		let bodyContent = JSON.stringify({
			content: value
		});

		let response = await fetch(
			'https://cloud.activepieces.com/api/v1/webhooks/fbK0dhJmUQ6TvmVsLUZUE',
			{
				method: 'POST',
				body: bodyContent,
				headers: headersList
			}
		);

		let data = await response.text();
		console.log(data);

		goto('/timeline');
	}
</script>

<div class="hero min-h-screen bg-base-200">
	<div class="hero-content text-center w-full h-full">
		<form
			class="flex flex-col h-4/5 w-4/5"
			on:submit={(event) => {
				event.preventDefault();
				handleSubmit();
			}}
		>
			<textarea
				class="textarea textarea-primary m-1 textarea-lg flex-1"
				name="input"
				placeholder="Log your day!"
				bind:value
			></textarea>
			<button class="btn btn-primary m-1" action="submit">Submit</button>
		</form>
	</div>
</div>
