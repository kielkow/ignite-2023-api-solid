import { app } from '@/app'
import { afterAll, beforeAll, describe, it } from 'vitest'

describe('HISTORY CHECKIN CONTROLLER', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to get user history checkin', async () => {})
})
