<script>
	import { goto } from '$app/navigation'
	import { currentUserEmail, errorStatus, errorMessage } from '../lib/stores.js'

	function routeToPage(route, replaceState) {
		goto(`/${route}`, { replaceState })
	}
	import FormRegister from '../lib/FormRegister.svelte'

	async function fetchData() {
		$errorStatus = null
		const response = await fetch('/api?requestType=getentry', {
			method: 'POST',
			body: JSON.stringify({
				email: $currentUserEmail
			})
		})
		const data = await response.json()
		if (data.result === 'error') {
			$errorStatus = 'register'
			$errorMessage = data.error
			routeToPage('')
		} else {
			$errorStatus = null
		}
		return data
	}
</script>

<section class="container mx-auto max-w-prose px-3">
	<h4 class="mt-6 text-xl font-bold text-primary">Registration for Exhibitor</h4>
	{#if $currentUserEmail}
		{#await fetchData()}
			<!-- spinner/loader -->
			<div
				style="border-top-color:transparent"
				class="w-16 h-16 m-6 border-8 border-accent border-solid rounded-full animate-spin"
			/>
		{:then body}
			<pre>{JSON.stringify(body, null, 2)}</pre>
			<!-- display the curent use details -->
			<div class="p-2">
				<p class="text-lg mt-4">
					{body.data.firstName}
					{body.data.lastName} ({body.data.email})
				</p>
				<p class="text-lg">{body.data.phone} - {body.data.postcode}</p>
			</div>
		{:catch error}
			<p>An error occurred!</p>
			<pre> {error}</pre>
		{/await}
		<!-- TODO - add a button to delete the entry -->
		<!-- TODO - get entries and display as a list -->
	{:else}
		<FormRegister />
	{/if}
</section>
