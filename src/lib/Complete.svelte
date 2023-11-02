<script>
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()
	import { goto } from '$app/navigation'

	import { currentUserEmail, currentRegistration, entryStore, stepsAllowed } from '$lib/stores.js'
	import GoBack from '$lib/GoBack.svelte'
	import TextList from '$lib/TextList.svelte'

	// actionType can be:
	//	commenceCompletion
	//	enteringCardDetails
	//	makePayment
	//	completeRegistration

	let form
	let data

	let actionType = 'commenceCompletion'
	let fetchingData = false
	let errorMessage = ''
	$: costOfRegistration = 20 + $entryStore.length * 20
	$: numberOfEntries = $entryStore.length === 1 ? `1 entry` : `${$entryStore.length} entries`
	let href = `mailto:accounts@sculpturebermagui.org.au?subject=Request for Payment - Registration ${$currentRegistration.registrationId} ${$currentRegistration.lastName}`

	let setupSquare = async (data) => {
		fetchingData = true
		errorMessage = ''
		// console.log('sending ', actionType)
		// console.log(data)
		const res = await fetch(`/api/squareClient`, {
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

	let sendToServer = async (data) => {
		fetchingData = true
		errorMessage = ''
		// console.log('sending ', actionType)
		// console.log(data)
		const res = await fetch(`/api`, {
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

	// TODO
	// change complete to include
	// get a payment auth from square
	// display modal with the payment auth
	// get CC details
	// commit payment
	// if any errors // abort the complete action
	// continue with normal complete
	//

	let enteringCardDetails = async (data) => {
		console.log('here doing enteringCardDetails')
		fetchingData = true
		//setup square client
		//setup fields to accept CC
		const response = await setupSquare(data)
		fetchingData = false
		if (response.result === 'error') {
			errorMessage = response.data
		} else {
			console.log('enteringCardDetails response ', response)
			$stepsAllowed = true
		}
		fetchingData = false
		errorMessage = ''
		actionType = 'enteringCardDetails'
	}
	let makePayment = async (data) => {
		console.log('here doing makePayment after cc is entered')
		fetchingData = true
		//send payment request
		fetchingData = false
		errorMessage = ''
		actionType = 'makePayment'
	}

	let completeRegistration = async (data) => {
		console.log('here doing completeRegistration')
		fetchingData = true
		errorMessage = ''
		actionType = 'completeRegistration'
		const response = await sendToServer(data)
		fetchingData = false
		if (response.result === 'error') {
			errorMessage = response.data
		} else {
			currentRegistration.set(response.data.registration)
			entryStore.set(response.data.entries)
			$stepsAllowed = true
			dispatch('complete')
			goto('/view')
		}
	}
</script>

<section class="container mx-auto max-w-prose px-3">
	<GoBack stepTitle="Complete the Registration for - {$currentRegistration.email}" />

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
		<!-- <p class="mt-4">Please direct deposit ${costOfRegistration} to:</p>
		<p>Account Name: Edgy Art Inc</p>
		<p>BSB: 802124</p>
		<p>Acct Number: 100082466</p>
		<p>Reference: {$currentRegistration.registrationId} - {$currentRegistration.lastName}</p> -->
		<!-- <p class="mt-6 text-lg">
			We will invoice you for the above fee via email from our Square account. If do not want to pay
			by Credit or Debit card and you would like to make alternative payment arrangements please
			email <a class="text-blue-600" {href} target="_blank" rel="noopener noreferrer"
				>accounts@sculpturebermagui.org.au</a
			><br /> -->

		<p class="text-base">
			You are about to pay the registration fee by Credit or Debit card.
			<br />
			If you would like to make alternative payment arrangements please email
			<a class="text-blue-600 underline" {href} target="_blank" rel="noopener noreferrer"
				>accounts@sculpturebermagui.org.au</a
			><br />

			<br />
			Please note that your registration will not be complete until payment has been received.
		</p>
	</div>

	{#if errorMessage}
		<p class="mt-6 text-red-500">{errorMessage}</p>
	{/if}
	{#if fetchingData}
		<div
			style="border-top-color:transparent"
			class="m-6 h-16 w-16 animate-spin rounded-full border-8 border-solid border-accent"
		/>
	{/if}
	{#if actionType === 'commenceCompletion' && !fetchingData}
		<form method="POST" action="?/enteredCC">
			<button
				disabled={fetchingData}
				type="submit"
				class="mt-8 inline-block w-auto  rounded-lg bg-red-400 px-7 py-3  font-semibold text-white shadow-md transition duration-150 ease-in-out hover:bg-red-500 hover:shadow-lg focus:bg-red-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-200 active:shadow-lg"
				>By clicking here I CONFIRM that all details are correct<br />
				<span class="text-base">and I wish to pay via card payment</span><br />
				<span class="text-sm">(No further changes can be made)</span>
			</button>
		</form>
	{/if}

	{#if actionType === 'enteringCardDetails' && !fetchingData}
		<p>We need a modal here for card payment</p>
		<button
			on:click={() =>
				makePayment({
					registrationId: $currentRegistration.registrationId,
					email: $currentRegistration.email
				})}
			disabled={fetchingData}
			type="submit"
			class="mt-8 inline-block w-auto  rounded-lg bg-red-400 px-7 py-3  font-semibold text-white shadow-md transition duration-150 ease-in-out hover:bg-red-500 hover:shadow-lg focus:bg-red-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-200 active:shadow-lg"
			>I've entered my details<br />
		</button>
	{/if}

	{#if actionType === 'makePayment' && !fetchingData}
		<button
			on:click={() =>
				completeRegistration({
					registrationId: $currentRegistration.registrationId,
					email: $currentRegistration.email
				})}
			disabled={fetchingData}
			type="submit"
			class="mt-8 inline-block w-auto  rounded-lg bg-red-400 px-7 py-3  font-semibold text-white shadow-md transition duration-150 ease-in-out hover:bg-red-500 hover:shadow-lg focus:bg-red-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-200 active:shadow-lg"
			>Make Payment and go to Complete<br />
		</button>
	{/if}
</section>

{#if form?.errors}
	<p>Error from action</p>
{/if}

<!-- on:click={() =>
	completeRegistration({
		registrationId: $currentRegistration.registrationId,
		email: $currentRegistration.email
	})} -->
