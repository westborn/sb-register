<script>
	export let nameAndId
	export let placeholder
</script>

<div>
	<input
		id={nameAndId}
		name={nameAndId}
		type="text"
		class="peer h-10 w-full rounded-md border-gray-300 placeholder-transparent focus:border-primary-50 focus:outline-none"
		{placeholder}
	/>
	<label
		for={nameAndId}
		class="absolute left-2 -top-5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600"
		>{placeholder}</label
	>
</div>
