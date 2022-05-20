<script>
	import '../app.css'
	import Nav from '$lib/Nav.svelte'

	import ProgressBar from '../lib/Progress.Bar.svelte'
	let steps = ['Personal', 'Entries', 'Confirm', 'Complete']
	let currentActive = 1
	let progressBar

	const handleProgress = (stepIncrement) => {
		progressBar.handleProgress(stepIncrement)
	}
</script>

<svelte:head>
	<title>Scuplture Bermagui - Artist Registration</title>
</svelte:head>

<Nav />
<div class="mt-8">
	<p
		class="ml-28 -mt-8 mb-4
	text-xl font-bold text-gray-700"
	>
		Artist Registration - 2023
	</p>
</div>
<!-- <ProgressBar {steps} bind:currentActive bind:this={progressBar} /> -->
<div class="mx-auto my-8 flex max-w-2xl flex-col justify-around">
	<ProgressBar {steps} />
	<div class="mt-10 flex max-w-2xl justify-around">
		<button
			class=" cursor-pointer rounded-lg border-0 bg-primary-200 px-8 py-1 text-white"
			on:click={() => handleProgress(-1)}
			disabled={currentActive == 1}>Previous Step</button
		>
		<button
			class=" cursor-pointer rounded-lg border-0 bg-primary-200 px-10 py-1 text-white"
			on:click={() => handleProgress(+1)}
			disabled={currentActive == steps.length}>Next Step</button
		>
	</div>
</div>
<div class="mt-8 flex items-center">
	<div class="flex-grow border-t border-gray-400" />
	<span class="mx-4 flex-shrink text-gray-600">Divider</span>
	<div class="flex-grow border-t border-gray-400" />
</div>

<slot />
