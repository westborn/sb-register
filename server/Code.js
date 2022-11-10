// set production or test spreadsheet ID

this.CONFIG = {
	ARTIST_REG_SHEET_ID:
		Session.getActiveUser().getEmail() === 'george@sculpturebermagui.org.au'
			? '1faNJ7Q2x_a4WO0O919487dDrg_0Ky6Y4xiab8Io0_N0'
			: '1oLkmfsFswLvI5gGubiAI9TMcx4eQh_L6GQu1p3Lr4AY'
}

function doPost(e) {
	// API Construction

	// Action: String
	//     getDetailsByEmail
	//     createEntry
	//     deleteEntry
	//     modifyEntry
	//     createRegistration
	//     modifyRegistration
	//     createImage
	//
	// Data: various Objects
	//
	// Response
	//   {result: status, {
	//     data: {
	//       registration: registrationArray[0],
	//       entries: [...entryArray]
	//     }
	//    }
	//   }

	try {
		const ss = SpreadsheetApp.openById(CONFIG.ARTIST_REG_SHEET_ID)
		const request = JSON.parse(e.postData.contents)
		var result
		switch (request.action) {
			case 'getDetailsByEmail':
				result = getInformationForEmailAddress(request.data.email, ss)
				break
			case 'createEntry':
				result = createEntry(request.data, ss)
				break
			case 'deleteEntry':
				result = deleteEntry(request.data, ss)
				break
			case 'modifyEntry':
				result = modifyEntry(request.data, ss)
				break
			case 'createRegistration':
				result = createRegistration(request.data, ss)
				break
			case 'modifyRegistration':
				result = modifyRegistration(request.data, ss)
				break
			case 'completeRegistration':
				result = completeRegistration(request.data, ss)
				break
			case 'createImage':
				result = createImage(request.data, ss)
				break
			default:
				console.log(request.data)
				result = sendResponse('error', 'Unknown Function')
				break
		}
	} catch (err) {
		console.log(err)
		result = sendResponse('error', err)
	}
	return result
}

function createImage(imageObject, ss) {
	const newImage = {
		imageId: imageObject.imageId,
		entryId: imageObject.entryId,
		imageURL: '',
		imageFileName: imageObject.imageFileName + imageObject.imageId,
		originalFileName: imageObject.originalFileName
	}

	// TODO Validate image
	try {
		const imagesFolderName = 'Entry Images'
		// establish the image folder id
		const myFolder = wbLib.getMyFolder(ss)
		const imagesFolder = wbLib.checkIfFolderExistElseCreate(myFolder, imagesFolderName)
		// make a named blob from the dataURL from the user
		const { blob, mimeType } = dataURLtoBlob(imageObject.blobDataURL)
		blob.setName(newImage.imageFileName)
		// determine if an image file currently exists
		const fileIterator = imagesFolder.getFilesByName(newImage.imageFileName)
		const fileId = fileIterator.hasNext() ? fileIterator.next().getId() : ''
		console.log('fileId', fileId)
		// either create a file or update the existing one
		const fileClass =
			fileId === ''
				? imagesFolder.createFile(blob)
				: DriveApp.getFileById(
						Drive.Files.update({ title: newImage.imageFileName }, fileId, blob).id
				  )
		// get the URL to the image file
		newImage.imageURL = `https://drive.google.com/open?id=${fileClass.getId()}`

		const sheet = ss.getSheetByName('Images')
		const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]

		// // update the entry row
		// const rowToChange = wbLib.getRowFromColumnSearch(sheet.getDataRange().getValues(), "imageId", imageId)
		// if (rowToChange) {
		//   // update columns - imageURL, originalFileName
		//   imageURLColumn = headers.indexOf('imageURL') + 1
		//   sheet.getRange(rowToChange, imageURLColumn).setValues(newImage.imageURL)

		//   originalFileNameColumn = headers.indexOf('originalFileName') + 1
		//   sheet.getRange(rowToChange, imageURLColumn).setValues(imageObject.originalFileName)
		// }

		const row = headers.map((key) => newImage[String(key)] || '')
		sheet.appendRow(row)
	} catch (err) {
		console.log(err)
		return null
	}
	return newImage
}

function modifyImage(imageObject, ss) {
	const newImage = {
		imageId: imageObject.imageId,
		entryId: imageObject.entryId,
		imageURL: imageObject.imageURL,
		imageFileName: imageObject.imageFileName,
		originalFileName: imageObject.originalFileName
	}

	// TODO Validate image
	try {
		const imagesFolderName = 'Entry Images'
		// establish the image folder id
		const myFolder = wbLib.getMyFolder(ss)
		const imagesFolder = wbLib.checkIfFolderExistElseCreate(myFolder, imagesFolderName)
		// make a named blob from the dataURL from the user
		const { blob, mimeType } = dataURLtoBlob(imageObject.blobDataURL)
		blob.setName(newImage.imageFileName)
		// determine if an image file currently exists
		const fileIterator = imagesFolder.getFilesByName(newImage.imageFileName)
		const fileId = fileIterator.hasNext() ? fileIterator.next().getId() : ''
		console.log('fileId', fileId)
		// either create a file or update the existing one
		const fileClass =
			fileId === ''
				? imagesFolder.createFile(blob)
				: DriveApp.getFileById(
						Drive.Files.update({ title: newImage.imageFileName }, fileId, blob).id
				  )
		// get the URL to the image file
		newImage.imageURL = `https://drive.google.com/open?id=${fileClass.getId()}`

		const sheet = ss.getSheetByName('Images')
		const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]

		// update the entry row
		const rowToChange = wbLib.getRowFromColumnSearch(
			sheet.getDataRange().getValues(),
			'imageId',
			imageObject.imageId
		)
		if (rowToChange) {
			// update columns - imageURL, originalFileName
			const imageURLColumn = headers.indexOf('imageURL') + 1
			sheet.getRange(rowToChange, imageURLColumn, 1, 1).setValue(newImage.imageURL)

			const originalFileNameColumn = headers.indexOf('originalFileName') + 1
			sheet
				.getRange(rowToChange, originalFileNameColumn, 1, 1)
				.setValue(imageObject.originalFileName)
		}
	} catch (err) {
		console.log(err)
		return null
	}
	return newImage
}

function createRegistration(request, ss) {
	console.log('createRegistration', request)
	// TODO Validate entry
	if (!request.registrationId || request.registrationId.trim() === '') {
		return sendResponse('error', 'Invalid ID for create')
	}
	//create unique Regsitration ID
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

function completeRegistration(request, ss) {
	console.log('completeRegistration', request)

	if (!request.registrationId || request.registrationId.trim() === '') {
		return sendResponse('error', 'Invalid ID for complete')
	}
	try {
		const sheet = ss.getSheetByName('Registrations')
		const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
		const row = headers.map((key) => request[String(key)] || '')
		row.splice(1, 1, new Date())
		console.log('completeRegistration')
		console.log(row)
		const rowToModify = wbLib.getRowFromColumnSearch(
			sheet.getDataRange().getValues(),
			'registrationId',
			request.registrationId
		)
		if (rowToModify) {
			const columnNumber = headers.indexOf('confirmation') + 1
			sheet.getRange(rowToModify, columnNumber, 1, 1).setValue('Complete')
		}
		sendRegistrationConfirmationEmail(ss, request.email)
		const response = getFullRegistration(request.email, ss)
		return sendResponse('ok', response.data)
	} catch (err) {
		return sendErrorResponse(err)
	}
}

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

function sendRegistrationConfirmationEmail(
	ss = SpreadsheetApp.openById(CONFIG.ARTIST_REG_SHEET_ID),
	email = 'george@westborn.com.au'
) {
	const {
		data: { registration: registrationData },
		data: { entries: entriesData }
	} = getFullRegistration(email, ss)
	const registrationHTML = makeRegistrationHTML(registrationData)
	const entriesHTML = makeEntriesHTML(entriesData)
	const costOfRegistration = 20 + entriesData.length * 20
	const numberOfEntries = entriesData.length === 1 ? `1 entry` : `${entriesData.length} entries`
	const headerHTML = ` <p style="color: #1d4ed8; font-size: 30px;">Registration for ${registrationData.firstName} ${registrationData.lastName} (${registrationData.registrationId})</p>
      <p style="color: #1d4ed8; font-size: 18px;">Your registration of ${numberOfEntries} has a total fee of $${costOfRegistration}</p>
    `

	const htmlBody = headerHTML + registrationHTML + '<hr>' + entriesHTML

	GmailApp.sendEmail(
		registrationData.email,
		'Registration confirmation for Sculpture Bermagui',
		'body text',
		{
			htmlBody,
			replyTo: 'curator@sculpturebermagui.org.au'
		}
	)
}

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

function getInformationForEmailAddress(email, ss) {
	if (!email || email.trim() === '') {
		return sendResponse('error', 'No email provided or invalid email address')
	}
	//now get the registration and all entries
	const response = getFullRegistration(email, ss)
	return sendResponse('ok', response.data)
}

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

function getRegistrationByEmail(email, ss) {
	var registrationSheet = ss.getSheetByName('Registrations')
	const registrationData = registrationSheet.getDataRange().getValues()
	const allRegistrations = wbLib.getJsonArrayFromData(registrationData)
	var res = allRegistrations.filter((item) => item.email === email)
	return res
}

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
