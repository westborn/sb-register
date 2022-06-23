<script>
	// title
	// price
	// inOrOut
	// material
	// dimensions
	// description
	// specialRequirements

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

	import { createForm } from 'felte'
	import { v4 as uuidv4 } from 'uuid'
	import { currentUserEmail, currentRegistration, entryStore } from '$lib/stores.js'
	import GoBack from '$lib/GoBack.svelte'
	import FormEntry from '$lib/FormEntry.svelte'
	import Accordion from '$lib/EntryAccordion.svelte'
	import Upload from '../routes/upload.svelte'

	let entries
	let requestType = 'createEntry'
	let showButtons = true

	let fetchingData = false
	let errorMessage = ''

	entryStore.subscribe((value) => {
		entries = value
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

	let entryIsValid = (data) => {
		if (data.title === '' || data.price === '' || data.description === '') {
			errorMessage = 'Please fill in required fields'
			return false
		}
		errorMessage = ''
		return true
	}

	let addEntry = async (entry) => {
		if (!entryIsValid(entry)) {
			return
		}
		requestType = 'createEntry'
		const newEntry = { ...entry, id: uuidv4(), email: $currentUserEmail }
		const response = await sendToServer(newEntry)
		if (response.result === 'error') {
			errorMessage = response.data
		} else {
			currentRegistration.set(response.data.registration)
			entryStore.set(response.data.entries)
			showButtons = true
			formReset()
		}
	}

	let deleteEntry = async (id) => {
		requestType = 'deleteEntry'
		const response = await sendToServer({ id, email: $currentUserEmail })
		if (response.result === 'error') {
			errorMessage = response.data
		} else {
			currentRegistration.set(response.data.registration)
			entryStore.set(response.data.entries)
			formReset()
		}
		requestType = 'createEntry'
	}

	let editEntry = (entry) => {
		requestType = 'editEntry'
		console.log('edit', entry)
		formReset()
		setFields({
			id: entry.id,
			email: $currentUserEmail,
			title: entry.title,
			price: entry.price,
			inOrOut: entry.inOrOut,
			material: entry.material,
			dimensions: entry.dimensions,
			description: entry.description,
			specialRequirements: entry.specialRequirements
		})
		console.log('data')
	}

	let modifyEntry = async (entry) => {
		if (!entryIsValid(entry)) {
			return
		}
		requestType = 'modifyEntry'
		const response = await sendToServer(entry)
		if (response.result === 'error') {
			errorMessage = response.data
		} else {
			entryStore.modifyEntry(entry)
			formReset()
			currentRegistration.set(response.data.registration)
			entryStore.set(response.data.entries)
			requestType = 'createEntry'
		}
	}

	let resetEntry = () => {
		requestType = 'createEntry'
		formReset()
	}

	function handleEdit(event) {
		const entryToEdit = $entryStore.find((item) => item.id === event.detail)
		editEntry(entryToEdit)
	}

	function handleDelete(event) {
		deleteEntry(event.detail)
	}
</script>

<section class="container mx-auto max-w-prose px-3">
	<GoBack stepTitle="Entries for - {$currentRegistration.email}" />
	<div class="mt-6">
		{#if requestType === 'createEntry'}
			<Accordion {showButtons} on:edit={handleEdit} on:delete={handleDelete} />
		{/if}
	</div>

	<div class="mt-6 -ml-10 -mr-10 flex items-center">
		<div class="flex-grow border-t border-gray-400" />
		<span class="mx-4 flex-shrink text-gray-600"
			>{requestType === 'createEntry' ? 'Add a new Entry' : 'Edit this Entry'}</span
		>
		<div class="flex-grow border-t border-gray-400" />
	</div>

	<form use:form>
		<input type="hidden" id="id" name="id" />

		<FormEntry />

		<Upload />

		{#if requestType === 'createEntry'}
			{#if errorMessage}
				<p class="mt-6 text-red-500">{errorMessage}</p>
			{/if}
			<button
				on:click={() => addEntry($formData)}
				disabled={fetchingData}
				type="submit"
				class="mt-8 inline-block rounded bg-primary-400 px-7 py-3 font-semibold  uppercase text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
				>Add an Entry</button
			>
		{:else if requestType === 'editEntry'}
			<button
				on:click={() => modifyEntry($formData)}
				type="submit"
				class="mt-8 inline-block rounded bg-primary-400 px-7 py-3 font-semibold  uppercase text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
				>Edit Entry</button
			>
		{/if}
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
	</form>
</section>
<!-- <pre>{JSON.stringify($currentRegistration, null, 2)}</pre> -->
<!-- <pre>{JSON.stringify($entryStore, null, 2)}</pre> -->
