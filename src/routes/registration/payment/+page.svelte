<script>
	/** @type {import('./$types').PageData} */

	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'

	import { currentUserEmail, currentRegistration, entryStore } from '$lib/stores.js'
	import {
		handleError,
		handleUnexpectedError,
		processResponse,
		apiResponse
	} from '$lib/Utilities.js'
	apiResponse.lastStatus = {}

	import TextList from '$lib/TextList.svelte'
	import GoBack from '$lib/GoBack.svelte'

	import { PUBLIC_SQUARE_APP_ID, PUBLIC_SQUARE_LOCATION_ID } from '$env/static/public'
	const appId = PUBLIC_SQUARE_APP_ID
	const locationId = PUBLIC_SQUARE_LOCATION_ID

	const validStates = {
		COMMENCING: 'COMMENCE',
		PAYING: 'PAY',
		COMPLETING: 'COMPLETE',
		FINISHED: 'FINISH',
		PAYMENTERROR: 'PAYMENTERROR'
	}

	let currentState = validStates.COMMENCING
	$: currentStateNow = currentState
	let errorMessage = ''
	let fetchingData = false
	$: costOfRegistration = 20 + $entryStore.length * 20
	$: costOfRegistrationInCents = parseInt(costOfRegistration * 100)
	$: numberOfEntries = $entryStore.length === 1 ? `1 entry` : `${$entryStore.length} entries`
	$: registrationPaid = $currentRegistration?.confirmation === 'Complete' ? ' (Paid)' : ''

	let card

	onMount(async () => {
		if ($currentRegistration) {
			fetchingData = true

			const originalStyle = {
				input: {
					backgroundColor: '#f5f7f9'
				},
				'.input-container': {
					borderColor: 'transparent',
					borderRadius: '.25em'
				}
			}

			if (!window.Square) {
				throw new Error('Square.js failed to load properly')
			}
			errorMessage = ''
			const payments = window.Square.payments(appId, locationId)
			// console.log('adding payment container')

			// INIT CARD
			try {
				card = await payments.card({
					style: originalStyle
				})
				await card.attach('#card-container')
			} catch (e) {
				// TODO: error handling
				errorMessage = 'Initializing card failed - please try again later'
				console.error(errorMessage)
				return
			}
			fetchingData = false
		}
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

	let sendCompleteToServer = async (data) => {
		errorMessage = ''
		// console.log('sending ', actionType)
		// console.log(data)
		const res = await fetch(`/api/sheets`, {
			method: 'POST',
			body: JSON.stringify({ action: 'completeRegistration', data })
		})
		return await res.json()
	}

	async function readyToPay() {
		// console.log('readyToPay: here')

		//try to make the CC  payment
		await handlePaymentSubmission()
		//if not OK - show any errors and allow retry?
		if (!apiResponse.lastStatus.ok) return

		//did the payment complete OK
		const paymentCompleted = apiResponse?.lastStatus?.response?.payment?.status === 'COMPLETED'
		if (!paymentCompleted) return
		errorMessage = 'Payment completed'
		completeRegistration(apiResponse.lastStatus.response)
		return
	}

	async function completeRegistration(squarePaymentResponse) {
		// console.log('completeRegistration: here')
		// console.log(squarePaymentResponse.payment.receiptUrl)
		fetchingData = true
		errorMessage = ''
		const response = await sendCompleteToServer({
			registrationId: $currentRegistration.registrationId,
			email: $currentRegistration.email
		})
		// console.log('completeRegistration' + response)
		if (response.result === 'error') {
			errorMessage = response.data
			handleUnexpectedError(errorMessage)
		} else {
			fetchingData = false
			currentRegistration.set(response.data.registration)
			entryStore.set(response.data.entries)
			currentState = validStates.COMPLETING
		}
		return
	}

	async function finishRegistration() {
		// console.log('finishRegistration: here')
		fetchingData = false
		currentState = validStates.FINISHED
		goto('/view')
	}

	async function handlePaymentSubmission() {
		// console.log('handlePaymentSubmission: here')
		fetchingData = true
		errorMessage = 'Sending payment to Card Processor (Square)'
		let token
		try {
			token = await tokenize(card)
		} catch (e) {
			errorMessage = 'Card details not correct - try again'
			console.error(e.message)
			fetchingData = false
			return
		}
		apiResponse.lastStatus = {}
		currentState = validStates.PAYING
		try {
			const paymentResponse = await fetch(`/api/payment`, {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({
					locationId,
					sourceId: token,
					amount: costOfRegistrationInCents,
					email: $currentRegistration.email,
					note: `Registration - ${$currentRegistration.firstName} ${$currentRegistration.lastName} (${$currentUserEmail}) - ID:${$currentRegistration.registrationId} `,
					reference_id: `Registration ${$currentRegistration.registrationId}`
				})
			})
			const data = await processResponse(paymentResponse)
			// console.log(`handlePaymentSubmission-data: ${JSON.stringify(data, null, 4)}`)
			apiResponse.lastStatus.response = data
			if (!apiResponse.lastStatus.ok) {
				errorMessage = `Payment Failed, try again later - ${
					handleError(apiResponse.lastStatus).detail
				}`
				currentState = validStates.PAYMENTERROR
				return
			}
			// Payment response was ok so move on to completing
			currentState = validStates.COMPLETING
			return
		} catch (err) {
			// console.log('handlePaymentSubmission-err' + err)
			currentState = validStates.PAYMENTERROR
			errorMessage = 'Payment failed'
			handleUnexpectedError(err)
			throw new Error(err)
		}
	}

	// 	{
	//   payment: {
	//     id: 'rzrywF0mJGLH6FVv0rGe6ghfDHWZY',
	//     createdAt: '2023-11-06T03:46:32.187Z',
	//     updatedAt: '2023-11-06T03:46:32.391Z',
	//     amountMoney: { amount: 100n, currency: 'AUD' },
	//     totalMoney: { amount: 100n, currency: 'AUD' },
	//     approvedMoney: { amount: 100n, currency: 'AUD' },
	//     status: 'COMPLETED',
	//     delayDuration: 'PT168H',
	//     delayAction: 'CANCEL',
	//     delayedUntil: '2023-11-13T03:46:32.187Z',
	//     sourceType: 'CARD',
	//     cardDetails: {
	//       status: 'CAPTURED',
	//       card: [Object],
	//       entryMethod: 'KEYED',
	//       cvvStatus: 'CVV_ACCEPTED',
	//       avsStatus: 'AVS_REJECTED',
	//       statementDescription: 'SQ *TEST HEAD OFFICE',
	//       cardPaymentTimeline: [Object]
	//     },
	//     locationId: 'LWSA7ZHB2BHV3',
	//     orderId: '2BgfV606aYvXlqc2KyEdXhgcCg4F',
	//     receiptNumber: 'rzry',
	//     receiptUrl: 'https://squareupsandbox.com/receipt/preview/rzrywF0mJGLH6FVv0rGe6ghfDHWZY',
	//     applicationDetails: {
	//       squareProduct: 'ECOMMERCE_API',
	//       applicationId: 'sandbox-sq0idb-cgiuJtJuEtUWTsU1f8j-eA'
	//     },
	//     versionToken: '9oVj8WymLtKNjFrVyRducOkPvOW98wIlUrOQCdZTUZX6o'
	//   }
	// }

	$: apiThings = apiResponse //debugging
</script>

<section class="container mx-auto max-w-prose px-3">
	{#if !$currentRegistration}
		<h1 class="mb-6 text-xl font-bold">Please register first</h1>
		<button
			type="button"
			on:click={() => goto('/')}
			class="rounded-md bg-primary-300 px-5 py-1 text-sm font-semibold text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-400 hover:shadow-lg focus:bg-primary-400 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
			>Back
		</button>
	{:else}
		<GoBack stepTitle="Registration Payment - {$currentRegistration?.registrationId}" />
		<div class="mt-4 text-base">
			<div class="mt-6 grid grid-cols-[13ch_1fr] items-center">
				<TextList item="First Name" itemValue={$currentRegistration?.firstName} />
				<TextList item="Surname" itemValue={$currentRegistration?.lastName} />
				<TextList item="Email" itemValue={$currentRegistration?.email} />
			</div>
			<p class="mt-6 text-xl text-red-400">
				Your registration of {numberOfEntries} has a total fee of ${costOfRegistration}{registrationPaid}
			</p>
		</div>
		{#if errorMessage}
			<p class="mt-6 text-red-500">{errorMessage}</p>
		{:else}
			<p class="mt-6">&nbsp</p>
		{/if}

		{#if currentState === validStates.COMMENCING || currentState === validStates.PAYMENTERROR}
			<div class="mt-6 max-w-prose px-3">
				<form
					on:submit|preventDefault={() => {
						readyToPay()
					}}
					id="payment-form"
					method="POST"
				>
					<!-- this is the container that gets the Credit Card fields dropped into it by Square -->
					<div id="card-container" class="w-100 mx-auto" />
					<button
						type="submit"
						disabled={fetchingData}
						class="mt-8 inline-block w-auto rounded-lg bg-red-400 px-7 py-3 font-semibold text-white shadow-md transition duration-150 ease-in-out hover:bg-red-500 hover:shadow-lg focus:bg-red-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-200 active:shadow-lg disabled:cursor-not-allowed"
						>Pay Registration of ${costOfRegistration}</button
					>
				</form>
			</div>
		{/if}

		{#if currentState === validStates.COMPLETING}
			<div class="flex flex-col items-center justify-center">
				<a
					href={apiResponse?.lastStatus?.response?.payment?.receiptUrl}
					class="text-blue-600 underline hover:underline hover:text-blue-700"
					target="_blank"
					rel="noopener noreferrer">Click here for your receipt</a
				>
				<button
					on:click={() => finishRegistration()}
					disabled={fetchingData}
					class="mt-2 inline-block rounded-lg bg-primary-400 px-7 py-2 font-semibold text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
					>Registration is now Complete</button
				>
			</div>
		{/if}
	{/if}
</section>
<!--
<pre class="whitespace-pre-wrap">
	{apiResponse?.lastStatus?.response?.payment?.receiptUrl}<br />
	{currentStateNow}<br />
	{JSON.stringify(apiThings, null, 4)}
</pre> -->
