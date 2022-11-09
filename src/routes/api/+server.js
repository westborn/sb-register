import { json as json$1 } from '@sveltejs/kit'
const googleWebAppUrl =
	'https://script.google.com/macros/s/AKfycbxADPJ6zMfUQPhPeSsI9tyWWpIKlGXQltQW1-asjXjdgu-0hCbaYno-RSWpJ9_uw2V-/exec'

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
