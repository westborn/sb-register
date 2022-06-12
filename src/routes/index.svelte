<script>
	import { goto } from '$app/navigation'
	import { currentUserEmail, currentRegistration, entryStore } from '$lib/stores.js'

	let fetchingData = false
	let errorMessage = ''

	async function handelUserAction(userAction) {
		fetchingData = true
		errorMessage = ''
		const res = await fetch('/api?requestType=getEntry', {
			method: 'POST',
			body: JSON.stringify({
				email: $currentUserEmail
			})
		})
		const response = await res.json()
		fetchingData = false
		console.log('response', response)
		if (response.result === 'error') {
			errorMessage = response.data
			return
		}

		console.log(userAction, response.data.registration, response.data)
		if (userAction === 'new') {
			if (Object.entries(response.data.registration).length != 0) {
				errorMessage = 'An entry already exists for that email address'
				return
			}
			// TODO set up multistep new registration form
			currentRegistration.set(response.data.registration)
			entryStore.set(response.data.entries)
			goto('/registration')
			return
		} else if (userAction === 'view') {
			if (Object.entries(response.data.registration).length === 0) {
				errorMessage = 'No registration found for that email address'
				return
			}
			currentRegistration.set(response.data.registration)
			entryStore.set(response.data.entries)
			goto('/view')
			return
		} else if (userAction === 'registration') {
			if (Object.entries(response.data.registration).length === 0) {
				errorMessage = 'No registration found for that email address'
				return
			}
			// TODO existing registration
			currentRegistration.set(response.data.registration)
			entryStore.set(response.data.entries)
			goto('/registration')
			return
		}
		errorMessage = 'How did you get here?'
		return
	}

	let btnClasses =
		'text-sm rounded-md bg-primary-300 px-5 py-1 font-semibold text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-400 hover:shadow-lg focus:bg-primary-400 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg'
</script>

<section class="container mx-auto max-w-prose px-3">
	<h4 class="text-xl font-bold text-primary">Registration Process</h4>

	<div class="relative mt-6 w-full">
		<input
			id="email"
			name="email"
			bind:value={$currentUserEmail}
			type="text"
			class="peer h-10 w-full rounded-md border-gray-300 placeholder-transparent focus:border-primary-50 focus:outline-none"
			placeholder="someone@gmail.com"
		/>
		<label
			for="email"
			class="absolute left-2 -top-5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600"
			>Email address</label
		>
	</div>

	{#if errorMessage}
		<p class="m-2 text-red-500">{errorMessage}</p>
	{/if}
	<div class="mt-6 flex justify-between">
		<button type="button" on:click={() => handelUserAction('new')} class={btnClasses}
			>New Registration
		</button>

		<button type="button" on:click={() => handelUserAction('view')} class={btnClasses}
			>View Registration
		</button>

		<button type="button" on:click={() => handelUserAction('registration')} class={btnClasses}
			>Continue Registering</button
		>
	</div>

	{#if fetchingData}
		<div
			style="border-top-color:transparent"
			class="m-6 h-16 w-16 animate-spin rounded-full border-8 border-solid border-accent"
		/>
	{/if}
</section>
<pre>{$currentUserEmail}</pre>
