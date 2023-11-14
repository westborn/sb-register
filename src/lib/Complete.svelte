<script>
	import { goto } from '$app/navigation'

	import { currentRegistration, entryStore } from '$lib/stores.js'
	import GoBack from '$lib/GoBack.svelte'
	import TextList from '$lib/TextList.svelte'

	let actionType = 'commenceCompletion'
	let fetchingData = false
	$: costOfRegistration = 20 + $entryStore.length * 20
	$: numberOfEntries = $entryStore.length === 1 ? `1 entry` : `${$entryStore.length} entries`
	let href = `mailto:accounts@sculpturebermagui.org.au?subject=Request for Payment - Registration ${$currentRegistration.registrationId} ${$currentRegistration.lastName}`
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

		<p class="text-base">
			You are about to pay the registration fee by Credit or Debit card.
			<br />
			If you would like to make alternative payment arrangements please email
			<a class="text-blue-600 underline" {href} target="_blank" rel="noopener noreferrer"
				>accounts@sculpturebermagui.org.au</a
			><br />

			<br />
			Please note that your registration will not be complete until payment has been received.
			<a
				href="https://sculpturebermagui.org.au\wp-content\uploads\2023\11\Exhibiting-at-Sculpture-Bermagui-2024.pdf"
				class="text-blue-600 underline hover:underline hover:text-blue-700"
				target="_blank"
				rel="noopener noreferrer">Artists Terms and Conditions</a
			>
		</p>
	</div>

	{#if fetchingData}
		<div
			style="border-top-color:transparent"
			class="m-6 h-16 w-16 animate-spin rounded-full border-8 border-solid border-accent"
		/>
	{/if}
	{#if actionType === 'commenceCompletion' && !fetchingData}
		<button
			on:click={() => goto('/registration/payment')}
			disabled={fetchingData}
			type="submit"
			class="mt-4 inline-block w-auto rounded-lg bg-red-400 px-7 py-3 font-semibold text-white shadow-md transition duration-150 ease-in-out hover:bg-red-500 hover:shadow-lg focus:bg-red-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-200 active:shadow-lg"
			>By clicking here I CONFIRM that all details are correct<br />
			<span class="text-base">and I have read the "Artists Terms & Conditions"</span><br />
		</button>
	{/if}
</section>
