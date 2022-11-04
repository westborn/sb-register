<script>
	// title
	// price
	// inOrOut
	// material
	// dimensions
	// description
	// specialRequirements
	// enterMajorPrize

	// const entryReset = {
	// 	id: uuidv4(),
	// 	email: $currentUserEmail,
	// 	title: '',
	// 	price: '',
	// 	inOrOut: 'Outdoor',
	// 	material: '',
	// 	dimensions: '',
	// 	description: '',
	// 	specialRequirements: '',
	// 	enterMajorPrize:''
	// }

	// const image = {
	// 	id: '',
	// 	entryId: '',
	// 	imageURL: '',
	// 	imageFileName: '',
	// 	originalFileName: ''
	// }

	// const updateImage = {
	// 	id: '',
	// 	email: '',
	// 	entryId: '',
	// 	originalFileName: '',
	// 	imageFileName: '', //: artistSurname_title_id
	// 	blobDataURL: ''
	// }

	import { ACTION } from '$lib/CONSTANTS.js'
	import { currentUserEmail, currentRegistration, entryStore, stepsAllowed } from '$lib/stores.js'
	import GoBack from '$lib/GoBack.svelte'
	import Accordion from '$lib/EntryAccordion.svelte'
	import EntryUpdate from './EntryUpdate.svelte'

	let entryIdToEdit = ''
	let showButtons = true
	let entryAction = ''
	$: costOfRegistration = 20 + $entryStore.length * 20
	$: numberOfEntries = $entryStore.length === 1 ? `1 entry` : `${$entryStore.length} entries`
	// $: numberOfEntries = $entryStore.length + ' entries'

	function showAdd() {
		entryIdToEdit = 'NotSet'
		$stepsAllowed = false
		entryAction = ACTION.ADDING_ENTRY
	}

	function showEdit(event) {
		entryIdToEdit = event.detail
		$stepsAllowed = false
		entryAction = ACTION.EDITING_ENTRY
	}

	function showDelete(event) {
		entryIdToEdit = event.detail
		$stepsAllowed = false
		entryAction = ACTION.DELETING_ENTRY
	}

	function cancelEntering() {
		console.log('close called')
		$stepsAllowed = true
		entryAction = null
	}
</script>

<section class="container mx-auto max-w-prose px-3">
	<GoBack stepTitle="Entries for - {$currentRegistration.email}" />
	<p class="mt-2 text-base text-primary-400">
		Your registration of {numberOfEntries} has a total fee of ${costOfRegistration}
	</p>
	{#if $stepsAllowed}
		<div class="mt-6">
			<Accordion {showButtons} on:edit={showEdit} on:delete={showDelete} />
		</div>
		<div class="flex items-center justify-center">
			<button
				on:click={() => showAdd()}
				class="mt-2 inline-block rounded-lg bg-primary-400 px-7 py-2 font-semibold   text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
				>Add an New Entry?</button
			>
		</div>
	{/if}
	{#if entryAction === ACTION.ADDING_ENTRY || entryAction === ACTION.EDITING_ENTRY || entryAction === ACTION.DELETING_ENTRY}
		<EntryUpdate {entryAction} {entryIdToEdit} onClose={() => cancelEntering()} />
	{/if}
</section>
<!-- <pre>{JSON.stringify($currentRegistration, null, 2)}</pre> -->
<!-- <pre>{JSON.stringify($entryStore, null, 2)}</pre> -->
