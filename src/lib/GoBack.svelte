<script>
	import { goto } from '$app/navigation'

	export let stepTitle
	function routeToPage(route, replaceState) {
		goto(`/${route}`, { replaceState })
	}
</script>

<div class="flex items-center justify-between">
	<h4 class="text-xl font-bold text-primary">
		{stepTitle}
	</h4>
	<!-- <button
		type="button"
		on:click={() => routeToPage('')}
		class="rounded-md bg-primary-300 px-5 py-1 text-sm font-semibold text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-400 hover:shadow-lg focus:bg-primary-400 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
		>Quit
	</button> -->

	<button
		on:click={() => routeToPage('')}
		type="button"
		class="inline-block rounded bg-gray-300 px-6 py-2.5 text-xs font-semibold text-gray-500 shadow-md transition duration-150 ease-in-out hover:bg-gray-400 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-400 active:shadow-lg"
		>Quit</button
	>
</div>
