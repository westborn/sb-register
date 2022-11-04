<script>
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	import { slide } from 'svelte/transition'

	import { getViewURL } from '$lib/Utilities.js'
	import { currentUserEmail, currentRegistration, entryStore } from '$lib/stores.js'

	export let showButtons = false

	// don't mutate state when we add properties for display management
	// so take a deep copy of what was passed in
	$: myEntries = JSON.parse(JSON.stringify($entryStore))

	const expand = (entryDisplayed) => {
		myEntries = myEntries.map((s) => {
			if (s.entryId === entryDisplayed.entryId) {
				s.active ? (s.active = false) : (s.active = true)
			}
			return s
		})
	}
</script>

<div class=" rounded-lg border bg-gray-50">
	{#each myEntries as entryDisplayed}
		<div class="m-2 bg-gray-100 p-2 text-gray-800">
			<button
				class="w-full text-left text-lg hover:bg-blue-100"
				on:click={() => expand(entryDisplayed)}
			>
				<span>
					{#if entryDisplayed.active}
						<span class="text-accent-600">&#9650;</span>
					{:else}
						<span>&#9654;</span>
					{/if}
				</span>

				{entryDisplayed.title}
				<span class="text-xs">
					({entryDisplayed.inOrOut})
				</span>
			</button>
			{#if entryDisplayed.active}
				<div class="mb-2 bg-slate-50 px-5 py-2 text-sm" transition:slide>
					<p>{entryDisplayed.description}</p>
					<div class="mx-auto flex items-center justify-between">
						<p class="text-lg">
							{entryDisplayed.price.toLocaleString('en-AU', {
								style: 'currency',
								currency: 'AUD'
							})}
						</p>
						<p>{entryDisplayed?.enterMajorPrize ? 'Entered in Major Prize' : ''}</p>
						<p>({entryDisplayed.dimensions})</p>
					</div>

					<p>{entryDisplayed.material}</p>
					<p>{entryDisplayed?.specialRequirements}</p>

					<div
						class="mx-auto mt-10 flex h-48 w-48 flex-col items-center justify-center border-2 border-solid border-slate-200 text-slate-400"
					>
						{#if entryDisplayed?.images[0]?.imageURL}
							<img
								class="h-48 w-48 object-scale-down p-1"
								src={getViewURL(entryDisplayed?.images[0]?.imageURL)}
								alt="Preview"
							/>
						{:else}
							<span>Image Preview</span>
						{/if}
					</div>
					<!-- <pre>{JSON.stringify(entryDisplayed, null, 2)}</pre> -->
				</div>
				{#if showButtons}
					<div class="flex justify-between px-8">
						<button
							on:click={() => dispatch('edit', entryDisplayed.entryId)}
							class="rounded bg-accent-200 px-7 text-sm text-black shadow-md transition duration-150 ease-in-out hover:bg-accent-300 hover:shadow-lg focus:bg-accent-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-accent-100 active:shadow-lg disabled:opacity-25"
							>Edit</button
						>

						<button
							on:click={() => dispatch('delete', entryDisplayed.entryId)}
							class="rounded bg-red-600 px-7 text-sm text-white shadow-md transition duration-150 ease-in-out hover:bg-red-300 hover:shadow-lg focus:bg-red-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-100 active:shadow-lg disabled:opacity-25"
							>Delete</button
						>
					</div>
				{/if}
			{/if}
		</div>
	{/each}
</div>
