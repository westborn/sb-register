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
	import { goto } from '$app/navigation'
	import { currentUserEmail, currentRegistration } from '../lib/stores.js'
	import { entryStore } from '../lib/entryStore.js'
	import FormEntry from '../lib/FormEntry.svelte'

	let entries
	entryStore.subscribe((value) => {
		entries = value
	})
	let isEdit = false

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

	let addEntry = (entry) => {
		const newEntry = { ...entry }
		entryStore.createEntry(newEntry)
	}

	let deleteEntry = (id) => {
		entryStore.deleteEntry(id)
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
	}

	const generateRandomId = () => {
		Math.floor(Math.random() * 100000).toString()
	}

	const entryReset = {
		id: generateRandomId(),
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
			<button
				type="submit"
				class="mt-8 inline-block rounded bg-primary-400 px-7 py-3 font-semibold  uppercase text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
				>Add an Entry</button
			>
		{:else}
			<button
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
</section>
<pre>{JSON.stringify($currentRegistration, null, 2)}</pre>
<pre>{JSON.stringify($entryStore, null, 2)}</pre>
