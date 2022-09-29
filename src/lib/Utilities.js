function getIdFromUrl(url) {
	return url.match(/[-\w]{25,}(?!.*[-\w]{25,})/)
}
export function getViewURL(url) {
	return `https://drive.google.com/uc?export=view&id=${getIdFromUrl(url)}`
}
