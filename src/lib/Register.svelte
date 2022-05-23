<script>
	// firstName
	// lastName
	// email
	// phone
	// postcode
	// bumpIn
	// bumpOut
	// crane
	// displayRequirements
	// bankAccountName
	// bankBSB
	// bankAccount
	// transport
	// accommodation
	// confirmation
	import { goto } from '$app/navigation'
	function routeToPage(route, replaceState) {
		goto(`/${route}`, { replaceState })
	}

	import { onMount } from 'svelte'
	import { createForm } from 'felte'
	import { v4 as uuidv4 } from 'uuid'
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	import { currentUserEmail, currentRegistration, entryStore } from '$lib/stores.js'
	import FormRegister from '$lib/FormRegister.svelte'

	let requestType = 'createRegistration'

	let fetchingData = false
	let errorMessage = ''

	onMount(() => {
		if (Object.entries($currentRegistration).length == 0) {
			requestType = 'createRegistration'
		} else {
			setFields({
				id: $currentRegistration.id,
				firstName: $currentRegistration.firstName,
				lastName: $currentRegistration.lastName,
				email: $currentRegistration.email,
				phone: $currentRegistration.phone,
				postcode: $currentRegistration.postcode,
				bumpIn: $currentRegistration.bumpIn,
				bumpOut: $currentRegistration.bumpOut,
				crane: $currentRegistration.crane,
				displayRequirements: $currentRegistration.displayRequirements,
				bankAccountName: $currentRegistration.bankAccountName,
				bankBSB: $currentRegistration.bankBSB,
				bankAccount: $currentRegistration.bankAccount,
				transport: $currentRegistration.transport,
				accommodation: $currentRegistration.accommodation,
				confirmation: $currentRegistration.confirmation
			})
			requestType = 'modifyRegistration'
		}
	})

	//get all the functions and data from felte form
	const {
		form,
		data: formData,
		reset: formReset,
		setFields
	} = createForm({
		onSubmit: (values, context) => {
			console.log(`submit - id:${values.id} - requestType: ${requestType}`)
			// console.log(JSON.stringify(values, null, 2))
			// console.log(JSON.stringify(context, null, 2))
		}
	})

	let sendToServer = async (data) => {
		fetchingData = true
		errorMessage = ''
		console.log('sending ', requestType)
		console.log(data)
		const res = await fetch(`/api?requestType=${requestType}`, {
			method: 'POST',
			body: JSON.stringify({ data })
		})
		const resMessage = await res.json()
		fetchingData = false
		console.log('receiving	', requestType)
		console.log(resMessage)
		if (resMessage.result === 'error') {
			errorMessage = resMessage.data
		}
		return resMessage
	}

	let registrationIsValid = (data) => {
		if (
			data.email === '' ||
			data.firstName === '' ||
			data.lastName === '' ||
			data.phone === '' ||
			data.bankAccountName === '' ||
			data.bankBSB === '' ||
			data.bankAccount === '' ||
			data.confirmation === ''
		) {
			errorMessage = 'Please fill in all fields'
			return false
		}

		if (requestType === 'modifyRegistration') {
			if (data.email != $currentRegistration.email) {
				errorMessage = "Sorry, you can't change the email for a registration"
				return false
			}
		}
		errorMessage = ''
		return true
	}

	let addRegistration = async (data) => {
		if (registrationIsValid(data)) {
			requestType = 'createRegistration'
			fetchingData = true
			errorMessage = ''
			const newRegistration = { ...data, id: uuidv4() }
			const response = await sendToServer(newRegistration)
			fetchingData = false
			if (response.result === 'error') {
				errorMessage = response.data
			} else {
				currentRegistration.set(response.data.registration)
				entryStore.set(response.data.entries)
				dispatch('registered')
			}
		}
	}

	let modifyRegistration = async (data) => {
		if (registrationIsValid(data)) {
			fetchingData = true
			errorMessage = ''
			requestType = 'modifyRegistration'
			const response = await sendToServer(data)
			fetchingData = false
			if (response.result === 'error') {
				errorMessage = response.data
			} else {
				currentRegistration.set(response.data.registration)
				entryStore.set(response.data.entries)
				dispatch('registered')
			}
		}
	}
</script>

<section class="container mx-auto max-w-prose px-3">
	<div class="flex items-center justify-between">
		<h4 class="text-xl font-bold text-primary">Registration for Exhibitor</h4>
		<button
			type="button"
			on:click={() => routeToPage('')}
			class="rounded-md bg-primary-300 px-5 py-1 text-sm font-semibold text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-400 hover:shadow-lg focus:bg-primary-400 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
			>Back
		</button>
	</div>

	<form use:form>
		<input type="hidden" id="id" name="id" />

		<FormRegister />
	</form>

	{#if errorMessage}
		<p class="mt-6 text-red-500">{errorMessage}</p>
	{/if}

	{#if requestType === 'createRegistration'}
		<button
			on:click={() => addRegistration($formData)}
			disabled={fetchingData}
			type="submit"
			class="mt-8 inline-block rounded bg-primary-400 px-7 py-3 font-semibold  uppercase text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
			>Register</button
		>
	{:else}
		<button
			on:click={() => modifyRegistration($formData)}
			disabled={fetchingData}
			type="submit"
			class="mt-8 inline-block rounded bg-primary-400 px-7 py-3 font-semibold  uppercase text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
			>Edit Registration</button
		>
	{/if}

	<button
		on:click={() => dispatch('cancel')}
		type="submit"
		class="mt-8 inline-block rounded bg-primary-400 px-7 py-3 font-semibold  uppercase text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
		>Cancel</button
	>
	{#if fetchingData}
		<div
			style="border-top-color:transparent"
			class="m-6 h-16 w-16 animate-spin rounded-full border-8 border-solid border-accent"
		/>
	{/if}
</section>
<pre>{JSON.stringify($currentRegistration, null, 2)}</pre>
<pre>{requestType}</pre>
