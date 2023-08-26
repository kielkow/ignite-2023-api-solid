import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { createAuthenticateUser } from '@/utils/test/create-authenticate-user'

describe('NEARBY GYMS CONTROLLER', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to list nearby gyms', async () => {
		const { token } = await createAuthenticateUser(app, true)

		await request(app.server)
			.post('/gyms')
			.send({
				title: 'Temple Gym',
				description: 'Muscle Gym Pro',
				phone: '7070-7070',
				latitude: -27.2092052,
				longitude: -49.6401091,
			})
			.set('Authorization', `Bearer ${token}`)

		await request(app.server)
			.post('/gyms')
			.send({
				title: 'Contest Gym',
				description: 'Muscle Gym Pro',
				phone: '7171-7171',
				latitude: 0,
				longitude: 0,
			})
			.set('Authorization', `Bearer ${token}`)

		const response = await request(app.server)
			.get('/gyms/nearby')
			.query({
				latitude: -27.2092052,
				longitude: -49.6401091,
			})
			.set('Authorization', `Bearer ${token}`)

		expect(response.statusCode).toEqual(200)
		expect(response.body.gyms).toHaveLength(1)
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: 'Temple Gym',
			}),
		])
	})
})
