<script>
	// title
	// price
	// inOrOut
	// material
	// dimensions
	// description
	// specialRequirements

	import InputText from './InputText.svelte'
</script>

<div>
	<div class="relative mt-8 w-full">
		<InputText inputFieldID="title" placeholder="Title for this entry" requiredField />
	</div>

	<div class="relative mt-8 w-full px-2">
		<legend class="text-gray-600">Entry Category</legend>
		<div class="mt-1">
			<label class="inline-flex items-center">
				<input class="form-radio" type="radio" checked name="inOrOut" value="Outdoor" />
				<span class="ml-2">Outdoor</span>
			</label>
		</div>
		<div>
			<label class="inline-flex items-center">
				<input class="form-radio" type="radio" name="inOrOut" value="Indoor" />
				<span class="ml-2">Indoor</span>
			</label>
		</div>
	</div>

	<div class="relative mt-8 w-full">
		<InputText inputFieldID="price" placeholder="Price" requiredField />
	</div>

	<div class="relative mt-8 w-full">
		<InputText inputFieldID="material" placeholder="Material used in this piece" />
	</div>

	<div class="relative mt-8 w-full">
		<InputText inputFieldID="dimensions" placeholder="Size of this piece (L x W x H)" />
	</div>

	<div class="relative mt-8 w-full">
		<textarea
			id="description"
			name="description"
			rows="3"
			class="peer w-full rounded-md border-gray-300 placeholder-transparent focus:border-primary-50 focus:outline-none"
			placeholder="Description for the catalogue (25 words)"
		/>
		<label
			for="description"
			class="absolute left-2 -top-4 text-xs text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-gray-600"
			>Description for the catalogue (25 words)<span
				class="after:ml-0.5 after:text-sm after:text-red-500 after:content-['*'] "
			/></label
		>
	</div>

	<div class="relative mt-8 w-full">
		<InputText inputFieldID="specialRequirements" placeholder="Any special requirements?" />
	</div>
</div>
