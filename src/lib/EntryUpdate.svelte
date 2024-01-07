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
	import { getViewURL } from '$lib/Utilities.js'
	import { currentUserEmail, currentRegistration, entryStore } from '$lib/stores.js'

	import EntryFields from '$lib/EntryFields.svelte'
	import FileUpload from '$lib/FileUpload.svelte'
	import FileUploadByModal from '$lib/FileUploadByModal.svelte'

	export let entryAction
	export let entryIdToEdit
	export let onClose

	let entry

	let imageBeforeUpdate
	let replacementImage
	let fetchingData = false
	let errorMessage = ''

	onMount(() => {
		//setup fields to enter/upate
		entry = {
			entryId: entryIdToEdit,
			registrationId: $currentRegistration.registrationId,
			email: $currentUserEmail,
			title: '',
			price: '',
			inOrOut: 'Outdoor',
			material: '',
			dimensions: '',
			description: '',
			specialRequirements: '',
			enterMajorPrize: ''
		}
		if (entryAction === ACTION.EDITING_ENTRY || entryAction === ACTION.DELETING_ENTRY) {
			entry = $entryStore.find((item) => item.entryId === entryIdToEdit)
			imageBeforeUpdate = { ...entry.images[0] }
			// console.log(imageBeforeUpdate)
		}
		// console.log(entry)
		// console.log(entryAction)

		const splitDimensions = entry.dimensions.split(/x/)

		setFields({
			entryId: entry.entryId,
			registrationId: $currentRegistration.registrationId,
			email: $currentUserEmail,
			title: entry.title,
			price: entry.price,
			inOrOut: entry.inOrOut,
			material: entry.material,
			dimensions: entry.dimensions,
			dimLength: splitDimensions[0],
			dimWidth: splitDimensions[1],
			dimHeight: splitDimensions[2],
			description: entry.description,
			specialRequirements: entry.specialRequirements,
			enterMajorPrize: entry.enterMajorPrize
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

	//image information to pass up when an image is selected
	let imageRes = null

	function setImageDetails(e) {
		imageRes = {
			image: e.detail.image,
			imageFileName: e.detail.fileName,
			imageSize: e.detail.fileSize
		}
	}

	async function sendToServer(data) {
		fetchingData = true
		errorMessage = ''
		// console.log('sending ', entryAction)
		// console.log(data)

		const res = await fetch(`/api/sheets`, {
			method: 'POST',
			body: JSON.stringify({ action: entryAction, data })
		})
		if (!res.ok) {
			errorMessage = `Error: ${res.status} - ${res.statusText}`
			fetchingData = false
			return { result: 'error', data: errorMessage }
		}

		const resMessage = await res.json()
		fetchingData = false
		// console.log('receiving	', entryAction)
		// console.log(resMessage)
		if (resMessage.result === 'error') {
			errorMessage = resMessage.data
		}
		return resMessage
	}

	function entryIsValid(data) {
		if (entryAction === ACTION.ADDING_ENTRY && !imageRes?.image?.length) {
			errorMessage = 'You MUST supply an image with each entry'
			return false
		}
		if (data.title === '' || data.price === '' || data.description === '') {
			errorMessage = 'Please fill in required fields'
			return false
		}
		if (imageRes?.imageSize > 5000000) {
			errorMessage = 'Image Size > 5MB, please reduce the size of your image'
			return false
		}

		data.dimensions = data.dimLength + 'x' + data.dimWidth + 'x' + data.dimHeight
		errorMessage = ''
		return true
	}

	async function addEntry(entry) {
		if (!entryIsValid(entry)) {
			return
		}
		// console.log('Adding')
		const newEntry = {
			description: entry.description,
			dimensions: entry.dimensions,
			email: $currentUserEmail,
			entryId: 'NotSet',
			inOrOut: entry.inOrOut,
			material: entry.material,
			price: entry.price,
			specialRequirements: entry.specialRequirements,
			enterMajorPrize: entry.enterMajorPrize,
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

	async function deleteEntry() {
		const response = await sendToServer({
			entryId: entry.entryId,
			imageId: imageBeforeUpdate.imageId,
			email: $currentUserEmail
		})
		if (response.result === 'error') {
			errorMessage = response.data
			return
		}

		currentRegistration.set(response.data.registration)
		entryStore.set(response.data.entries)
		onClose()
	}

	async function modifyEntry(entry) {
		if (!entryIsValid(entry)) {
			return
		}

		// has the image changed?
		// add an 'image' property to the entry
		// send entry and image to modify
		if (replacementImage?.imageIsBlob) {
			entry.image = {
				blobDataURL: replacementImage.image,
				email: $currentUserEmail,
				entryId: entry.entryId,
				imageFileName: `${$currentRegistration.lastName}_${entry.title}_${imageBeforeUpdate.imageId}`,
				imageURL: imageBeforeUpdate.imageURL,
				imageId: imageBeforeUpdate.imageId,
				originalFileName: replacementImage.imageFileName
			}
		}

		const response = await sendToServer(entry)
		if (response.result === 'error') {
			errorMessage = response.data
			return
		}

		currentRegistration.set(response.data.registration)
		entryStore.set(response.data.entries)
		onClose()
	}

	function handleFileUploadReplace(e) {
		// console.log('EntryUpdate')
		if (e.detail) {
			replacementImage = {
				imageIsBlob: true,
				image: e.detail.image,
				imageFileName: e.detail.fileName
			}
			// console.log('back from modal')
			// console.log(replacementImage.imageFileName)
		} else {
			replacementImage = {}
			// console.log('EntryUpdate - No image selected')
		}
	}
</script>

<section class="container mx-auto max-w-prose px-3">
	<form use:form>
		<!--Show the ADD screen-->
		{#if entryAction === ACTION.ADDING_ENTRY}
			<EntryFields />

			<FileUpload on:fileUpload={setImageDetails} />
		{/if}

		<!--Show the EDIT screen-->
		{#if entryAction === ACTION.EDITING_ENTRY}
			<EntryFields />
			<div
				class="mx-auto mt-10 flex h-48 w-48 flex-col items-center justify-center border-2 border-solid border-slate-200 text-slate-400"
			>
				{#if replacementImage?.imageIsBlob}
					<img alt="Preview" class="h-48 w-48 object-scale-down p-1" src={replacementImage.image} />
				{:else if imageBeforeUpdate?.imageURL}
					<img
						class="h-48 w-48 object-scale-down p-1"
						src={getViewURL(imageBeforeUpdate?.imageURL)}
						alt="Preview"
					/>
				{:else}
					<span>Image Preview</span>
				{/if}
			</div>
			<FileUploadByModal on:fileUploadReplace={handleFileUploadReplace} />
		{/if}

		<!--Show the DELETE screen-->
		{#if entryAction === ACTION.DELETING_ENTRY}
			<p class="mt-6 text-xl text-red-400">
				Ready to Delete the Entry with title: {entry?.title}
			</p>

			<div
				class="mx-auto mt-10 flex h-48 w-48 flex-col items-center justify-center border-2 border-solid border-slate-200 text-slate-400"
			>
				{#if imageBeforeUpdate?.imageURL}
					<img
						class="h-48 w-48 object-scale-down p-1"
						src={getViewURL(imageBeforeUpdate?.imageURL)}
						alt="Preview"
					/>
				{:else}
					<span>Image Preview</span>
				{/if}
			</div>
		{/if}
		<!-- <pre>{JSON.stringify(imageBeforeUpdate, null, 2)}</pre> -->
		<!-- <pre>{JSON.stringify(replacementImage, null, 2)}</pre> -->

		<!--Buttons and Spinner-->
		{#if !fetchingData}
			{#if entryAction === ACTION.ADDING_ENTRY}
				<button
					on:click={() => addEntry($formData)}
					disabled={fetchingData}
					type="submit"
					class="mt-8 inline-block rounded bg-primary-400 px-7 py-3 font-semibold uppercase text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
					>Add this Entry</button
				>
			{:else if entryAction === ACTION.EDITING_ENTRY}
				<button
					on:click={() => modifyEntry($formData)}
					type="submit"
					class="mt-8 inline-block rounded bg-primary-400 px-7 py-3 font-semibold uppercase text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
					>Save Changes</button
				>
			{:else if entryAction === ACTION.DELETING_ENTRY}
				<button
					on:click={() => deleteEntry()}
					type="submit"
					class="mt-8 inline-block rounded bg-primary-400 px-7 py-3 font-semibold uppercase text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
					>Delete Entry</button
				>{/if}
			<button
				on:click={onClose}
				type="submit"
				class="mt-8 inline-block rounded bg-primary-400 px-7 py-3 font-semibold uppercase text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
				>Cancel</button
			>
		{:else}
			<!-- fetchingData -->
			<div
				style="border-top-color:transparent"
				class="m-6 h-16 w-16 animate-spin rounded-full border-8 border-solid border-accent"
			/>
		{/if}
	</form>

	{#if errorMessage}
		<p class="mt-6 text-red-500">{errorMessage}</p>
	{:else}
		<p class="mt-6">&nbsp</p>
	{/if}
</section>
<!-- <pre>{JSON.stringify($currentRegistration, null, 2)}</pre> -->
<!-- <pre>{JSON.stringify($entryStore, null, 2)}</pre> -->
<!-- <pre>{JSON.stringify($formData, null, 2)}</pre> -->
<!-- <pre>{JSON.stringify(entryAction, null, 2)}</pre> -->
