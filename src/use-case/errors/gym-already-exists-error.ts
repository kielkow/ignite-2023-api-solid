export class GymAlreadyExistsError extends Error {
	constructor() {
		super('Title already exists.')
	}
}
