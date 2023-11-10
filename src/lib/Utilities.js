function getIdFromUrl(url) {
	return url.match(/[-\w]{25,}(?!.*[-\w]{25,})/)
}
export function getViewURL(url) {
	return `https://drive.google.com/uc?export=view&id=${getIdFromUrl(url)}`
}

// from https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
export function validateEmail(inputText) {
	var mailformat =
		/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	if (inputText.match(mailformat)) {
		return true
	} else return false
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
	switch (lastStatus.status) {
		case 400:
			msg = JSON.stringify(lastStatus.response)
			break
		case 404:
			if (lastStatus.response) {
				msg = lastStatus.response
			} else {
				msg = `${lastStatus.statusText} - ${lastStatus.url}`
			}
			break
		case 500:
			msg = JSON.parse(lastStatus.response).message
			break
		default:
			msg = JSON.stringify(lastStatus)
			break
	}
	if (msg) {
		console.error(msg)
	}
	return msg
}

export function processResponse(response) {
	// Copy reponse properties to lastStatus properties
	apiResponse.lastStatus.ok = response.ok
	apiResponse.lastStatus.status = response.status
	apiResponse.lastStatus.statusText = response.statusText
	apiResponse.lastStatus.url = response.url

	if (apiResponse.lastStatus.ok) {
		return response.json()
	} else {
		return response.text()
	}
}
