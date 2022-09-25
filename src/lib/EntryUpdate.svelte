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
	import { onMount } from 'svelte'

	import { createForm } from 'felte'

	import { ACTION } from '$lib/CONSTANTS.js'
	import { currentUserEmail, currentRegistration, entryStore } from '$lib/stores.js'

	import EntryFields from '$lib/EntryFields.svelte'
	import FileUpload from '$lib/FileUpload.svelte'

	export let entryAction
	export let entryIdToEdit
	export let onClose

	onMount(() => {
		//setup fields to enter/upate
		let entry = {
			entryId: entryIdToEdit,
			registrationId: $currentRegistration.registrationId,
			email: $currentUserEmail,
			title: '',
			price: '',
			inOrOut: 'Outdoor',
			material: '',
			dimensions: '',
			description: '',
			specialRequirements: ''
		}
		if (entryAction === ACTION.EDITING_ENTRY) {
			entry = $entryStore.find((item) => item.entryId === entryIdToEdit)
			currentImage = entry.images[0]
		}
		// console.log(entry)

		setFields({
			entryId: entry.entryId,
			registrationId: $currentRegistration.registrationId,
			email: $currentUserEmail,
			title: entry.title,
			price: entry.price,
			inOrOut: entry.inOrOut,
			material: entry.material,
			dimensions: entry.dimensions,
			description: entry.description,
			specialRequirements: entry.specialRequirements
		})
	})

	//get all the functions and data from felte form
	const {
		form,
		data: formData,
		reset: formReset,
		setFields
	} = createForm({
		onSubmit: (values, context) => {
			// console.log(`submit - id:${values.id} - entryAction: ${entryAction}`)
			// console.log(JSON.stringify(values, null, 2))
			// console.log(JSON.stringify(context, null, 2))
		}
	})

	let currentImage
	let fetchingData = false
	let errorMessage = ''

	//image information to pass up when an image is selected
	let imageRes = { image: {}, imageFileName: {} }

	function setImageDetails(e) {
		imageRes = { image: e.detail.image, imageFileName: e.detail.fileName }
	}

	async function sendToServer(data) {
		fetchingData = true
		errorMessage = ''
		console.log('sending ', entryAction)
		console.log(data)

		const res = await fetch(`/api`, {
			method: 'POST',
			body: JSON.stringify({ action: entryAction, data })
		})

		const resMessage = await res.json()
		fetchingData = false
		console.log('receiving	', entryAction)
		// console.log(resMessage)
		if (resMessage.result === 'error') {
			errorMessage = resMessage.data
		}
		return resMessage
	}

	function entryIsValid(data) {
		if (!imageRes.image.length) {
			errorMessage = 'You MUST supply an image with each entry'
			return false
		}
		if (data.title === '' || data.price === '' || data.description === '') {
			errorMessage = 'Please fill in required fields'
			return false
		}
		errorMessage = ''
		return true
	}

	async function addEntry(entry) {
		if (!entryIsValid(entry)) {
			return
		}
		console.log('Adding')
		const newEntry = {
			description: entry.description,
			dimensions: entry.dimensions,
			email: $currentUserEmail,
			entryId: 'NotSet',
			inOrOut: entry.inOrOut,
			material: entry.material,
			price: entry.price,
			specialRequirements: entry.specialRequirements,
			registrationId: $currentRegistration.registrationId,
			title: entry.title
		}
		const newImage = {
			blobDataURL: imageRes.image,
			email: $currentUserEmail,
			entryId: 'NotSet',
			imageFileName: `${$currentRegistration.lastName}_${newEntry.title}_`, //: artistSurname_title_id
			imageId: 'NewImage',
			originalFileName: imageRes.imageFileName
		}

		const response = await sendToServer({ newEntry, newImage })
		if (response.result === 'error') {
			errorMessage = response.data
			return
		}

		currentRegistration.set(response.data.registration)
		entryStore.set(response.data.entries)
		onClose()
	}

	async function deleteEntry(id) {
		const response = await sendToServer({ entryId })
		if (response.result === 'error') {
			errorMessage = response.data
		} else {
			currentRegistration.set(response.data.registration)
			entryStore.set(response.data.entries)
			entryAction = null
		}
	}

	async function modifyEntry(entry) {
		if (!entryIsValid(entry)) {
			return
		}

		// has the image changed?
		//display the existing image initially
		// have button to upouidate the image
		// send entry and image to modify

		const response = await sendToServer(entry)
		if (response.result === 'error') {
			errorMessage = response.data
			return
		}

		currentRegistration.set(response.data.registration)
		entryStore.set(response.data.entries)
		onClose()
	}
</script>

<section class="container mx-auto max-w-prose px-3">
	<form use:form>
		<EntryFields />
		<FileUpload on:fileUpload={setImageDetails} />
		{#if !fetchingData}
			{#if entryAction === ACTION.ADDING_ENTRY}
				<button
					on:click={() => addEntry($formData)}
					disabled={fetchingData}
					type="submit"
					class="mt-8 inline-block rounded bg-primary-400 px-7 py-3 font-semibold  uppercase text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
					>Add this Entry</button
				>
			{:else if entryAction === ACTION.EDITING_ENTRY || entryAction === ACTION.DELETING_ENTRY}
				<button
					on:click={() => modifyEntry($formData)}
					type="submit"
					class="mt-8 inline-block rounded bg-primary-400 px-7 py-3 font-semibold  uppercase text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
					>Edit Entry</button
				>
			{/if}
			<button
				on:click={onClose}
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
	</form>

	{#if errorMessage}
		<p class="mt-6 text-red-500">{errorMessage}</p>
	{/if}
</section>
<!-- <pre>{JSON.stringify($currentRegistration, null, 2)}</pre> -->
<!-- <pre>{JSON.stringify($entryStore, null, 2)}</pre> -->
<!-- <pre>{JSON.stringify($formData, null, 2)}</pre> -->
<!-- <pre>{JSON.stringify(entryAction, null, 2)}</pre> -->
