<script>
	/** @type {import('./$types').PageData} */

	import { createEventDispatcher, onMount } from 'svelte'
	import { goto } from '$app/navigation'

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
	$: costOfRegistrationInCents = parseInt(costOfRegistration * 100)
	$: numberOfEntries = $entryStore.length === 1 ? `1 entry` : `${$entryStore.length} entries`

	let card

	let apiResponse = {
		lastStatus: {
			ok: false,
			status: 0,
			statusText: '',
			response: null
		}
	}
	function handleUnexpectedError(error) {
		let msg =
			'A network error has occurred. Check the apiUrl property to ensure it is set correctly.'
		console.error(error + ' - ' + msg)
		return msg
	}

	function handleError(lastStatus) {
		let msg = ''
		switch (lastStatus.status) {
			case 400:
				msg = JSON.stringify(lastStatus.response)
				break
			case 404:
				if (lastStatus.response) {
					msg = lastStatus.response
				} else {
					msg = `${lastStatus.statusText} - ${lastStatus.url}`
				}
				break
			case 500:
				msg = JSON.parse(lastStatus.response).message
				break
			default:
				msg = JSON.stringify(lastStatus)
				break
		}
		if (msg) {
			console.error(msg)
		}
		return msg
	}

	function processResponse(response) {
		// Copy reponse properties to lastStatus properties
		apiResponse.lastStatus.ok = resp.ok
		apiResponse.lastStatus.status = resp.status
		apiResponse.lastStatus.statusText = resp.statusText
		apiResponse.lastStatus.url = resp.url

		if (apiResponse.lastStatus.ok) {
			return response.json()
		} else {
			return response.text()
		}
	}

	onMount(async () => {
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

	async function handlePaymentSubmission() {
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
					note: `Registration fee for ${$currentRegistration.firstName} ${$currentRegistration.lastName} (${$currentUserEmail}) ID:${$currentRegistration.registrationId} `,
					reference_id: `Registration ${$currentRegistration.registrationId}`
				})
			})
			const data = await processResponse(paymentResponse)
			// Fill lastStatus.response with the data returned
			apiResponse.lastStatus.response = data
			if (apiResponse.lastStatus.ok) {
				errorMessage = 'Payment completed'
				return data
			} else {
				const errorBody = handleError(apiResponse.lastStatus)
				errorMessage = 'Payment failed - try again later'
				throw new Error(errorBody)
			}
		} catch (err) {
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
			<p class="mt-6 text-xl text-red-500">
				Your registration of {numberOfEntries} has a total fee of ${costOfRegistration}
			</p>
		</div>
		{#if errorMessage}
			<p class="mt-6 text-red-500">{errorMessage}</p>
		{/if}

		<div class="mt-6 max-w-prose px-3">
			<form
				on:submit|preventDefault={() => {
					handlePaymentSubmission(card)
				}}
				id="payment-form"
				method="POST"
			>
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
</section>
