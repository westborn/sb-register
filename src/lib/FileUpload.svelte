<script>
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	let input
	let image
	let showImage = false
	let imageContent

	function onChange() {
		// no file chosen OR current file is changed to none
		if (input.files.length === 0) {
			dispatch('fileUpload', null)
		}
		const file = input.files[0]
		if (file) {
			const reader = new FileReader()
			reader.addEventListener('load', function () {
				imageContent = reader.result
				image.setAttribute('src', imageContent)
				dispatch('fileUpload', { fileName: file.name, image: imageContent })
			})
			reader.readAsDataURL(file)
			showImage = true
			return
		}
		showImage = false
	}
</script>

<section class="mt-6">
	<div class="flex flex-col ">
		<div class="">
			<label for="formFile" class="form-label inline-block text-lg font-bold text-primary"
				>Choose an Image for this entry</label
			>
			<input
				type="file"
				id="formFile"
				name="formFile"
				accept="image/*"
				bind:this={input}
				on:change={onChange}
				class="form-control block
          w-full
          rounded
          border
          border-solid
          border-gray-300
          bg-white bg-clip-padding
          px-3 py-1.5 text-base
          font-normal
          transition
          ease-in-out
          focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
			/>
		</div>
	</div>
	<div class="mt-10 flex h-60 w-60 flex-col border-2 border-solid border-slate-200 text-slate-400">
		{#if showImage}
			<img class="h-60 w-60 object-scale-down p-1" bind:this={image} src="" alt="Preview" />
		{:else}
			<span>Image Preview</span>
		{/if}
	</div>
</section>
