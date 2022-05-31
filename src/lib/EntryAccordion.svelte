<script>
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	import { slide } from 'svelte/transition'
	import { currentUserEmail, currentRegistration, entryStore } from '$lib/stores.js'

	export let showButtons = false

	// don't mutate state when we add properties for display management
	// so take a deep copy of what was passed in
	$: disp = JSON.parse(JSON.stringify($entryStore))

	const expand = (section) => {
		disp = disp.map((s) => {
			if (s.id === section.id) {
				s.active ? (s.active = false) : (s.active = true)
			}
			return s
		})
	}

	function getIdFromUrl(url) {
		return url.match(/[-\w]{25,}(?!.*[-\w]{25,})/)
	}
	function getViewURL(url) {
		return `https://drive.google.com/uc?export=view&id=${getIdFromUrl(url)}`
	}
</script>

<div class=" rounded-lg border bg-gray-50">
	{#each disp as section}
		<div class="m-2 bg-gray-100 p-2 text-gray-800">
			<button class="w-full text-left text-lg hover:bg-blue-100" on:click={() => expand(section)}>
				<span>
					{#if section.active}
						<span class="text-primary-400">&#9660;</span>
					{:else}
						<span class="text-primary-400">&#9650;</span>
					{/if}
				</span>

				{section.title}
				<span class="text-xs">
					({section.inOrOut})
				</span>
			</button>
			{#if section.active}
				<div class="mb-2 bg-slate-50 px-5 text-sm" transition:slide>
					<p>{section.description}</p>
					<p>{section.inOrOut} - {section.price}</p>
					<p>({section.dimensions}) {section.material}</p>
					<p>{section?.specialRequirements}</p>
					<p>{section?.originalFileName}</p>

					<div
						class="mx-auto mt-10 flex h-60 w-60 flex-col items-center justify-center border-2 border-solid border-slate-200 text-slate-400"
					>
						{#if section?.imageURL}
							<img
								class="h-60 w-60 object-scale-down p-1"
								src={getViewURL(section?.imageURL)}
								alt="Preview"
							/>
						{:else}
							<span>Image Preview</span>
						{/if}
					</div>
				</div>
				{#if showButtons}
					<div class="flex justify-between px-8">
						<button
							on:click={() => dispatch('edit', section.id)}
							class="rounded bg-accent-200 px-7 text-sm text-black shadow-md transition duration-150 ease-in-out hover:bg-accent-300 hover:shadow-lg focus:bg-accent-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-accent-100 active:shadow-lg disabled:opacity-25"
							>Edit</button
						>

						<button
							on:click={() => dispatch('delete', section.id)}
							class="rounded bg-red-600 px-7 text-sm text-white shadow-md transition duration-150 ease-in-out hover:bg-red-300 hover:shadow-lg focus:bg-red-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-100 active:shadow-lg disabled:opacity-25"
							>Delete</button
						>
					</div>
				{/if}
			{/if}
		</div>
	{/each}
</div>
