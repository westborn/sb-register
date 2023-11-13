<script>
	import Modal, { getModal } from '$lib/Modal.svelte'
	import FileUpload from '$lib/FileUpload.svelte'

	//image information to pass up when an image is selected
	let imageRes = { image: {}, imageFileName: {} }

	function setImageDetails(e) {
		imageRes = { image: e.detail.image, imageFileName: e.detail.fileName }
		// console.log(`Image File: ${imageRes.imageFileName}`)
	}
</script>

<div>
	<h2>Very Simple Modal Component</h2>
	<p>This is Upload</p>

	<div class="mt-6 flex items-center justify-center">
		<button
			on:click={() => getModal('first').open()}
			class="inline-block rounded bg-gray-300 px-6 py-2.5 text-xs font-semibold text-gray-500 shadow-md transition duration-150 ease-in-out hover:bg-gray-400 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-400 active:shadow-lg"
			>Replace Image?</button
		>
	</div>

	<Modal id="first">
		<div class="mx-auto flex flex-col items-center justify-center">
			<FileUpload on:fileUpload={setImageDetails} />
		</div>
		<div class="mt-6 flex items-center justify-center">
			<button
				on:click={() => getModal('first').close()}
				class="inline-block rounded bg-gray-300 px-6 py-2.5 text-xs font-semibold text-gray-500 shadow-md transition duration-150 ease-in-out hover:bg-gray-400 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-400 active:shadow-lg"
				>OK, use this Image</button
			>
		</div>
	</Modal>
</div>
