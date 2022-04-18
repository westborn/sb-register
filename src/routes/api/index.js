const googleWebAppUrl =
	'https://script.google.com/macros/s/AKfycby2JsrlG5KMf0TzSVRssn0qvJejDIvXX_mM7Pj5t88NymCCiSepmu-s5H_7TP5MNEJl_A/exec'

// fetch a post request to the google sheet backend web app
// use the search param to determine which function to call on the backend
// fetch has to be a stringified json object and text/plain to avoid CORS issues

export async function post({ request }) {
	const data = await request.json()

	var requestType
	try {
		const url = new URL(request.url)
		requestType = url.searchParams.get('requestType')
	} catch (err) {
		requestType = 'notFound'
	}

	const fetchUrl = `${googleWebAppUrl}?requestType=${requestType}`

	const response = await fetch(fetchUrl, {
		method: 'POST',
		headers: { 'Content-Type': 'text/plain' },
		body: JSON.stringify(data)
	})
	const res = await response.json()
	return { body: res }
}
