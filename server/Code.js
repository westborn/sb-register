const CONFIG = {
	ARTIST_REG_SHEET_ID:
		Session.getEffectiveUser().getEmail() === 'george@sculpturebermagui.org.au'
			? '1faNJ7Q2x_a4WO0O919487dDrg_0Ky6Y4xiab8Io0_N0'
			: '1UTEu2_KD7lyNUGIeTqp_5W-fNQuYXAnvTLsx2VvLiyU'
}

/**
 * Display script properties.
 */
function showProperties() {
	console.log(PropertiesService.getScriptProperties().getProperties())
	console.log(CONFIG.ARTIST_REG_SHEET_ID)
}

/**
 * Set script properties for various IDs.
 */
function setIdProperties() {
	const prop = PropertiesService.getScriptProperties()
	wbLib.setProp('entryId', 'Entry24-000', prop)
	wbLib.setProp('registrationId', 'Reg24-000', prop)
	wbLib.setProp('imageId', 'IMG24-000', prop)
	showProperties()
}

/**
 * Handle incoming HTTP requests.
 * Action: String
 *	getDetailsByEmail						(RETURNS full registration)
 *	listRegistrations						(RETURNS email list of all registrations)
 *	createEntry									(RETURNS full registration)
 *	deleteEntry									(RETURNS full registration)
 *	modifyEntry									(RETURNS full registration)
 *	createRegistration					(RETURNS full registration)
 *	modifyRegistration					(RETURNS full registration)
 *	produceRegistrationEmail		(RETURNS full registration)
 *	setRegistrationComplete			(RETURNS full registration)
 *	clearRegistrationComplete		(RETURNS full registration)
 *	completeRegistration				(RETURNS full registration)
 *	createImage									(RETURNS image row)
 *
 *
 *
 * Response (normally)
 *	{result: status, {
 *	  data: {
 *	    registration: registrationArray[0],
 *	    entries: [...entryArray]
 *	  }
 *	 }
 *	}
 * @param {Object} e - HTTP request event object.
 * @returns {Object} - HTTP response.
 */
function doPost(e) {
	console.log(
		`doPost Running as - ${Session.getEffectiveUser().getEmail()} and pointing to ${
			CONFIG.ARTIST_REG_SHEET_ID
		}`
	)

	try {
		const ss = SpreadsheetApp.openById(CONFIG.ARTIST_REG_SHEET_ID)
		const request = JSON.parse(e.postData.contents)
		const result = processRequest(request, ss)
		return result
	} catch (err) {
		console.log(err)
		return sendResponse('error', err)
	}
}

/**
 * Process the request based on the provided action.
 *
 * @param {Object} request - Request object.
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss - Spreadsheet instance.
 * @returns {Object} - Response object.
 */
function processRequest(request, ss) {
	const actions = {
		getDetailsByEmail: getDetailsByEmail,
		listRegistrations: listRegistrations,
		createEntry: createEntry,
		deleteEntry: deleteEntry,
		modifyEntry: modifyEntry,
		createRegistration: createRegistration,
		modifyRegistration: modifyRegistration,
		completeRegistration: completeRegistration,
		clearRegistrationComplete: clearRegistrationComplete,
		setRegistrationComplete: setRegistrationComplete,
		produceRegistrationEmail: produceRegistrationEmail,
		createImage: createImage
	}

	console.log(`Processing action: ${request.action}`)

	if (actions[request.action]) {
		return actions[request.action](request.data, ss)
	} else {
		console.log(request.data)
		return sendResponse('error', 'Unknown Function')
	}
}

function createImage(imageObject, ss) {
	const newImage = {
		imageId: imageObject.imageId,
		entryId: imageObject.entryId,
		imageURL: '',
		imageFileName: imageObject.imageFileName + imageObject.imageId,
		originalFileName: imageObject.originalFileName
	}

	try {
		const imagesFolderName = 'Entry Images'
		const myFolder = wbLib.getMyFolder(ss)
		const imagesFolder = wbLib.checkIfFolderExistElseCreate(myFolder, imagesFolderName)

		const { blob, mimeType } = dataURLtoBlob(imageObject.blobDataURL)
		blob.setName(newImage.imageFileName)

		const fileIterator = imagesFolder.getFilesByName(newImage.imageFileName)
		const fileId = fileIterator.hasNext() ? fileIterator.next().getId() : ''

		const fileClass =
			fileId === ''
				? imagesFolder.createFile(blob)
				: DriveApp.getFileById(
						Drive.Files.update({ title: newImage.imageFileName }, fileId, blob).id
				  )

		newImage.imageURL = `https://drive.google.com/open?id=${fileClass.getId()}`

		const sheet = ss.getSheetByName('Images')
		const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]

		const row = headers.map((key) => newImage[key] || '') // Using the key directly

		sheet.appendRow(row)
	} catch (err) {
		console.log(err)
		return null
	}

	return newImage
}

function modifyImage(imageObject, ss) {
	try {
		const imagesFolderName = 'Entry Images'
		const myFolder = wbLib.getMyFolder(ss)
		const imagesFolder = wbLib.checkIfFolderExistElseCreate(myFolder, imagesFolderName)

		const { blob, mimeType } = dataURLtoBlob(imageObject.blobDataURL)
		blob.setName(imageObject.imageFileName)

		const fileIterator = imagesFolder.getFilesByName(imageObject.imageFileName)
		const fileId = fileIterator.hasNext() ? fileIterator.next().getId() : ''

		const fileClass =
			fileId === ''
				? imagesFolder.createFile(blob)
				: DriveApp.getFileById(
						Drive.Files.update({ title: imageObject.imageFileName }, fileId, blob).id
				  )

		const newImage = {
			imageId: imageObject.imageId,
			entryId: imageObject.entryId,
			imageURL: `https://drive.google.com/open?id=${fileClass.getId()}`,
			imageFileName: imageObject.imageFileName,
			originalFileName: imageObject.originalFileName
		}

		const sheet = ss.getSheetByName('Images')
		const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]

		const rowToChange = wbLib.getRowFromColumnSearch(
			sheet.getDataRange().getValues(),
			'imageId',
			imageObject.imageId
		)

		if (rowToChange) {
			const imageURLColumn = headers.indexOf('imageURL') + 1
			sheet.getRange(rowToChange, imageURLColumn, 1, 1).setValue(newImage.imageURL)

			const originalFileNameColumn = headers.indexOf('originalFileName') + 1
			sheet
				.getRange(rowToChange, originalFileNameColumn, 1, 1)
				.setValue(imageObject.originalFileName)
		}

		return newImage
	} catch (err) {
		console.log(err)
		return null
	}
}

/* // Validates registration data.
// Generates a unique registration ID.
// Appends the registration data to the "Registrations" sheet. */
function createRegistration(request, ss) {
	console.log('createRegistration', request)
	// TODO Validate entry
	if (!request.registrationId || request.registrationId.trim() === '') {
		return sendResponse('error', 'Invalid ID for create')
	}
	//create unique Registration ID
	request.registrationId = bumpId('registrationId')
	try {
		const sheet = ss.getSheetByName('Registrations')
		const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
		const row = headers.map((key) => request[String(key)] || '')
		row.splice(1, 1, new Date())
		sheet.appendRow(row)
		const response = getFullRegistration(request.email, ss)
		return sendResponse('ok', response.data)
	} catch (err) {
		return sendErrorResponse(err)
	}
}

/* Validates modified registration data.
Updates the existing registration on the "Registrations" sheet.
Sends a confirmation email. */
function modifyRegistration(request, ss) {
	console.log('modifyRegistration', request)

	if (!request.registrationId || request.registrationId.trim() === '') {
		return sendResponse('error', 'Invalid ID for modify')
	}
	try {
		const sheet = ss.getSheetByName('Registrations')
		const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
		const row = headers.map((key) => request[String(key)] || '')
		row.splice(1, 1, new Date())
		console.log('modifyRegistration')
		console.log(row)
		const rowToModify = wbLib.getRowFromColumnSearch(
			sheet.getDataRange().getValues(),
			'registrationId',
			request.registrationId
		)
		if (rowToModify) {
			sheet.getRange(rowToModify, 1, 1, row.length).setValues([row])
		}
		const response = getFullRegistration(request.email, ss)
		return sendResponse('ok', response.data)
	} catch (err) {
		return sendErrorResponse(err)
	}
}

/* Calls updateRegistrationConfirmation with 'Complete' as confirmation text.
Sends a registration confirmation email. */
function completeRegistration(request, ss) {
	console.log('completeRegistration', request)
	const { status, data } = updateRegistrationConfirmation(request, ss, 'Complete')
	if (status === 'error') {
		return sendResponse(status, data)
	}
	try {
		// registrationEmail and sendToEmail both set to the artists email address
		sendRegistrationConfirmationEmail(ss, request.email, request.email)
		const response = getFullRegistration(request.email, ss)
		return sendResponse('ok', response.data)
	} catch (err) {
		return sendErrorResponse(err)
	}
}

/* Validates registration ID.
Updates the confirmation status for the specified registration.
Used by completeRegistration, setRegistrationComplete, and clearRegistrationComplete. */
function updateRegistrationConfirmation(request, ss, confirmationText) {
	if (!request.registrationId || request.registrationId.trim() === '') {
		return { status: 'error', data: 'Invalid ID for confirmation' }
	}
	try {
		const sheet = ss.getSheetByName('Registrations')
		const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
		const row = headers.map((key) => request[String(key)] || '')
		row.splice(1, 1, new Date())
		console.log(row)
		const rowToModify = wbLib.getRowFromColumnSearch(
			sheet.getDataRange().getValues(),
			'registrationId',
			request.registrationId
		)
		if (rowToModify) {
			const columnNumber = headers.indexOf('confirmation') + 1
			sheet.getRange(rowToModify, columnNumber, 1, 1).setValue(confirmationText)
		}
		return { status: 'ok', data: '' }
	} catch (err) {
		console.log('updateRegistrationConfirmation', { err })
		return { status: 'error', data: `${err.name} - ${err.message} - ${err.stack}` }
	}
}

/* Calls updateRegistrationConfirmation with 'Complete' or an empty string as confirmation text.
Useful for marking a registration as complete or clearing the completion status. */
function setRegistrationComplete(request, ss) {
	const { status, data } = updateRegistrationConfirmation(request, ss, 'Complete')
	if (status === 'error') {
		return sendResponse(status, data)
	}
	const response = getFullRegistration(request.email, ss)
	return sendResponse('ok', response.data)
}
function clearRegistrationComplete(request, ss) {
	const { status, data } = updateRegistrationConfirmation(request, ss, '')
	if (status === 'error') {
		return sendResponse(status, data)
	}
	const response = getFullRegistration(request.email, ss)
	return sendResponse('ok', response.data)
}

/* Sends a registration confirmation email without modifying the confirmation status. */
function produceRegistrationEmail(request, ss) {
	try {
		sendRegistrationConfirmationEmail(ss, request.registrationEmail, request.sendToEmail)
		const response = getFullRegistration(request.email, ss)
		return sendResponse('ok', response.data)
	} catch (err) {
		return sendErrorResponse(err)
	}
}

/* Validates entry data.
Appends the entry data to the "Entries" sheet.
Calls createImage to associate an image with the entry. */
function createEntry(data, ss) {
	// TODO Validate entry

	const newEntry = data.newEntry
	newEntry['price'] = Number(newEntry['price'].toString().replace(/[^0-9\.]+/g, ''))
	const newImage = data.newImage
	newEntry.entryId = bumpId('entryId')
	try {
		const sheet = ss.getSheetByName('Entries')
		const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
		const row = headers.map((key) => newEntry[String(key)] || '')
		sheet.appendRow(row)
	} catch (err) {
		console.log(err)
		return null
	}
	//we've added the entry - now add the image
	// entryId, originalFileName, email, blobDataURL, imageFileName: artistSurname_title_
	newImage.entryId = newEntry.entryId
	newImage.imageId = bumpId('imageId')
	const res = createImage(newImage, ss)
	console.log('image created', res)
	const response = getFullRegistration(newEntry.email, ss)
	return sendResponse('ok', response.data)
}

/* Deletes an entry and its associated image based on the entry ID. */
function deleteEntry(request, ss) {
	console.log('deleteEntry', request)
	if (!request.entryId || request.entryId.trim() === '') {
		return sendResponse('error', 'Invalid ID for delete')
	}
	try {
		//delete the Entry
		const sheetEntry = ss.getSheetByName('Entries')
		const rowToDeleteEntry = wbLib.getRowFromColumnSearch(
			sheetEntry.getDataRange().getValues(),
			'entryId',
			request.entryId
		)
		if (rowToDeleteEntry) {
			sheetEntry.deleteRow(rowToDeleteEntry)
		}

		//delete associated Image
		const sheetImage = ss.getSheetByName('Images')
		const rowToDeleteImage = wbLib.getRowFromColumnSearch(
			sheetImage.getDataRange().getValues(),
			'imageId',
			request.imageId
		)
		if (rowToDeleteImage) {
			sheetImage.deleteRow(rowToDeleteImage)
		}

		const response = getFullRegistration(request.email, ss)
		return sendResponse('ok', response.data)
	} catch (err) {
		return sendErrorResponse(err)
	}
}

/* Modifies an existing entry on the "Entries" sheet.
Calls modifyImage if the entry has an associated image. */
function modifyEntry(request, ss) {
	console.log('modifyEntry', request)

	if (!request.entryId || request.entryId.trim() === '') {
		return sendResponse('error', 'Invalid ID for modify')
	}
	try {
		const sheet = ss.getSheetByName('Entries')
		const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
		request['price'] = Number(request['price'].toString().replace(/[^0-9\.]+/g, ''))
		const row = headers.map((key) => request[String(key)] || '')
		console.log('modifyEntry')
		console.log(row)
		const rowToModify = wbLib.getRowFromColumnSearch(
			sheet.getDataRange().getValues(),
			'entryId',
			request.entryId
		)
		if (rowToModify) {
			sheet.getRange(rowToModify, 1, 1, row.length).setValues([row])
		}

		//now see if we need to update the image associated
		if (request.image) {
			try {
				modifyImage(request.image, ss)
			} catch (err) {
				return sendErrorResponse(err)
			}
		}

		const response = getFullRegistration(request.email, ss)
		return sendResponse('ok', response.data)
	} catch (err) {
		return sendErrorResponse(err)
	}
}

/* Sends a detailed registration confirmation email.
Uses getFullRegistration and makeRegistrationHTML/makeEntriesHTML to construct email content. */
function sendRegistrationConfirmationEmail(
	ss = SpreadsheetApp.openById(CONFIG.ARTIST_REG_SHEET_ID),
	registrationEmail,
	sendToEmail
) {
	const {
		data: { registration: registrationData },
		data: { entries: entriesData }
	} = getFullRegistration(registrationEmail, ss)

	const registrationHTML = makeRegistrationHTML(registrationData)
	const entriesHTML = makeEntriesHTML(entriesData)
	const costOfRegistration = 20 + entriesData.length * 20
	const numberOfEntries = entriesData.length === 1 ? `1 entry` : `${entriesData.length} entries`
	const headerHTML = `<p style="color: #1d4ed8; font-size: 30px;"> <br/>
   <img src="https://sculpturebermagui.org.au/wp-content/uploads/elementor/thumbs/SB-Logo-Small-q0ysuqmz4ozty2yo55sd6c4ag2ola7wghep8h8s5aa.png" width="200">
   <br/>
   Registration for ${registrationData.firstName} ${registrationData.lastName} (${registrationData.registrationId})</p>
      <p style="color: #1d4ed8; font-size: 18px;">Your registration of ${numberOfEntries} has a total fee of $${costOfRegistration}</p>
    `

	const htmlBody = headerHTML + registrationHTML + '<hr>' + entriesHTML

	GmailApp.sendEmail(sendToEmail, 'Registration confirmation for Sculpture Bermagui', 'body text', {
		htmlBody,
		replyTo: 'curator@sculpturebermagui.org.au'
	})
}
/* Generates HTML for displaying registration details in an email. */
function makeRegistrationHTML(registrationData) {
	const regFields = [
		['Email', 'email'],
		['Phone', 'phone'],
		['Postcode', 'postcode'],
		['Bank Account', 'bankAccountName'],
		['BSB', 'bankBSB'],
		['Account', 'bankAccount'],
		['Transport', 'transport'],
		['Accommodation', 'accommodation'],
		['Crane', 'crane'],
		['Bump In', 'bumpIn'],
		['Bump Out', 'bumpOut'],
		['Requirements', 'displayRequirements']
	]

	const registrationHTML = `
  <table style="font-family:\'Arial\';border-collapse:collapse;border-spacing:0;"><tbody>
  ${makeTableRows(regFields, registrationData)}
  </tbody></table>
  `
	return registrationHTML
}

/* Generates HTML for displaying registration details in an email. */
function makeEntriesHTML(entriesData) {
	const entryFields = [
		['Indoor/Outdoor', 'inOrOut'],
		['Entry Title', 'title'],
		['Entry Description', 'description'],
		['Material', 'material'],
		['Dimensions', 'dimensions'],
		['Special Requirements', 'specialRequirements'],
		['Enter Major Prize', 'enterMajorPrize']
	]
	const priceField = [['Price', 'price']]

	const entryHTML = entriesData
		.map(
			(entry, idx) =>
				`
  <hr>
  <p style="color: #1d4ed8; font-size: 20px;">Entry # ${idx + 1}<br/>
  <table style="font-family:\'Arial\';border-collapse:collapse;border-spacing:0;"><tbody>
	${makeTableRows(entryFields, entry)}
  ${makeTableRows(priceField, {
		price: entry.price.toLocaleString('en-AU', {
			style: 'currency',
			currency: 'AUD'
		})
	})}
  </tbody></table>
  <br/>
  <img src="${getViewURL(entry.images[0].imageURL)}" width="200">
  <br/>
  `
		)
		.join('')

	return entryHTML
}
/* Generates HTML table rows based on field-value pairs. */
function makeTableRows(fields, data) {
	return fields
		.map(
			([name, value]) => `
    <tr>
    <td style="width:150px;border-style:none;text-align:left;padding-right:2px;padding-left:2px;background-color:#ffffff;color:#1d4ed8;" >
    ${name}
    </td>
    <td style="width:450px;border-style:none;text-align:left;padding-right:2px;padding-left:2px;background-color:#ffffff;color:#111827;" >
    ${data[value]}
    </td>
    </tr>
  `
		)
		.join('')
}

/* Retrieves registration information based on email. */
function getDetailsByEmail({ email }, ss) {
	if (!email || email.trim() === '') {
		return sendResponse('error', 'No email provided or invalid email address')
	}
	//now get the registration and all entries
	const response = getFullRegistration(email, ss)
	return sendResponse('ok', response.data)
}

/* Retrieves the email address of each registration. */
function listRegistrations(request, ss) {
	var registrationSheet = ss.getSheetByName('Registrations')
	const registrationData = registrationSheet.getDataRange().getValues()
	const allRegistrations = wbLib.getJsonArrayFromData(registrationData)
	const emailArray = allRegistrations.map((item) => item.email)
	return sendResponse('ok', emailArray)
}

/* Retrieves full registration information (including entries) for a given email address. */
function getFullRegistration(email, ss) {
	var registrationArray = getRegistrationByEmail(email, ss)
	if (typeof registrationArray !== 'undefined' && registrationArray.length !== 1) {
		return { data: { registration: {}, entries: [] } }
	}
	var entryArray = getEntriesByEmail(email, ss)
	return {
		data: { registration: registrationArray[0], entries: [...entryArray] }
	}
}

/* Retrieves registration information based on email. */
function getRegistrationByEmail(email, ss) {
	var registrationSheet = ss.getSheetByName('Registrations')
	const registrationData = registrationSheet.getDataRange().getValues()
	const allRegistrations = wbLib.getJsonArrayFromData(registrationData)
	var res = allRegistrations.filter((item) => item.email === email)
	return res
}

/* Retrieves entry information (including associated images) based on email. */
function getEntriesByEmail(email, ss) {
	const entrySheet = ss.getSheetByName('Entries')
	const entryData = entrySheet.getDataRange().getValues()
	const allEntries = wbLib.getJsonArrayFromData(entryData)

	const imageSheet = ss.getSheetByName('Images')
	const imageData = imageSheet.getDataRange().getValues()
	const allImages = wbLib.getJsonArrayFromData(imageData)

	// just the entries for the email we have
	const entriesForThisEmail = allEntries.filter((entry) => entry.email === email)

	// get the images linked with the entry id
	const entries = entriesForThisEmail.map((entry) => {
		const images = allImages.filter((imageItem) => imageItem.entryId === entry.entryId)
		return { ...entry, images }
	})

	// console.log(JSON.stringify(entries,null,2))
	return entries
}

function sendResponse(status, data) {
	try {
		return ContentService.createTextOutput(
			JSON.stringify({ result: status, data: data })
		).setMimeType(ContentService.MimeType.JSON)
	} catch (err) {
		console.log(err)
		return ContentService.createTextOutput(
			JSON.stringify({ result: 'error', data: err })
		).setMimeType(ContentService.MimeType.JSON)
	}
}

function sendErrorResponse(err) {
	console.log(err)
	return sendResponse('error', `${err.name} - ${err.message} - ${err.stack}`)
}

//**dataURL to blob**
function dataURLtoBlob(dataurl) {
	const arr = dataurl.split(',')
	const mimeType = arr[0].match(/:(.*?);/)[1]
	const myBlob = Utilities.base64Decode(arr[1])
	return {
		blob: Utilities.newBlob(myBlob, mimeType),
		mimeType
	}
}

/**
 * IDs are stored in a script property store using library functions
 *
 * ID is of the form 'xyzzy-nnn'
 * xyzzy can be any string  (not containing hyphen)
 * nnn is incrmented by 1
 *
 *
 * @param idType:String (registrationId | entryId | imageId)
 * @returns id:String
 *
 */
function bumpId(idType) {
	const prop = PropertiesService.getScriptProperties()
	const currentId = wbLib.getProp(idType, prop)
	let [frontPart, id] = currentId.split(/[/-]/)
	//increment the id part by 1 and zero fill to 3 chars
	const newId = (parseInt(id, 10) + 1).toString().padStart(3, '0')
	wbLib.setProp(idType, `${frontPart}-${newId}`, prop)
	return `${frontPart}-${newId}`
}

function getIdFromUrl(url) {
	return url.match(/[-\w]{25,}(?!.*[-\w]{25,})/)
}

function getViewURL(url) {
	return `https://drive.google.com/uc?export=view&id=${getIdFromUrl(url)}`
}
