<script>
	// Some ideas from this post - http://quicknuggets.com/react/reusable-stepper-with-react-and-tailwindcss/
	export let steps = [],
		currentActive = 1
	let circles, progress

	export const handleProgress = (stepIncrement) => {
		circles = document.querySelectorAll('.circle')
		if (stepIncrement == 1) {
			currentActive++

			if (currentActive > circles.length) {
				currentActive = circles.length
			}
		} else {
			currentActive--

			if (currentActive < 1) {
				currentActive = 1
			}
		}

		update()
	}

	function update() {
		circles.forEach((circle, idx) => {
			if (idx < currentActive) {
				circle.classList.add('active')
			} else {
				circle.classList.remove('active')
			}
		})

		const actives = document.querySelectorAll('.active')

		progress.style.width = ((actives.length - 1) / (circles.length - 1)) * 100 + '%'
	}
</script>

<div
	class="relative z-10 mb-8 flex w-80 content-between before:absolute before:left-0 before:top-1/2 before:h-4"
	bind:this={circles}
>
	<div class="absolute top-1/2 left-0 h-4 w-0 bg-slate-400" bind:this={progress} />
	{#each steps as step, i}
		<div
			class="pointer flex h-8 w-8 content-center items-center rounded-full border-2 border-red-500 bg-white text-gray-800 after:absolute after:mb-8 after:text-green-600 {i ==
			0
				? 'active'
				: ''}"
			data-title={step}
		>
			{i + 1}
		</div>
	{/each}
</div>
