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

	import InputText from './InputText.svelte'
</script>

<div>
	<div class="relative mt-8 w-full">
		<InputText inputFieldID="title" placeholder="Title for this entry" />
	</div>

	<div class="relative mt-8 w-full px-2">
		<legend class="text-gray-600">Entry Category</legend>
		<div class="mt-1">
			<label class="inline-flex items-center">
				<input class="form-radio" type="radio" checked name="radio-direct" value="Outdoor" />
				<span class="ml-2">Outdoor</span>
			</label>
		</div>
		<div>
			<label class="inline-flex items-center">
				<input class="form-radio" type="radio" name="radio-direct" value="Indoor" />
				<span class="ml-2">Indoor</span>
			</label>
		</div>
	</div>

	<div class="relative mt-8 w-full">
		<InputText inputFieldID="price" placeholder="Price" />
	</div>

	<div class="relative mt-8 w-full">
		<InputText inputFieldID="material" placeholder="Material used in this piece" />
	</div>

	<div class="relative mt-8 w-full">
		<InputText inputFieldID="dimensions" placeholder="Size of this piece (L x W x H)" />
	</div>

	<div class="relative mt-8 w-full">
		<InputText inputFieldID="description" placeholder="Description for the catalogue (25 words)" />
	</div>

	<div class="relative mt-8 w-full">
		<InputText inputFieldID="specialRequirements" placeholder="Any special requirements?" />
	</div>

	<div class="relative mt-8 w-full">
		<InputText inputFieldID="originalFileName" placeholder="File to Upload (TODO)" />
	</div>

	<button
		type="button"
		class="mt-8 inline-block rounded bg-primary-400 px-7 py-3 font-semibold  uppercase text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
		>Add Entry</button
	>
</div>
