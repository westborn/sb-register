import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {}
}

/** @type {import('./$types').Actions} */
export const actions = {
	enteredCC: async ({ request }) => {
		console.log('enteredCC action', request.url)
		throw redirect(303, '/view')
	}
}
