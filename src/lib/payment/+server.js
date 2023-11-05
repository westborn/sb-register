import { json } from '@sveltejs/kit'
import { Client } from 'square'
import { randomUUID } from 'crypto'
import { SECRET_SQUARE_ACCESS_TOKEN } from '$env/static/public'

const { paymentsApi } = new Client({
	accessToken: SECRET_SQUARE_ACCESS_TOKEN,
	environment: 'sandbox'
})

export async function POST({ request }) {
	const { locationId, sourceId } = await request.json()
	// try {
	// 	const { result } = await paymentsApi.createPayment({
	// 		locationId,
	// 		sourceId,
	// 		idempotencyKey: randomUUID(),
	// 		amountMoney: {
	// 			amount: 100,
	// 			currency: 'AUD'
	// 		}
	// 	})
	// 	console.log(result)
	// 	return json(result)
	// } catch (error) {
	// 	console.log(error)
	// }
	throw new Error({ message: `submitting payment for ${locationId}` })
}
