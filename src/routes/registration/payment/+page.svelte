<script>
	/** @type {import('./$types').PageData} */

	import { createEventDispatcher, onMount } from 'svelte'

	import { currentUserEmail, currentRegistration, entryStore, stepsAllowed } from '$lib/stores.js'
	import TextList from '$lib/TextList.svelte'
	import GoBack from '$lib/GoBack.svelte'

	const dispatch = createEventDispatcher()
	import { PUBLIC_SQUARE_APP_ID, PUBLIC_SQUARE_LOCATION_ID } from '$env/static/public'
	const appId = PUBLIC_SQUARE_APP_ID
	const locationId = PUBLIC_SQUARE_LOCATION_ID

	let errorMessage = ''
	let fetchingData = false
	$: costOfRegistration = 20 + $entryStore.length * 20
	$: numberOfEntries = $entryStore.length === 1 ? `1 entry` : `${$entryStore.length} entries`
	let card

	onMount(async () => {
		fetchingData = true

		if (!window.Square) {
			throw new Error('Square.js failed to load properly')
		}
		errorMessage = ''
		const payments = window.Square.payments(appId, locationId)
		console.log('adding payment container')

		// INIT CARD
		try {
			card = await payments.card({
				style: {
					input: {
						backgroundColor: '#f5f7f9'
					},
					'.input-container': {
						borderColor: 'transparent',
						borderRadius: '.25em'
					}
				}
			})
			await card.attach('#card-container')
		} catch (e) {
			// TODO: error handling
			errorMessage = 'Initializing card failed - please try again later'
			console.error(errorMessage)
			return
		}
		fetchingData = false
	})

	async function tokenize(paymentMethod) {
		const tokenResult = await paymentMethod.tokenize()
		if (tokenResult.status === 'OK') {
			return tokenResult.token
		} else {
			let errorMessage = `Tokenization failed with status: ${tokenResult.status}`
			if (tokenResult.errors) {
				errorMessage += ` and errors: ${JSON.stringify(tokenResult.errors)}`
			}
			throw new Error(errorMessage)
		}
	}

	async function handlePaymentMethodSubmission() {
		fetchingData = true
		try {
			errorMessage = 'Sending payment to Card Processor (Square)'
			const token = await tokenize(card)
			const paymentResponse = await fetch(`/api/payment`, {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({
					locationId,
					sourceId: token
				})
			})

			if (paymentResponse.ok) {
				errorMessage = 'Payment completed'
			} else {
				const errorBody = await paymentResponse.text()
				errorMessage = 'Payment failed - try again later'
				throw new Error(errorBody)
			}
		} catch (e) {
			errorMessage = 'Payment failed'
			console.error(e.message)
		}
	}
</script>

<section class="container mx-auto max-w-prose px-3">
	<GoBack stepTitle="Paying for Registration for - {$currentRegistration?.email}" />

	<div class="mt-4 text-base">
		<p class="bold text-xl">Registration number is - {$currentRegistration.registrationId}</p>
		<div class="mt-6 grid grid-cols-[13ch_1fr] items-center">
			<TextList item="First Name" itemValue={$currentRegistration.firstName} />
			<TextList item="Surname" itemValue={$currentRegistration.lastName} />
			<TextList item="Email" itemValue={$currentRegistration.email} />
			<TextList item="Phone" itemValue={$currentRegistration.phone} />
			<TextList item="Postcode" itemValue={$currentRegistration.postcode} />
			<TextList item="Bank Account" itemValue={$currentRegistration.bankAccountName} />
			<TextList item="BSB" itemValue={$currentRegistration.bankBSB} />
			<TextList item="Account" itemValue={$currentRegistration.bankAccount} />
		</div>
		<p class="mt-6 text-xl text-red-500">
			Your registration of {numberOfEntries} has a total fee of ${costOfRegistration}
		</p>
	</div>
	{#if errorMessage}
		<p class="mt-6 text-red-500">{errorMessage}</p>
	{/if}
</section>

<section class="mt-6 max-w-prose px-3">
	<form
		on:submit|preventDefault={() => {
			handlePaymentMethodSubmission(card)
		}}
		id="payment-form"
		method="POST"
	>
		<div id="card-container" class="w-100 mx-auto" />
		<button
			type="submit"
			disabled={fetchingData}
			class="mt-8 inline-block w-auto  rounded-lg bg-red-400 px-7 py-3  font-semibold text-white shadow-md transition duration-150 ease-in-out hover:bg-red-500 hover:shadow-lg focus:bg-red-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-200 active:shadow-lg disabled:cursor-not-allowed"
			>Pay Registration of ${costOfRegistration}</button
		>
	</form>
</section>
