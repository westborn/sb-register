import { json } from '@sveltejs/kit'
import { Client } from 'square'
import { randomUUID } from 'crypto'
import { SECRET_SQUARE_ACCESS_TOKEN } from '$env/static/private'

BigInt.prototype.toJSON = function () {
	return this.toString()
}

const { paymentsApi } = new Client({
	accessToken: SECRET_SQUARE_ACCESS_TOKEN,
	environment: 'sandbox'
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
		console.log('error after POST to api/payment')
		console.log(err.statusCode, JSON.stringify(err, null, 4))
		const data = JSON.stringify(err.errors, null, 4)
		const myOptions = { status: 400, statusText: 'It was NOT good!' }
		const myResponse = new Response(data, myOptions)
		return myResponse
	}
}
