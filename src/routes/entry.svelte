<!-- email: "",
title: null,
price: null,
inOrOut: "Indoor",
material: null,
size: null,
description: null,
specialReqs: null,
placement: null,
originalFileName: null,
fileContents: null -->

<section class="container mx-auto max-w-prose px-3">
	<h4 class="mt-6 text-xl font-bold text-primary">Add an Entry</h4>

	<div class="relative mt-6 w-full">
		<input
			id="title"
			name="title"
			type="text"
			class="peer h-10 w-full rounded-md border-gray-300 placeholder-transparent focus:border-primary-50 focus:outline-none"
			placeholder="Your first name"
		/>
		<label
			for="title"
			class="absolute left-2 -top-5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600"
			>Title for this work</label
		>
	</div>

	<div class="relative mt-6 w-full px-2">
		<legend class="text-gray-600">Entry Category</legend>
		<div class="mt-1">
			<label class="inline-flex items-center">
				<input class="form-radio" type="radio" checked name="radio-direct" value="Outdoor" />
				<span class="ml-2">Outdoor</span>
			</label>
		</div>
		<div>
			<label class="inline-flex items-center">
				<input class="form-radio" type="radio" name="radio-direct" value="Indoor" />
				<span class="ml-2">Indoor</span>
			</label>
		</div>
	</div>

	<div class="relative mt-6 w-full">
		<input
			id="price"
			name="price"
			type="text"
			class="peer h-10 w-full rounded-md border-gray-300 placeholder-transparent focus:border-primary-50 focus:outline-none"
			placeholder="Your first name"
		/>
		<label
			for="price"
			class="absolute left-2 -top-5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600"
			>Price</label
		>
	</div>

	<div class="relative mt-6 w-full">
		<input
			id="material"
			name="material"
			type="text"
			class="peer h-10 w-full rounded-md border-gray-300 placeholder-transparent focus:border-primary-50 focus:outline-none"
			placeholder="someone@gmail.com"
		/>
		<label
			for="material"
			class="absolute left-2 -top-5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600"
			>Material used in this piece</label
		>
	</div>

	<div class="relative mt-6 w-full">
		<input
			id="size"
			name="size"
			type="text"
			class="peer h-10 w-full rounded-md border-gray-300 placeholder-transparent focus:border-primary-50 focus:outline-none"
			placeholder="someone@gmail.com"
		/>
		<label
			for="size"
			class="absolute left-2 -top-5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600"
			>Size of this piece (W x L x H in cm or m)</label
		>
	</div>

	<div class="relative mt-6 w-full">
		<input
			id="description"
			name="description"
			type="text"
			class="peer h-10 w-full rounded-md border-gray-300 placeholder-transparent focus:border-primary-50 focus:outline-none"
			placeholder="someone@gmail.com"
		/>
		<label
			for="description"
			class="absolute left-2 -top-5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600"
			>Description for the catalogue (25 words)</label
		>
	</div>

	<div class="relative mt-6 w-full">
		<input
			id="specialRequirements"
			name="specialRequirements"
			type="text"
			class="peer h-10 w-full rounded-md border-gray-300 placeholder-transparent focus:border-primary-50 focus:outline-none"
			placeholder="Your first name"
		/>
		<label
			for="specialRequirements"
			class="absolute left-2 -top-5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600"
			>Any Special Requirements</label
		>
	</div>

	<div class="relative mt-6 w-full">
		<input
			id="placement"
			name="placement"
			type="text"
			class="peer h-10 w-full rounded-md border-gray-300 placeholder-transparent focus:border-primary-50 focus:outline-none"
			placeholder="Your first name"
		/>
		<label
			for="placement"
			class="absolute left-2 -top-5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-600"
			>Placement</label
		>
	</div>

	<button
		type="button"
		class="mt-4 inline-block rounded bg-primary-400 px-7 py-3 font-semibold  uppercase text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-500 hover:shadow-lg focus:bg-primary-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-200 active:shadow-lg"
		>Add this Entry</button
	>
</section>
