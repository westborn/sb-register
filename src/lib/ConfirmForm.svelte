<script>
	// accommodation:  $currentRegistration.accommodation,
	// bankAccount:  $currentRegistration.bankAccount,
	// bankAccountName:  $currentRegistration.bankAccountName,
	// bankBSB:  $currentRegistration.bankBSB,
	// bumpIn:  $currentRegistration.bumpIn,
	// bumpOut:  $currentRegistration.bumpOut,
	// confirmation:  $currentRegistration.confirmation,
	// crane:  $currentRegistration.crane,
	// displayRequirements:  $currentRegistration.displayRequirements,
	// email:  $currentRegistration.email,
	// firstName:  $currentRegistration.firstName,
	// firstNations:  $currentRegistration.firstNations,
	// lastName:  $currentRegistration.lastName,
	// phone:  $currentRegistration.phone,
	// postcode:  $currentRegistration.postcode,
	// registrationId:  $currentRegistration.registrationId,
	// timestamp:  $currentRegistration.timestamp,
	// transport:  $currentRegistration.transport,

	import InputText from './InputText.svelte'
</script>

<div>
	<div class="relative mt-8 w-full px-2">
		<div class="mt-8 flex flex-col">
			<legend class="text-gray-600"
				>Indicate when you require the Bump In team to be on hand to assist</legend
			>
			<label>
				<input
					class="form-radio"
					type="radio"
					name="bumpIn"
					value="Thursday morning 7 March"
					checked
				/>
				<span class="ml-1">Thursday morning 7 March</span>
			</label>
			<label>
				<input class="form-radio" type="radio" name="bumpIn" value="Thursday afternoon 7 March" />
				<span class="ml-1">Thursday afternoon 7 March</span>
			</label>
			<label>
				<input
					class="form-radio"
					type="radio"
					name="bumpIn"
					value="Friday morning - until 12.00 pm 8 March"
				/>
				<span class="ml-1">Friday morning - until 12.00 pm 8 March</span>
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
					value="Sunday afternoon from 3.00 pm 17 March"
				/>
				<span class="ml-1">Sunday afternoon from 3.00 pm 17 March</span>
			</label>
			<label>
				<input
					class="form-radio"
					type="radio"
					name="bumpOut"
					value="Monday morning 18 March"
					checked
				/>
				<span class="ml-1">Monday morning 18 March</span>
			</label>
		</div>
	</div>

	<div class="relative mt-8 w-full px-2">
		<div class="flex space-x-6">
			<legend class="text-gray-600">Do you need a Crane?</legend>
			<label>
				<input class="form-radio" type="radio" name="crane" value="Yes" />
				<span class="ml-1">Yes</span>
			</label>
			<label>
				<input class="form-radio" type="radio" name="crane" value="No" checked />
				<span class="ml-1">No</span>
			</label>

			<label>
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

	<div class="relative mt-8 w-full px-2">
		<div class="flex space-x-6">
			<legend class="text-gray-600">Would you like to discuss a Transport subsidy?</legend>
			<label>
				<input class="form-radio" type="radio" name="transport" value="Yes" />
				<span class="ml-1">Yes</span>
			</label>
			<label>
				<input class="form-radio" type="radio" name="transport" value="No" checked />
				<span class="ml-1">No</span>
			</label>
		</div>
	</div>

	<div class="relative mt-8 w-full px-2">
		<div class="flex space-x-6">
			<legend class="text-gray-600">Would you like to discuss an Accommodation subsidy?</legend>
			<label>
				<input class="form-radio" type="radio" name="accommodation" value="Yes" />
				<span class="ml-1">Yes</span>
			</label>
			<label>
				<input class="form-radio" type="radio" name="accommodation" value="No" checked="checked" />
				<span class="ml-1">No</span>
			</label>
		</div>
	</div>

	<div class="relative mt-8 w-full">
		<InputText
			inputFieldID="bankAccountName"
			placeholder="Name on your Bank Account (not your bank's name)"
			requiredField
		/>
	</div>

	<div class="relative mt-8 w-full">
		<InputText
			inputFieldID="bankBSB"
			placeholder="BSB of your Bank Account (not your bank's name)"
			requiredField
		/>
	</div>

	<div class="relative mt-8 w-full">
		<InputText
			inputFieldID="bankAccount"
			placeholder="Account number of your Bank Account"
			requiredField
		/>
	</div>
</div>
