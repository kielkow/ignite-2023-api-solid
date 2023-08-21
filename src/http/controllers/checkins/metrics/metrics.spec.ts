import { app } from '@/app'
import { afterAll, beforeAll, describe, it } from 'vitest'

describe('METRICS CHECKIN CONTROLLER', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to get user metrics checkin', async () => {})
})
