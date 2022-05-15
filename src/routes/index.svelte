<script>
	import { goto } from '$app/navigation'
	import { currentUserEmail, currentRegistration, entryStore } from '../lib/stores.js'

	function routeToPage(route, replaceState) {
		goto(`/${route}`, { replaceState })
	}

	let fetchingData = false
	let errorMessage = ''

	function handleRegister() {
		$currentUserEmail = null
		routeToPage('register')
	}

	async function getEntry(pageToRouteTo) {
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
		console.log(response)
		if (response.result === 'error') {
			errorMessage = response.data
		} else {
			currentRegistration.set(response.data.registration)
			entryStore.set(response.data.entries)
			routeToPage(pageToRouteTo)
		}
		return response
	}
</script>

<section class="container mx-auto max-w-prose px-3">
	<h4 class="text-xl font-bold text-primary">Registration Information</h4>
	<p class="">
		If you haven't registered yet, please select "Register" and enter the details required. This is
		not a committment, just a pre-registration to assist us in identifying and communicating with
		all artists who may be interested in entering this year's event.
	</p>

	<button
		type="button"
		on:click={() => handleRegister()}
		class="mt-2 inline-block rounded bg-primary-400 px-7 py-3 font-semibold  uppercase text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
		>Register</button
	>

	<h4 class="mt-6 text-xl font-bold text-primary">Already Registered?</h4>
	<p class="">
		If you have already registered please enter your email address below to retrieve the detail of
		your Registration.
	</p>
	<p>
		If the email address below is registered you can proceed to add one or more entries that you'd
		like to submit by using the "Add Entries" button.
	</p>

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
	<button
		type="button"
		disabled={!$currentUserEmail}
		on:click={() => getEntry('entry')}
		class="mt-4 inline-block rounded bg-primary-400 px-7 py-3 font-semibold uppercase  text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg disabled:opacity-25"
		>Add Entries</button
	>

	<button
		type="button"
		disabled={!$currentUserEmail}
		on:click={() => getEntry('view')}
		class="mt-4 inline-block rounded bg-primary-400 px-7 py-3 font-semibold uppercase  text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg disabled:opacity-25"
		>Show My Registration</button
	>

	{#if fetchingData}
		<div
			style="border-top-color:transparent"
			class="m-6 h-16 w-16 animate-spin rounded-full border-8 border-solid border-accent"
		/>
	{/if}
</section>
<!-- <pre>{$currentUserEmail}</pre> -->
