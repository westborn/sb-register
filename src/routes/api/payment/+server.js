import { json } from '@sveltejs/kit'
import { ApiError, Client } from 'square'
import { randomUUID } from 'crypto'
import { SECRET_SQUARE_ACCESS_TOKEN, SECRET_SQUARE_ENVIRONMENT } from '$env/static/private'

BigInt.prototype.toJSON = function () {
	return this.toString()
}

const { paymentsApi } = new Client({
	accessToken: SECRET_SQUARE_ACCESS_TOKEN,
	environment: SECRET_SQUARE_ENVIRONMENT
})

export async function POST({ request }) {
	const { locationId, sourceId, amount, email, note, reference_id } = await request.json()
	try {
		const { result } = await paymentsApi.createPayment({
			locationId,
			sourceId,
			idempotencyKey: randomUUID(),
			amountMoney: {
				amount: amount,
				currency: 'AUD'
			},
			buyerEmailAddress: email,
			note,
			reference_id,
			statement_description_identifier: 'Sculpture Fee'
		})
		console.log('Result from createPayment: ', { result })
		return json(result)
	} catch (err) {
		// TODO - log more concise payment errors
		// if (err instanceof ApiError) {
		// 	console.log('yep, apierror:')
		// 	console.log(err.errors[0].detail)
		// }
		console.log('error after POST to api/payment')
		console.log(err.statusCode, JSON.stringify(err?.result, null, 4))
		const data = JSON.stringify(err.errors, null, 4)
		const myOptions = { status: 400, statusText: 'It was NOT good!' }
		const myResponse = new Response(data, myOptions)
		return myResponse
	}
}
