import { json as json$1 } from '@sveltejs/kit'
import { SECRET_AUTH_KEY } from '$env/static/private'

export async function POST({ request }) {
	const data = await request.json()
	console.log('squareClient Server ', { data })

	return json$1({
		message: 'Response from squareClient',
		key: SECRET_AUTH_KEY
	})
}

// const response = await fetch(googleWebAppUrl, {
//   method: 'POST',
//   headers: { 'Content-Type': 'text/plain' },
//   body: JSON.stringify(data)
// })
// const res = await response.json()
