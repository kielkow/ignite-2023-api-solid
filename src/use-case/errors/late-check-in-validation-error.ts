export class LateCheckInValidationError extends Error {
	constructor() {
		super('Not be able to check-in after 20 minutos of its creation.')
	}
}
