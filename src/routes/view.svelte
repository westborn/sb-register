<script>
	import { goto } from '$app/navigation'
	import { currentUserEmail, currentRegistration, entryStore } from '../lib/stores.js'
	import Accordion from '../lib/entryAccordion.svelte'
	import TextList from '../lib/TextList.svelte'

	function routeToPage(route, replaceState) {
		goto(`/${route}`, { replaceState })
	}

	function handleEdit(event) {}

	function handleDelete(event) {}
</script>

<section class="container mx-auto max-w-prose px-3">
	{#if !$currentRegistration}
		<h1 class="text-2xl font-bold">Please register before trying to view entries</h1>
	{:else}
		<h4 class="mt-6 text-xl font-bold text-primary">Registration Details</h4>
		<div class="mt-4 text-base">
			Registration for <strong
				>{$currentRegistration.firstName} {$currentRegistration.lastName}</strong
			>
			<div class="mt-6 grid grid-cols-[13ch_1fr] items-center">
				<TextList item="Email" itemValue={$currentRegistration.email} />
				<TextList item="Phone" itemValue={$currentRegistration.phone} />
				<TextList item="Postcode" itemValue={$currentRegistration.postcode} />
				<TextList item="Bank Account" itemValue={$currentRegistration.bankAccountName} />
				<TextList item="BSB" itemValue={$currentRegistration.bankBSB} />
				<TextList item="Account" itemValue={$currentRegistration.bankAccount} />
				<TextList item="Transport" itemValue={$currentRegistration.transport} />
				<TextList item="Accommodation" itemValue={$currentRegistration.accommodation} />
				<TextList item="Crane" itemValue={$currentRegistration.crane} />
				<TextList item="Bump In" itemValue={$currentRegistration.bumpIn} />
				<TextList item="Bump Out" itemValue={$currentRegistration.bumpOut} />
				<TextList item="Requirements" itemValue={$currentRegistration.displayRequirements} />
			</div>
		</div>

		<div class="mt-12 flex items-center">
			<div class="flex-grow border-t border-gray-400" />
			<span class="mx-4 flex-shrink text-gray-600">Entries</span>
			<div class="flex-grow border-t border-gray-400" />
		</div>

		<Accordion
			sections={$entryStore}
			showButtons={false}
			on:edit={handleEdit}
			on:delete={handleDelete}
		/>
	{/if}
</section>
<!-- <pre>{JSON.stringify($currentRegistration, null, 2)}</pre> -->
<!-- <pre>{JSON.stringify($entryStore, null, 2)}</pre> -->
