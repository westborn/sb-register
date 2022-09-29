<script>
	// firstName
	// lastName
	// email
	// phone
	// postcode
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
</div>
