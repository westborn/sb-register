import { writable } from 'svelte/store'

export const currentUserEmail = writable(null)
export const currentEntry = writable(null)

export const errorStatus = writable('')
export const errorMessage = writable('')
