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

	import { currentUserEmail, currentRegistration, entryStore, stepsAllowed } from '$lib/stores.js'
	import GoBack from '$lib/GoBack.svelte'

	import RegisterForm from '$lib/RegisterForm.svelte'
	import TextList from '$lib/TextList.svelte'

	let actionRequest = 'createRegistration'

	let fetchingData = false
	let errorMessage = ''

	onMount(() => {
		if (Object.entries($currentRegistration).length == 0) {
			actionRequest = 'createRegistration'
			setFields({
				registrationId: 'NotSet',
				firstName: '',
				lastName: '',
				email: $currentUserEmail,
				phone: '',
				postcode: '',
				firstNations: 'No',
				bumpIn: '',
				bumpOut: '',
				crane: '',
				displayRequirements: '',
				bankAccountName: '',
				bankBSB: '',
				bankAccount: '',
				transport: '',
				accommodation: '',
				confirmation: ''
			})
			$stepsAllowed = false
		} else {
			actionRequest = 'showRegistration'
			$stepsAllowed = true
		}
	})

	//get all the functions and data from felte form
	const {
		form,
		data: formData,
		reset: formReset,
		setFields
	} = createForm({
		// define an onSubmit function to disable default action
		onSubmit: (values, context) => {}
	})

	let sendToServer = async (data) => {
		fetchingData = true
		errorMessage = ''
		console.log('sending ', actionRequest)
		console.log(data)
		const res = await fetch(`/api`, {
			method: 'POST',
			body: JSON.stringify({ action: actionRequest, data })
		})
		const resMessage = await res.json()
		fetchingData = false
		console.log('receiving	', actionRequest)
		console.log(resMessage)
		if (resMessage.result === 'error') {
			errorMessage = resMessage.data
		}
		return resMessage
	}

	let registrationIsValid = (data) => {
		if (data.email === '' || data.firstName === '' || data.lastName === '' || data.phone === '') {
			errorMessage = 'Please fill in all required fields'
			return false
		}

		errorMessage = ''
		return true
	}

	let addRegistration = async (data) => {
		if (registrationIsValid(data)) {
			actionRequest = 'createRegistration'
			fetchingData = true
			errorMessage = ''
			const newRegistration = { ...data }
			const response = await sendToServer(newRegistration)
			fetchingData = false
			if (response.result === 'error') {
				errorMessage = response.data
			} else {
				currentRegistration.set(response.data.registration)
				entryStore.set(response.data.entries)
				$stepsAllowed = true

				dispatch('registered')
			}
		}
	}
</script>

<section class="container mx-auto max-w-prose px-3">
	<GoBack stepTitle="Registration for - {$currentUserEmail}" />
	{#if actionRequest === 'showRegistration'}
		<div class="mt-6 grid grid-cols-[13ch_1fr] items-center">
			<TextList item="First Name" itemValue={$currentRegistration.firstName} />
			<TextList item="Surname" itemValue={$currentRegistration.lastName} />
			<TextList item="Phone" itemValue={$currentRegistration.phone} />
			<TextList item="Postcode" itemValue={$currentRegistration.postcode} />
		</div>
	{:else}
		<form use:form>
			<RegisterForm />
		</form>

		<button
			on:click={() => addRegistration($formData)}
			disabled={fetchingData}
			type="submit"
			class="mt-8 inline-block rounded bg-primary-400 px-7 py-3 font-semibold  uppercase text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
			>Register</button
		>

		<button
			on:click={() => dispatch('cancel')}
			type="submit"
			class="mt-8 inline-block rounded bg-primary-400 px-7 py-3 font-semibold  uppercase text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
			>Cancel</button
		>
	{/if}
	{#if fetchingData}
		<div
			style="border-top-color:transparent"
			class="m-6 h-16 w-16 animate-spin rounded-full border-8 border-solid border-accent"
		/>
	{/if}
	{#if errorMessage}
		<p class="mt-6 text-red-500">{errorMessage}</p>
	{/if}
</section>
<!-- <pre>{JSON.stringify($currentRegistration, null, 2)}</pre> -->
<!-- <pre>{actionRequest}</pre> -->
<!-- <pre>{JSON.stringify($formData, null, 2)}</pre> -->
