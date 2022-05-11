<script>
	// title
	// price
	// inOrOut
	// material
	// dimensions
	// description
	// specialRequirements
	// originalFileName
	// imageURL
	import { createForm } from 'felte'
	import { v4 as uuidv4 } from 'uuid'
	import { goto } from '$app/navigation'
	import { currentUserEmail, currentRegistration, entryStore } from '../lib/stores.js'
	import FormEntry from '../lib/FormEntry.svelte'
	import Accordion from '../lib/entryAccordion.svelte'

	function routeToPage(route, replaceState) {
		goto(`/${route}`, { replaceState })
	}

	let entries
	let isEdit = false

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
			console.log(`submit - id:${values.id} - isEdit: ${isEdit}`)
			// console.log(JSON.stringify(values, null, 2))
			// console.log(JSON.stringify(context, null, 2))
		}
		// onSuccess(response, context) {
		// 	// Do something with the returned value from `onSubmit`.
		// 	console.log('Success')
		// 	console.log(JSON.stringify(response, null, 2))
		// 	console.log(JSON.stringify(context, null, 2))
		// },
		// onError(err, context) {
		// 	// Do something with the error thrown from `onSubmit`.
		// 	console.log('Error')
		// }
	})

	let sendToServer = async (requestType, data) => {
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

	let addEntry = async (entry) => {
		const newEntry = { ...entry, id: uuidv4(), email: $currentUserEmail }
		const response = await sendToServer('addentry', newEntry)
		if (response.result === 'error') {
			errorMessage = response.data
		} else {
			entryStore.createEntry(newEntry)
			formReset()
		}
	}

	let deleteEntry = async (id) => {
		const response = await sendToServer('delentry', { id: id })
		if (response.result === 'error') {
			errorMessage = response.data
		} else {
			entryStore.deleteEntry(id)
			formReset()
		}
	}

	let editEntry = (entry) => {
		console.log('edit', entry)
		isEdit = true
		formReset()
		setFields({
			id: entry.id,
			title: entry.title,
			price: entry.price,
			inOrOut: entry.inOrOut,
			material: entry.material,
			dimensions: entry.dimensions,
			description: entry.description,
			specialRequirements: entry.specialRequirements,
			originalFileName: entry.originalFileName,
			imageURL: entry.imageURL
		})
		console.log('data')
	}

	let updateEntry = (entry) => {
		isEdit = !isEdit
		console.log('update', entry)
		entryStore.modifyEntry(entry)
		//todo send to backend
		formReset()
	}

	const entryReset = {
		id: uuidv4(),
		email: $currentUserEmail,
		title: '',
		price: '',
		inOrOut: 'Outdoor',
		material: '',
		dimensions: '',
		description: '',
		specialRequirements: '',
		originalFileName: '',
		imageURL: ''
	}
</script>

<section class="container mx-auto max-w-prose px-3">
	{#if !$currentRegistration}
		<h1 class="text-2xl font-bold">Please register before trying to add entries</h1>
	{:else}
		<h4 class="mt-6 text-xl font-bold text-primary">Manage Entries</h4>
		<p class="mt-4 text-base">
			Entry for <strong>
				{$currentRegistration.firstName}
				{$currentRegistration.lastName}
			</strong>
			<button
				type="button"
				disabled={!$currentUserEmail}
				on:click={() => goto('/register')}
				class="inline-block rounded bg-accent-200 px-3 text-sm text-black shadow-md transition duration-150 ease-in-out hover:bg-accent-300 hover:shadow-lg focus:bg-accent-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-accent-100 active:shadow-lg disabled:opacity-25"
				>Change?</button
			>
		</p>

		<div class="mt-8 flex items-center">
			<div class="flex-grow border-t border-gray-400" />
			<span class="mx-4 flex-shrink text-gray-600">Add a new Entry</span>
			<div class="flex-grow border-t border-gray-400" />
		</div>

		<form use:form>
			<input type="hidden" id="id" name="id" />

			<FormEntry />

			{#if isEdit === false}
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
				{#if fetchingData}
					<div
						style="border-top-color:transparent"
						class="m-6 h-16 w-16 animate-spin rounded-full border-8 border-solid border-accent"
					/>
				{/if}
			{:else}
				<button
					on:click={() => updateEntry($formData)}
					type="submit"
					class="mt-8 inline-block rounded bg-primary-400 px-7 py-3 font-semibold  uppercase text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
					>Edit Entry</button
				>
			{/if}
			<pre>{JSON.stringify($formData, null, 2)}</pre>
		</form>

		<div class="mt-12 flex items-center">
			<div class="flex-grow border-t border-gray-400" />
			<span class="mx-4 flex-shrink text-gray-600">Entries already added</span>
			<div class="flex-grow border-t border-gray-400" />
		</div>

		<!-- <Accordion /> -->
		<!-- {#if $entryStore != undefined} -->
		{#each $entryStore as entry}
			<h5 class="mt-6 ">{entry.title}</h5>
			<p class="">{entry.description}</p>
			<p class="">{entry.material}</p>
			<p class="">{entry.price}</p>
			<p class="">{entry.specialRequirements}</p>
			<!-- <img alt="Image of Work" src={entry.imageURL} width="200" /> -->
			<p class="">{entry.id}</p>
			<button
				on:click={() => editEntry(entry)}
				class="inline-block rounded bg-accent-200 px-3 text-sm text-black shadow-md transition duration-150 ease-in-out hover:bg-accent-300 hover:shadow-lg focus:bg-accent-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-accent-100 active:shadow-lg disabled:opacity-25"
				>Edit</button
			>
			<button
				on:click={() => deleteEntry(entry.id)}
				class="inline-block rounded bg-red-600 px-3 text-sm text-white shadow-md transition duration-150 ease-in-out hover:bg-red-300 hover:shadow-lg focus:bg-red-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-100 active:shadow-lg disabled:opacity-25"
				>Delete</button
			>
		{/each}
	{/if}
</section>
<pre>{JSON.stringify($currentRegistration, null, 2)}</pre>
<pre>{JSON.stringify($entryStore, null, 2)}</pre>
