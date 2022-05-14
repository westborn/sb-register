<script>
	// firstName
	// lastName
	// email
	// phone
	// postcode
	// installation
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
		<InputText inputFieldID="firstName" placeholder="Your First Name" />
	</div>

	<div class="relative mt-8 w-full">
		<InputText inputFieldID="lastName" placeholder="Surname" />
	</div>

	<div class="relative mt-8 w-full">
		<InputText inputFieldID="phone" placeholder="Phone" />
	</div>

	<div class="relative mt-8 w-full">
		<InputText inputFieldID="email" placeholder="Email Address" />
	</div>

	<div class="relative mt-8 w-full">
		<InputText inputFieldID="postcode" placeholder="Postcode" />
	</div>

	<div class="relative mt-8 w-full">
		<InputText inputFieldID="installation" placeholder="Any Installation requirements?" />
	</div>
	<div class="relative mt-8 w-full">
		<InputText inputFieldID="deinstallation" placeholder="Any De-Installation requirements?" />
	</div>
	<div class="relative mt-8 w-full">
		<InputText inputFieldID="crane" placeholder="Is a crane required?" />
	</div>
	<div class="relative mt-8 w-full">
		<InputText
			inputFieldID="displayRequirements"
			placeholder="Any special requirememnst for the display area"
		/>
	</div>
	<div class="relative mt-8 w-full">
		<InputText inputFieldID="bankAccountName" placeholder="Name on your Bank Account" />
	</div>
	<div class="relative mt-8 w-full">
		<InputText inputFieldID="bankBSB" placeholder="BSB of your Bank Account" />
	</div>
	<div class="relative mt-8 w-full">
		<InputText inputFieldID="bankAccount" placeholder="Account number of your Bank Account" />
	</div>
	<div class="relative mt-8 w-full">
		<InputText inputFieldID="transport" placeholder="Transport Required?" />
	</div>
	<div class="relative mt-8 w-full">
		<InputText inputFieldID="accommodation" placeholder="Accomodation Required?" />
	</div>
	<div class="relative mt-8 w-full">
		<InputText
			inputFieldID="confirmation"
			placeholder="I confirm all this information is correct!"
		/>
	</div>
</div>
