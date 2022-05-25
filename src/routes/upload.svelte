<!-- Special thanks to Dcode for this tutorial: https://youtu.be/VElnT8EoEEM -->
<script>
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	import { createForm } from 'felte'

	//get all the functions and data from felte form
	const {
		form,
		data: formData,
		reset: formReset,
		setFields
	} = createForm({
		onSubmit: (values, context) => {
			console.log(`submit - id:${values.id}`)
			// console.log(JSON.stringify(values, null, 2))
			// console.log(JSON.stringify(context, null, 2))
		}
	})
	let input
	let image
	let showImage = false
	let imageContent

	function onChange() {
		const file = input.files[0]

		if (file) {
			showImage = true

			const reader = new FileReader()
			reader.addEventListener('load', function () {
				imageContent = reader.result
				image.setAttribute('src', imageContent)
				console.log(file)
			})
			reader.readAsDataURL(file)

			return
		}
		showImage = false
	}
</script>

<section class="container mx-auto">
	<div class="flex flex-col items-center justify-center">
		<form use:form>
			<div class="mb-3 max-w-lg">
				<label for="formFile" class="form-label mb-2 inline-block text-lg font-bold text-primary"
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
		</form>
	</div>
	<div
		class="mx-auto mt-10 flex h-60 w-60 flex-col items-center justify-center border-2 border-solid border-slate-200 text-slate-400"
	>
		{#if showImage}
			<img class="h-60 w-60 object-scale-down p-1" bind:this={image} src="" alt="Preview" />
		{:else}
			<span>Image Preview</span>
		{/if}
	</div>
	<div class="mx-auto flex flex-col items-center justify-center">
		{#if showImage}
			<button
				on:click={() => {
					dispatch('selectedImage', { fileName: input.files[0].name, image: imageContent })
				}}
				type="submit"
				class="mt-8  inline-block rounded bg-primary-400 px-7 py-3 font-semibold  uppercase text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
				>Yes, select this image</button
			>{/if}
		<button
			on:click={() => dispatch('cancel')}
			type="submit"
			class="mt-8  inline-block rounded bg-primary-400 px-7 py-3 font-semibold  uppercase text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
			>Cancel</button
		>
	</div>
</section>
<pre>{JSON.stringify($formData, null, 2)}</pre>
