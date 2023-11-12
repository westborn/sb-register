<script>
	import { PUBLIC_REGISTRATIONS_OPEN } from '$env/static/public'
	import { goto } from '$app/navigation'
	import { currentUserEmail, currentRegistration, entryStore, stepsAllowed } from '$lib/stores.js'
	import { validateEmail } from '$lib/Utilities.js'

	let fetchingData = false
	let errorMessage = ''

	async function handleUserAction(userAction) {
		$currentUserEmail = $currentUserEmail.toLowerCase()
		if (!validateEmail($currentUserEmail)) {
			errorMessage = 'Please enter a valid email address'
			return
		}
		fetchingData = true
		errorMessage = ''
		const res = await fetch(`/api/sheets`, {
			method: 'POST',
			body: JSON.stringify({
				action: 'getDetailsByEmail',
				data: {
					email: $currentUserEmail
				}
			})
		})
		const response = await res.json()
		$stepsAllowed = true
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
			if ($currentRegistration.confirmation === 'Complete') {
				goto('/view')
				return
			}
			goto('/registration')
			return
		}
		errorMessage = 'How did you get here?'
		return
	}

	let btnClasses =
		'text-sm rounded-md bg-primary-300 px-5 py-1 font-semibold text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-400 hover:shadow-lg focus:bg-primary-400 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg'
</script>

{#if PUBLIC_REGISTRATIONS_OPEN === 'YES'}
	<div class="container mx-auto max-w-prose px-3">
		<h4 class="text-xl font-bold text-primary">Registration Process</h4>
	</div>

	<!-- content here -->

	<section class="container mx-auto max-w-prose px-3">
		<p class="mt-3">
			Hi Artists<br /><br />

			The process of registration for the 2024 exhibition (March 9th - 17th) has changed a little
			from last year. We trust these changes make the process a little easier for you.<br /><br />
			There is a 4 step process comprising:<br />
		</p>
		<ul class="list-outside list-disc px-4">
			<li>Register - your name, email and postcode to let us know you may be exhibiting</li>
			<li>
				Add entries - details of each entry you'd like to submit. You can add as many as you like
				and you can edit/delete them too.
			</li>
			<li>Confirm some additional information - bank details, assistance required etc</li>
			<li>
				Complete your registration - after you've added all of your entries and are ready to pay the
				registration fee.
			</li>
		</ul>
	</section>
	<section class="container mx-auto max-w-prose px-3">
		<div class="relative mt-10 w-full">
			<input
				id="email"
				name="email"
				bind:value={$currentUserEmail}
				type="text"
				class="peer h-10 w-full rounded-md border-gray-300 placeholder-transparent focus:border-primary-50 focus:outline-none lowercase"
				placeholder="someone@gmail.com"
			/>
			<label
				for="email"
				class="absolute left-2 -top-5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600"
				>Email address</label
			>
		</div>

		{#if errorMessage}
			<p class="mt-6 text-red-500">{errorMessage}</p>
		{:else}
			<p class="mt-6">&nbsp</p>
		{/if}
		<div class="mt-6 flex justify-between">
			<button type="button" on:click={() => handleUserAction('new')} class={btnClasses}
				>New Registration
			</button>

			<button type="button" on:click={() => handleUserAction('view')} class={btnClasses}
				>View Registration
			</button>

			<button type="button" on:click={() => handleUserAction('registration')} class={btnClasses}
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
{:else}
	<div class="container mx-auto max-w-prose px-3">
		<h4 class="text-xl font-bold text-primary">
			Registrations for the 2024 event<br />
			are not open until 14th November 2023
		</h4>
	</div>
{/if}

<!-- else if content here -->
<!-- <pre>{JSON.stringify($currentRegistration, null, 2)}</pre> -->
