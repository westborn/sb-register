<script>
	// Some ideas from this post - http://quicknuggets.com/react/reusable-stepper-with-react-and-tailwindcss/
	export let steps
	// 	currentActive = 1
	// let circles, progress
</script>

<!-- container -->
<div class="flex items-center justify-between p-4">
	{#each steps as step, index}
		<div class="flex  items-center {index != steps.length - 1 ? 'w-full' : ''}">
			<div class="relative flex flex-col items-center text-teal-600 ">
				<div
					class="flex h-12 w-12 flex-col items-center justify-center rounded-full border-4 border-gray-300 text-red-600 transition duration-500 ease-in-out"
				>
					<!-- number of steps -->
					{index + 1}
				</div>
				<div
					class="absolute top-0 mt-12	w-32 text-center text-xs font-medium uppercase text-lime-400 "
				>
					<!-- Disply Description -->
					{step}
				</div>
			</div>
			<!-- Line between -->
			<div class=" flex-auto border-t-4 border-gray-300 transition duration-500 ease-in-out" />
		</div>
	{/each}
</div>
