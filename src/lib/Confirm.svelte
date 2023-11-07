<script>
	// accommodation
	// bankAccount
	// bankAccountName
	// bankBSB
	// bumpIn
	// bumpOut
	// confirmation
	// crane
	// displayRequirements
	// email
	// firstName
	// lastName
	// phone
	// postcode
	// registrationId
	// timestamp
	// transport

	import { onMount } from 'svelte'
	import { createForm } from 'felte'
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	import { ACTION } from '$lib/CONSTANTS.js'
	import { currentUserEmail, currentRegistration, entryStore, stepsAllowed } from '$lib/stores.js'
	import GoBack from '$lib/GoBack.svelte'
	import ConfirmForm from '$lib/ConfirmForm.svelte'
	let actionType = ACTION.EDITING_REGISTRATION
	let fetchingData = false
	let errorMessage = ''

	$: costOfRegistration = 20 + $entryStore.length * 20
	$: numberOfEntries = $entryStore.length === 1 ? '1 entry' : `${$entryStore.length} entries`

	onMount(() => {
		setFields({
			accommodation: $currentRegistration.accommodation || 'No',
			bankAccount: $currentRegistration.bankAccount,
			bankAccountName: $currentRegistration.bankAccountName,
			bankBSB: $currentRegistration.bankBSB,
			bumpIn: $currentRegistration.bumpIn,
			bumpOut: $currentRegistration.bumpOut,
			crane: $currentRegistration.crane || 'No',
			displayRequirements: $currentRegistration.displayRequirements,
			email: $currentUserEmail,
			firstName: $currentRegistration.firstName,
			firstNations: $currentRegistration.firstNations,
			lastName: $currentRegistration.lastName,
			phone: $currentRegistration.phone,
			postcode: $currentRegistration.postcode,
			registrationId: $currentRegistration.registrationId,
			transport: $currentRegistration.transport || 'No'
		})
		$stepsAllowed = true
	})

	//get all the functions and data from felte form
	const {
		form,
		data: formData,
		reset: formReset,
		setFields
	} = createForm({
		onSubmit: (values, context) => {
			// console.log(`submit - id:${values.id} - actionType: ${actionType}`)
			// console.log(JSON.stringify(values, null, 2))
			// console.log(JSON.stringify(context, null, 2))
		}
	})

	let sendToServer = async (data) => {
		fetchingData = true
		errorMessage = ''
		// console.log('sending ', actionType)
		// console.log(data)
		const res = await fetch(`/api/sheets`, {
			method: 'POST',
			body: JSON.stringify({ action: actionType, data })
		})
		const resMessage = await res.json()
		fetchingData = false
		// console.log('receiving	', actionType)
		// console.log(resMessage)
		if (resMessage.result === 'error') {
			errorMessage = resMessage.data
		}
		return resMessage
	}

	let registrationIsValid = (data) => {
		if (data.bankAccountName === '' || data.bankBSB === '' || data.bankAccount === '') {
			errorMessage = 'Please fill in all fields'
			return false
		}

		errorMessage = ''
		return true
	}

	let modifyRegistration = async (data) => {
		if (registrationIsValid(data)) {
			fetchingData = true
			errorMessage = ''
			actionType = ACTION.EDITING_REGISTRATION
			const response = await sendToServer(data)
			fetchingData = false
			if (response.result === 'error') {
				errorMessage = response.data
			} else {
				currentRegistration.set(response.data.registration)
				entryStore.set(response.data.entries)
				$stepsAllowed = true
				dispatch('confirmed')
			}
		}
	}

	function cancelConfirm() {
		setFields({
			accommodation: $currentRegistration.accommodation || 'No',
			bankAccount: $currentRegistration.bankAccount,
			bankAccountName: $currentRegistration.bankAccountName,
			bankBSB: $currentRegistration.bankBSB,
			bumpIn: $currentRegistration.bumpIn,
			bumpOut: $currentRegistration.bumpOut,
			crane: $currentRegistration.crane || 'No',
			displayRequirements: $currentRegistration.displayRequirements,
			email: $currentUserEmail,
			firstName: $currentRegistration.firstName,
			firstNations: $currentRegistration.firstNations,
			lastName: $currentRegistration.lastName,
			phone: $currentRegistration.phone,
			postcode: $currentRegistration.postcode,
			registrationId: $currentRegistration.registrationId,
			transport: $currentRegistration.transport || 'No'
		})
		$stepsAllowed = true
		dispatch('cancel')
	}
</script>

<section class="container mx-auto max-w-prose px-3">
	<GoBack stepTitle="Details for - {$currentRegistration.email}" />
	<p class="mt-2 text-base text-primary-400">
		Your registration of {numberOfEntries} has a total fee of ${costOfRegistration}
	</p>
	<form use:form>
		<ConfirmForm />
	</form>

	{#if errorMessage}
		<p class="mt-6 text-red-500">{errorMessage}</p>
	{/if}
	{#if !fetchingData}
		<button
			on:click={() => modifyRegistration($formData)}
			disabled={fetchingData}
			type="submit"
			class="mt-8 inline-block rounded-lg bg-primary-400 px-7 py-3 font-semibold text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
			>Save changes I've made</button
		>
		<button
			on:click={() => cancelConfirm()}
			type="submit"
			class="mt-8 inline-block rounded-lg bg-primary-400 px-7 py-3 font-semibold text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
			>Cancel</button
		>
	{:else}
		<div
			style="border-top-color:transparent"
			class="m-6 h-16 w-16 animate-spin rounded-full border-8 border-solid border-accent"
		/>
	{/if}
</section>
<!-- <pre>{JSON.stringify($currentRegistration, null, 2)}</pre> -->
<!-- <pre>{requestType}</pre>  -->
