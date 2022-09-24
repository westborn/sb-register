import { writable } from 'svelte/store'

const currentUserEmail = writable(null)
const currentRegistration = writable(null)

const stepsAllowed = writable(true)

const entryStore = (() => {
	const state = []
	const { subscribe, set, update } = writable(state)
	const methods = {
		createEntry(data) {
			console.log('data: ', data)
			update((state) => {
				state = state.concat(data)
				console.log('added to data: ', state)
				return state
			})
		},
		modifyEntry(data) {
			update(
				(state) =>
					(state = state.map((entry) => (entry.id !== data.id ? { ...entry } : { ...data })))
			)
			console.log('updated in store: ', state)
			return state
		},
		deleteEntry(id) {
			console.log(id)
			update((state) => state.filter((item) => item.id !== id))
		}
	}

	return {
		subscribe,
		set,
		update,
		...methods
	}
})()

export { currentUserEmail, currentRegistration, entryStore, stepsAllowed }
