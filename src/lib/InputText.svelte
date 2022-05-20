<script>
	export let inputFieldID
	export let placeholder
	export let requiredField = false
</script>

<div>
	<input
		id={inputFieldID}
		name={inputFieldID}
		type="text"
		class="peer h-8 w-full rounded-md border-gray-300 placeholder-transparent focus:border-primary-50 focus:outline-none"
		{placeholder}
	/>
	<label
		for={inputFieldID}
		class="absolute left-2 -top-4 text-xs text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-gray-600"
		>{placeholder}

		{#if requiredField}<span
				class="after:ml-0.5 after:text-sm after:text-red-500 after:content-['*'] "
			/>
		{/if}
	</label>
</div>
