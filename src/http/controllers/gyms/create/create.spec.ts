import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { createAuthenticateUser } from '@/utils/test/create-authenticate-user'

describe('CREATE GYM CONTROLLER', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create gym', async () => {
		const { token } = await createAuthenticateUser(app, true)

		const response = await request(app.server)
			.post('/gyms')
			.send({
				title: 'Gym',
				description: 'Muscle Gym Pro',
				phone: '7070-7070',
				latitude: -27.2092052,
				longitude: -49.6401091,
			})
			.set('Authorization', `Bearer ${token}`)

		expect(response.statusCode).toEqual(201)
	})
})
