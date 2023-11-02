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
	// lastName:  $currentRegistration.lastName,
	// phone:  $currentRegistration.phone,
	// postcode:  $currentRegistration.postcode,
	// registrationId:  $currentRegistration.registrationId,
	// timestamp:  $currentRegistration.timestamp,
	// transport:  $currentRegistration.transport,

	import InputText from './InputText.svelte'
</script>

<div>
	<div class="relative mt-8 w-full">
		<InputText inputFieldID="firstName" placeholder="Your First Name" requiredField />
	</div>

	<div class="relative mt-8 w-full">
		<InputText inputFieldID="lastName" placeholder="Surname" requiredField />
	</div>

	<div class="relative mt-8 w-full">
		<InputText inputFieldID="phone" placeholder="Phone" />
	</div>

	<div class="relative mt-8 w-full">
		<InputText inputFieldID="postcode" placeholder="Postcode" />
	</div>

	<div class="relative mt-8 w-full px-2">
		<div class="flex flex-col space-x-6">
			<legend class="text-gray-600"
				>Are you of Aboriginal and/or Torres Strait Islander origin?</legend
			>
			<label>
				<input class="form-radio" type="radio" name="firstNations" value="Yes" />
				<span class="ml-1">Yes</span>
			</label>
			<label>
				<input class="form-radio" type="radio" name="firstNations" value="No" checked />
				<span class="ml-1">No</span>
			</label>

			<label>
				<input class="form-radio" type="radio" name="firstNations" value="Declined" />
				<span class="ml-1">Prefer not to say</span>
			</label>
		</div>
	</div>
</div>
