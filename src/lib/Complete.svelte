<script>
	import { currentUserEmail, currentRegistration, entryStore } from '$lib/stores.js'
	import GoBack from '$lib/GoBack.svelte'
</script>

<GoBack stepTitle="Complete the Registration for - {$currentRegistration.email}" />
