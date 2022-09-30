<script>
	import Entry from '$lib/Entry.svelte'
	import Register from '$lib/Register.svelte'
	import Confirm from '$lib/Confirm.svelte'
	import Complete from '$lib/Complete.svelte'

	import ProgressBar from '$lib/Progress.Bar.svelte'
	import { goto } from '$app/navigation'
	import { currentUserEmail, currentRegistration, entryStore, stepsAllowed } from '$lib/stores.js'

	let steps = ['Register', 'Entries', 'Confirm', 'Complete']

	$: currentActive = setCurrent()

	function setCurrent(newStep = 1) {
		let next = newStep

		if (newStep < 0) {
			next = 0
		}
		if (next > steps.length - 1) {
			next = steps.length - 1
		}

		if ($currentRegistration?.email == null) {
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

<section class="container mx-auto max-w-prose px-3">
	{#if !$currentRegistration}
		<h1 class="mb-6 text-xl font-bold">Please register first</h1>
		<button
			type="button"
			on:click={() => goto('/')}
			class="rounded-md bg-primary-300 px-5 py-1 text-sm font-semibold text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-400 hover:shadow-lg focus:bg-primary-400 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
			>Back
		</button>
	{:else}
		<ProgressBar {steps} {currentActive} />
		<div class="mt-10">
			{#if currentActive == 0}
				<Register on:registered={() => handleProgress(+1)} on:cancel={() => goto('/')} />
			{:else if currentActive == 1}
				<Entry />
			{:else if currentActive == 2}
				<Confirm on:confirmed={() => handleProgress(+1)} on:cancel={() => handleProgress(-1)} />
			{:else if currentActive == 3}
				<Complete on:confirmed={() => handleProgress(0)} on:cancel={() => handleProgress(-2)} />
			{/if}
		</div>
		{#if $stepsAllowed}
			<div class="mt-10 flex max-w-2xl justify-around">
				{#if currentActive > 0}
					<button
						class=" cursor-pointer rounded-lg border-0 bg-emerald-300 px-8 py-1 font-semibold text-gray-700"
						on:click={() => handleProgress(-1)}>Previous Step</button
					>
				{/if}
				{#if currentActive < steps.length - 1}
					<button
						class=" cursor-pointer rounded-lg border-0 bg-emerald-300 px-10 py-1 font-semibold text-gray-700"
						on:click={() => handleProgress(+1)}>Next Step</button
					>
				{/if}
			</div>
		{/if}
	{/if}
</section>
<!-- <pre>{currentActive}</pre> -->
<!-- <pre>{$currentRegistration.email}</pre> -->
<!-- <pre>{$currentUserEmail}</pre> -->
<!-- <pre>{$stepsAllowed}</pre> -->
