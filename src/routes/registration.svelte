<script>
	import Entry from '$lib/Entry.svelte'
	import Register from '$lib/Register.svelte'
	import Confirm from '$lib/Confirm.svelte'
	import Complete from '$lib/Complete.svelte'

	import ProgressBar from '$lib/Progress.Bar.svelte'
	import { goto } from '$app/navigation'
	import { currentUserEmail, currentRegistration, entryStore } from '$lib/stores.js'

	function routeToPage(route, replaceState) {
		goto(`/${route}`, { replaceState })
	}
	let steps = ['Register', 'Entries', 'Confirm', 'Complete']

	let currentActive = 1
	currentActive = setCurrent(1)

	function setCurrent(newStep) {
		let next = newStep

		if (newStep < 0) {
			next = 0
		}
		if (next > steps.length - 1) {
			next = steps.length - 1
		}

		if ($currentRegistration.email == null) {
			return 0
		}

		if (next > 1 && $entryStore.length == 0) {
			return 1
		}

		if ($currentRegistration.complete === 'Y') {
			return 3
		}
		return next
	}

	const handleProgress = (stepIncrement) => {
		currentActive = setCurrent(currentActive + stepIncrement)
	}
</script>

<ProgressBar {steps} {currentActive} />

<div class="mt-10">
	{#if currentActive == 0}
		<Register on:registered={() => handleProgress(+1)} on:cancel={() => routeToPage('')} />
	{:else if currentActive == 1}
		<Entry />
	{:else if currentActive == 2}
		<Confirm />
	{:else if currentActive == 3}
		<Complete />
	{/if}
</div>

<div class="mt-10 flex max-w-2xl justify-around">
	<button
		class=" cursor-pointer rounded-lg border-0 bg-emerald-300 px-8 py-1 font-semibold text-gray-700"
		on:click={() => handleProgress(-1)}
		disabled={currentActive == 0}>Previous Step</button
	>
	<button
		class=" cursor-pointer rounded-lg border-0 bg-emerald-300 px-10 py-1 font-semibold text-gray-700"
		on:click={() => handleProgress(+1)}
		disabled={currentActive == steps.length}>Next Step</button
	>
</div>

<!-- <pre>{currentActive}</pre> -->
<!-- <pre>{$currentRegistration.email}</pre> -->
