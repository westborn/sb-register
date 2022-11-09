import { json as json$1 } from '@sveltejs/kit'
const googleWebAppUrl =
	'https://script.google.com/macros/s/AKfycbyNmOoZjkfN9w3-dEH4E0GupbASgwl8-7Rv6kgz0jHHqE7kKeBYKsxFl4ELTdwnrtM4/exec'

// send a post request to the google sheet backend web app
// use the search param to determine which function to call on the backend
// fetch has to be a stringified json object and text/plain to avoid CORS issues

export async function POST({ request }) {
	const data = await request.json()
	// console.log(data)

	const response = await fetch(googleWebAppUrl, {
		method: 'POST',
		headers: { 'Content-Type': 'text/plain' },
		body: JSON.stringify(data)
	})
	const res = await response.json()
	return json$1(res)
}
