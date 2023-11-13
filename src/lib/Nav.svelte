<script>
	const menuText = [
		{
			text: 'Home',
			href: '/'
		},
		{
			text: '2023 Exhibition',
			href: '/2023-2'
		},
		{
			text: 'Become a Sponsor',
			href: '/sponsor'
		},
		{
			text: 'Volunteer',
			href: '/volunteer'
		},
		{
			text: 'Gallery',
			href: '/gallery'
		},
		{
			text: 'About',
			href: '/about'
		},
		{
			text: 'Contact',
			href: '/contact'
		}
	]

	let hamburgerMenuOpen = false
</script>

<nav>
	<!-- Hamburger Modal Menu -->
	<div>
		<button
			type="button"
			class:hidden={!hamburgerMenuOpen}
			class="absolute z-50 h-screen w-screen bg-gray-500/30"
			on:click={() => (hamburgerMenuOpen = !hamburgerMenuOpen)}
		>
			<!-- Vertical Menu -->
			<aside class="absolute top-0 right-16 bg-gray-300/50 shadow-2xl">
				<ul class="flex flex-col bg-white p-4 text-lg text-gray-800">
					{#each menuText as item}
						<li class="mr-3">
							<a
								class="block p-2 text-left text-primary-300 no-underline hover:text-accent md:text-sm"
								href={`https://sculpturebermagui.org.au${item.href}`}>{item.text}</a
							>
						</li>
					{/each}
				</ul>
			</aside>
		</button>
	</div>

	<!-- Desktop Menu -->
	<div class="flex h-16 justify-between">
		<button
			type="button"
			aria-label="Mobile Menu"
			on:click={() => (hamburgerMenuOpen = !hamburgerMenuOpen)}
			class="ml-3 inline-flex items-center rounded-lg p-2 text-sm text-gray-400 hover:bg-gray-100 hover:text-primary focus:outline-none focus:ring-0 focus:ring-gray-200 lg:hidden"
		>
			<svg
				class:hidden={hamburgerMenuOpen}
				class="h-8 w-8"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
					clip-rule="evenodd"
				/></svg
			>
			<svg
				class:hidden={!hamburgerMenuOpen}
				class=" h-8 w-8"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
					clip-rule="evenodd"
				/></svg
			>
		</button>

		<!-- Horizontal menu -->
		<div class="ml-10 hidden w-auto lg:flex">
			<ul class="list-reset flex flex-1 items-center justify-between md:flex-none">
				{#each menuText as item}
					<li class="mr-1">
						<a
							class="inline-block px-2 text-base font-semibold text-primary-300 no-underline hover:text-accent"
							href={`https://sculpturebermagui.org.au${item.href}`}>{item.text}</a
						>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</nav>
