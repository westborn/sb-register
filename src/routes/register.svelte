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

	import { goto } from '$app/navigation'

	function routeToPage(route, replaceState) {
		goto(`/${route}`, { replaceState })
	}
	import FormRegister from '../lib/FormRegister.svelte'
</script>

<section class="container mx-auto max-w-prose px-3">
	<h4 class="mt-6 text-xl font-bold text-primary">Registration for Exhibitor</h4>
	<FormRegister />
</section>
