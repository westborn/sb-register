<script>
	// email
	// bumpIn
	// deinstallation
	// crane
	// displayRequirements
	// bankAccountName
	// bankBSB
	// bankAccount
	// transport
	// accommodation
	// confirmation

	import InputText from './InputText.svelte'
</script>

<div>
	<div class="relative mt-8 w-full">
		<InputText inputFieldID="email" placeholder="Email Address" requiredField />
	</div>

	<div class="relative mt-8 w-full px-2">
		<div class="flex flex-col">
			<legend class="text-gray-600"
				>Indicate when you require the Bump In team to be on hand to assist</legend
			>
			<label>
				<input class="form-radio" type="radio" name="bumpIn" value="Thursday morning 3 March" />
				<span class="ml-1">Thursday morning 2 March</span>
			</label>
			<label>
				<input class="form-radio" type="radio" name="bumpIn" value="Thursday afternoon 3 March" />
				<span class="ml-1">Thursday afternoon 2 March</span>
			</label>
			<label class="inline-flex items-center">
				<input
					class="form-radio"
					type="radio"
					name="bumpIn"
					value="Friday morning - till 12.00 pm 4 March"
				/>
				<span class="ml-1">Friday morning - till 12.00 pm 3 March</span>
			</label>
		</div>
	</div>

	<div class="relative mt-8 w-full px-2">
		<div class="flex flex-col">
			<legend class="text-gray-600"
				>Indicate when you require the Bump Out team to be on hand to assist.<br /> (If work/s not sold)</legend
			>
			<label>
				<input
					class="form-radio"
					type="radio"
					name="bumpOut"
					value="Monday afternoon from 3.00 pm 14 March"
				/>
				<span class="ml-1">Monday afternoon from 3.00 pm 13 March</span>
			</label>
			<label>
				<input class="form-radio" type="radio" name="bumpOut" value="Tuesday morning 15 March" />
				<span class="ml-1">Tuesday morning 14 March</span>
			</label>
			<label class="inline-flex items-center">
				<input class="form-radio" type="radio" name="bumpOut" value="Tuesday afternoon 15 March" />
				<span class="ml-1">Tuesday afternoon 14 March</span>
			</label>
		</div>
	</div>

	<div class="relative mt-8 w-full px-2">
		<div class="flex space-x-6">
			<legend class="text-gray-600">Is a Crane Required?</legend>
			<label>
				<input class="form-radio" type="radio" name="crane" value="Yes" />
				<span class="ml-1">Yes</span>
			</label>
			<label>
				<input class="form-radio" type="radio" checked name="crane" value="No" />
				<span class="ml-1">No</span>
			</label>

			<label class="inline-flex items-center">
				<input class="form-radio" type="radio" name="crane" value="Maybe" />
				<span class="ml-1">Maybe</span>
			</label>
		</div>
	</div>

	<div class="relative mt-8 w-full">
		<InputText
			inputFieldID="displayRequirements"
			placeholder="Any special requirements for the display area"
		/>
	</div>
	<div class="relative mt-8 w-full">
		<InputText
			inputFieldID="bankAccountName"
			placeholder="Name on your Bank Account"
			requiredField
		/>
	</div>
	<div class="relative mt-8 w-full">
		<InputText inputFieldID="bankBSB" placeholder="BSB of your Bank Account" requiredField />
	</div>
	<div class="relative mt-8 w-full">
		<InputText
			inputFieldID="bankAccount"
			placeholder="Account number of your Bank Account"
			requiredField
		/>
	</div>

	<div class="relative mt-8 w-full px-2">
		<div class="flex space-x-6">
			<legend class="text-gray-600">Transport Required?</legend>
			<label>
				<input class="form-radio" type="radio" name="transport" value="Yes" />
				<span class="ml-1">Yes</span>
			</label>
			<label>
				<input class="form-radio" type="radio" checked name="transport" value="No" />
				<span class="ml-1">No</span>
			</label>

			<label class="inline-flex items-center">
				<input class="form-radio" type="radio" name="transport" value="Maybe" />
				<span class="ml-1">Maybe</span>
			</label>
		</div>
	</div>
	<div class="relative mt-8 w-full px-2">
		<div class="flex space-x-6">
			<legend class="text-gray-600">Accommodation Required?</legend>
			<label>
				<input class="form-radio" type="radio" name="accommodation" value="Yes" />
				<span class="ml-1">Yes</span>
			</label>
			<label>
				<input class="form-radio" type="radio" checked name="accommodation" value="No" />
				<span class="ml-1">No</span>
			</label>

			<label class="inline-flex items-center">
				<input class="form-radio" type="radio" name="accommodation" value="Maybe" />
				<span class="ml-1">Maybe</span>
			</label>
		</div>
	</div>
	<div class="relative mt-8 w-full">
		<InputText
			inputFieldID="confirmation"
			placeholder="I confirm all this information is correct!"
		/>
	</div>
</div>
