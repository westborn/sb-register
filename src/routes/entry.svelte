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
	import { goto } from '$app/navigation'
	import { currentUserEmail, errorStatus, errorMessage, currentEntry } from '../lib/stores.js'

	function routeToPage(route, replaceState) {
		goto(`/${route}`, { replaceState })
	}

	function gotoRegister() {}
	import FormEntry from '../lib/FormEntry.svelte'
</script>

<section class="container mx-auto max-w-prose px-3">
	<h4 class="mt-6 text-xl font-bold text-primary">Manage Entries</h4>
	<p class="mt-4 text-base">
		<strong> - {$currentUserEmail} - </strong>
		<button
			type="button"
			disabled={!$currentUserEmail}
			on:click={() => routeToPage('register')}
			class="inline-block rounded bg-accent-200 px-3 text-sm text-black shadow-md transition duration-150 ease-in-out hover:bg-accent-300 hover:shadow-lg focus:bg-accent-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-accent-100 active:shadow-lg disabled:opacity-25"
			>Change?</button
		>
	</p>

	<div class="mt-12 flex items-center">
		<div class="flex-grow border-t border-gray-400" />
		<span class="mx-4 flex-shrink text-gray-600">Add a new Entry</span>
		<div class="flex-grow border-t border-gray-400" />
	</div>

	<FormEntry />

	<div class="mt-12 flex items-center">
		<div class="flex-grow border-t border-gray-400" />
		<span class="mx-4 flex-shrink text-gray-600">Entries already added</span>
		<div class="flex-grow border-t border-gray-400" />
	</div>

	<pre>{JSON.stringify($currentEntry, null, 2)}</pre>
</section>
