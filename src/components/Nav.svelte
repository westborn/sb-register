<script>
	const menuText = [
		{
			text: 'Home',
			href: '/home'
		},
		{
			text: 'About',
			href: '/aboutus'
		},
		{
			text: 'Support',
			href: '/support-us'
		},
		{
			text: '2022',
			href: '/program-2'
		},
		{
			text: 'Gallery',
			href: '/gallery-2'
		},
		{
			text: 'For the Artist',
			href: '/artists-information'
		},
		{
			text: 'For the Buyer',
			href: '/buyer-information'
		},
		{
			text: 'Contact',
			href: '/contact-1'
		}
	];

	let hamburgerMenuOpen = false;
</script>

<nav class="bg-primary">
	<!-- Hamburger Modal Menu -->
	<div
		class:hidden={!hamburgerMenuOpen}
		class="absolute z-50 h-screen w-screen bg-gray-300/30"
		on:click={() => (hamburgerMenuOpen = !hamburgerMenuOpen)}
	>
		<!-- Vertical Menu -->
		<aside class="absolute top-0 right-16 bg-gray-300/50 shadow-2xl">
			<ul class="flex flex-col bg-primary p-4 text-lg text-gray-800">
				{#each menuText as item}
					<li class="mr-3">
						<a
							class="block p-2 text-left font-bold uppercase text-white no-underline hover:text-accent md:text-sm"
							href={`https://sculpturebermagui.org.au${item.href}`}>{item.text}</a
						>
					</li>
				{/each}
			</ul>
		</aside>
	</div>

	<!-- Desktop Menu -->
	<div class="flex h-16 justify-between">
		<a class="px-6" href="https://sculpturebermagui.org.au/home">
			<img
				alt="Sculpture Bermagui"
				src="https://sculpturebermagui.org.au/wp-content/uploads/2021/02/sculpture-bermagui-logo-2021.png"
				width="80"
			/>
		</a>
		<button
			type="button"
			on:click={() => (hamburgerMenuOpen = !hamburgerMenuOpen)}
			class="ml-3  inline-flex items-center rounded-lg p-2 text-sm text-gray-100 hover:bg-gray-300 hover:text-primary focus:outline-none focus:ring-0 focus:ring-gray-200 lg:hidden"
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
		<div class="hidden w-full pt-2 md:w-1/2  md:justify-end lg:flex ">
			<ul class="list-reset flex flex-1 items-center justify-between md:flex-none">
				{#each menuText as item}
					<li class="mr-3">
						<a
							class="inline-block px-2 font-bold uppercase text-white no-underline hover:text-accent md:text-sm"
							href={`https://sculpturebermagui.org.au${item.href}`}>{item.text}</a
						>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</nav>
