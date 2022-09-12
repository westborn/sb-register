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

	import { onMount } from 'svelte'
	import { createForm } from 'felte'
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	import { currentUserEmail, currentRegistration, entryStore } from '$lib/stores.js'
	import GoBack from '$lib/GoBack.svelte'
	import FormConfirm from '$lib/FormConfirm.svelte'
	let requestType = 'modifyRegistration'
	let fetchingData = false
	let errorMessage = ''

	onMount(() => {
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
			data.bankAccountName === '' ||
			data.bankBSB === '' ||
			data.bankAccount === '' ||
			data.confirmation === ''
		) {
			errorMessage = 'Please fill in all fields'
			return false
		}

		if (data.email != $currentRegistration.email) {
			errorMessage = "Sorry, you can't change the email for a registration"
			return false
		}
		errorMessage = ''
		return true
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
				dispatch('confirmed')
			}
		}
	}

	let resetEntry = () => {
		formReset()
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
	}
</script>

<section class="container mx-auto max-w-prose px-3">
	<GoBack stepTitle="Confirm Details for - {$currentRegistration.email}" />

	<form use:form>
		<input type="hidden" id="id" name="id" />

		<FormConfirm />
	</form>

	{#if errorMessage}
		<p class="mt-6 text-red-500">{errorMessage}</p>
	{/if}
	<button
		on:click={() => modifyRegistration($formData)}
		disabled={fetchingData}
		type="submit"
		class="mt-8 inline-block rounded bg-primary-400 px-7 py-3 font-semibold  uppercase text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
		>Edit Registration</button
	>
	<button
		on:click={() => resetEntry()}
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
<!-- <pre>{JSON.stringify($currentRegistration, null, 2)}</pre> -->
<!-- <pre>{requestType}</pre>  -->
