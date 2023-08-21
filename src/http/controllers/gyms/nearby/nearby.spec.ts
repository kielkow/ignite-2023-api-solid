import { app } from '@/app'
import { afterAll, beforeAll, describe, it } from 'vitest'

describe('NEARBY GYMS CONTROLLER', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to nearby gyms', async () => {})
})
