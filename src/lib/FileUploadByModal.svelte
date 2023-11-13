<script>
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	import Modal, { getModal } from '$lib/Modal.svelte'
	import FileUpload from '$lib/FileUpload.svelte'

	//image information to pass up when an image is selected
	let imageRes = null

	function setImageDetails(e) {
		if (e.detail) {
			imageRes = { image: e.detail.image, imageFileName: e.detail.fileName }
		} else {
			imageRes = null
		}
	}
	function setSelection(res) {
		// console.log(`setSelection ${res} - ${imageRes?.imageFileName}`)
		if (res === 'ok' && imageRes?.imageFileName) {
			dispatch('fileUploadReplace', { fileName: imageRes.imageFileName, image: imageRes.image })
		} else {
			// console.log('setSelection why?')
			dispatch('fileUploadReplace', null)
		}
	}
</script>

<div class="mt-6 flex items-center justify-center">
	<button
		on:click={() => {
			imageRes = null
			getModal('replaceImage').open(setSelection)
		}}
		class="inline-block rounded bg-gray-300 px-6 py-2.5 text-xs font-semibold text-gray-500 shadow-md transition duration-150 ease-in-out hover:bg-gray-400 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-400 active:shadow-lg"
		>Replace Image?</button
	>
</div>

<Modal id="replaceImage">
	<div class="mx-auto flex flex-col items-center justify-center">
		<FileUpload on:fileUpload={setImageDetails} />
	</div>
	<div class="mt-6 flex items-center justify-center">
		<button
			on:click={() => getModal('replaceImage').close('ok')}
			class="inline-block rounded bg-gray-300 px-6 py-2.5 text-xs font-semibold text-gray-500 shadow-md transition duration-150 ease-in-out hover:bg-gray-400 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-400 active:shadow-lg"
			>OK, use this Image</button
		>
	</div></Modal
>
