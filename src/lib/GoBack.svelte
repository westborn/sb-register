<script>
	import { goto } from '$app/navigation'

	export let stepTitle
</script>

<div class="flex items-center justify-between">
	<h4 class="text-xl font-bold text-primary">
		{stepTitle}
	</h4>

	<button
		on:click={() => goto('/')}
		type="button"
		class="inline-block rounded bg-gray-300 px-6 py-2.5 text-xs font-semibold text-gray-500 shadow-md transition duration-150 ease-in-out hover:bg-gray-400 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-400 active:shadow-lg"
		>Quit</button
	>
</div>
