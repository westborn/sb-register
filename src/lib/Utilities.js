function getIdFromUrl(url) {
	return url.match(/[-\w]{25,}(?!.*[-\w]{25,})/)
}

//This may have been deprecated by Google on/about 12-Jan-2024
export function getViewURL(url) {
	return `https://drive.google.com/uc?export=view&id=${getIdFromUrl(url)}`
}
//This seems to now work - but who knows for how long?
export function getThumbnailURL(url) {
	return `https://drive.google.com/thumbnail?id=${getIdFromUrl(url)}`
}

//This wasa recommended by google - using an iframe
// It doesn't work due to CORS issues!!
export function getIframeURL(url) {
	return `https://drive.google.com/file/d/${getIdFromUrl(url)}/preview`
}

//This wasa recommended by google - using an iframe
// It doesn't work due to CORS issues!!
export function getLienucURL(url) {
	return `https://drive.lienuc.com/uc?id=${getIdFromUrl(url)}`
}

// from https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
export function validateEmail(inputText) {
	var mailformat =
		/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	if (inputText.match(mailformat)) {
		return true
	} else return false
}

export function isNumeric(str) {
	if (typeof str === 'number') return true
	if (typeof str != 'string') return false // we only process strings!
	return (
		!isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
		!isNaN(parseFloat(str))
	) // ...and ensure strings of whitespace fail
}

export let apiResponse = {
	lastStatus: {
		ok: true,
		status: 200,
		statusText: 'OK',
		url: ''
	}
}

export function handleUnexpectedError(error) {
	let msg = 'A network error has occurred. Check the apiUrl property to ensure it is set correctly.'
	console.error(error + ' - ' + msg)
	return msg
}

export function handleError(lastStatus) {
	let msg = ''
	// console.log(lastStatus.status)
	switch (lastStatus.status) {
		case 400:
			msg = lastStatus.response[0] || 'something bad happened!'
			break
		case 404:
			console.log(404)
			if (lastStatus.response) {
				msg = lastStatus.response
			} else {
				msg = `${lastStatus.statusText} - ${lastStatus.url}`
			}
			break
		case 500:
			console.log(500)
			msg = JSON.parse(lastStatus.response).message
			break
		default:
			console.log('default')
			msg = JSON.stringify(lastStatus)
			break
	}
	return msg
}

export async function processResponse(response) {
	// console.log('processResponse commence:')
	// Copy reponse properties to lastStatus properties
	apiResponse.lastStatus.ok = response.ok
	apiResponse.lastStatus.status = response.status
	apiResponse.lastStatus.statusText = response.statusText
	apiResponse.lastStatus.url = response.url

	// console.log(apiResponse)
	if (apiResponse.lastStatus.ok || apiResponse.lastStatus.status === 400) {
		return await response.json()
	} else {
		return await response.text()
	}
}
