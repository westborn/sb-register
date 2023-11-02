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
