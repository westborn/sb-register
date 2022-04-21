<script>
	export let inputFieldID
	export let placeholder
</script>

<div>
	<input
		id={inputFieldID}
		name={inputFieldID}
		type="text"
		class="peer h-10 w-full rounded-md border-gray-300 placeholder-transparent focus:border-primary-50 focus:outline-none"
		{placeholder}
	/>
	<label
		for={inputFieldID}
		class="absolute left-2 -top-5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600"
		>{placeholder}</label
	>
</div>
