<script>
	import InputText from './InputText.svelte'
</script>

<div>
	<div class="relative mt-6 w-full">
		<InputText nameAndId="firstName" placeholder="Your first name" />
	</div>

	<div class="relative mt-6 w-full">
		<InputText nameAndId="lastName" placeholder="Surname" />
	</div>

	<div class="relative mt-6 w-full">
		<InputText nameAndId="phone" placeholder="Phone" />
	</div>

	<div class="relative mt-6 w-full">
		<InputText nameAndId="email" placeholder="Email Address" />
	</div>

	<div class="relative mt-6 w-full">
		<InputText nameAndId="postcode" placeholder="Postcode" />
	</div>

	<button
		type="button"
		class="mt-4 inline-block rounded bg-primary-400 px-7 py-3 font-semibold  uppercase text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
		>Add Entries</button
	>
</div>
