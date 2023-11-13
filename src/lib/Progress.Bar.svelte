<script>
	import { onMount } from 'svelte'

	// Some ideas from this post - http://quicknuggets.com/react/reusable-stepper-with-react-and-tailwindcss/
	export let steps
	export let currentActive

	let stepsState = []

	onMount(() => {
		// console.log(steps)
		stepsState = steps.map((step, index) => {
			const stepObj = {}
			stepObj.description = step
			stepObj.completed = false
			stepObj.highlighted = index === 0 ? true : false
			stepObj.selected = index === 0 ? true : false
			return stepObj
		})
	})

	function updateStep(stepNumber, stepsState) {
		const newSteps = [...stepsState]
		let stepCounter = 0
		while (stepCounter < newSteps.length) {
			//current step
			if (stepCounter === stepNumber) {
				newSteps[stepCounter] = {
					...newSteps[stepCounter],
					highlighted: true,
					selected: true,
					completed: false
				}
				stepCounter++
			}
			// Past step
			else if (stepCounter < stepNumber) {
				newSteps[stepCounter] = {
					...newSteps[stepCounter],
					highlighted: false,
					selected: true,
					completed: true
				}
				stepCounter++
			}
			// Future steps
			else {
				newSteps[stepCounter] = {
					...newSteps[stepCounter],
					highlighted: false,
					selected: false,
					completed: false
				}
				stepCounter++
			}
		}
		return newSteps
	}

	$: displaySteps = updateStep(currentActive, stepsState)
</script>

<!-- <pre>{currentActive}</pre> -->
<!-- <pre>{JSON.stringify(displaySteps, null, 2)}</pre> -->

<!-- container -->
<div class="flex items-center justify-between p-4">
	{#each displaySteps as step, index}
		<div class="flex items-center {index != steps.length - 1 ? 'w-full' : ''}">
			<div class="relative flex flex-col items-center">
				<!-- number of steps in a circle -->
				<div
					class="flex h-12 w-12 flex-col items-center justify-center rounded-full border-4 border-gray-300 font-semibold text-gray-600 transition duration-500 ease-in-out
					{step.highlighted ? 'rounded-lg' : ''}
					{step.selected ? 'border-primary-400 bg-primary-50 font-bold text-white' : ''}"
				>
					{#if step.completed}
						<span class="text-xl font-bold text-white">✓</span>
					{:else}
						{index + 1}
					{/if}
				</div>
				<!-- Display Description under the circle -->
				<div
					class="font- absolute top-0 mt-14 w-32 text-center text-xs font-semibold uppercase
					{step.highlighted ? 'text-gray-900' : 'text-gray-400'}"
				>
					{step.description}
				</div>
			</div>
			<!-- Line between circles-->
			<div
				class=" flex-auto border-t-4 transition duration-500 ease-in-out
			{index < currentActive ? 'border-primary-400' : 'border-gray-300'}"
			/>
		</div>
	{/each}
</div>
