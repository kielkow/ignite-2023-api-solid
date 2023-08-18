import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('CREATE CONTROLLER', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create gym', async () => {
		await request(app.server).post('/users').send({
			name: 'John Doe',
			email: 'jonhdoe@example.com',
			password: '123456',
		})

		const authResponse = await request(app.server).post('/sessions').send({
			email: 'jonhdoe@example.com',
			password: '123456',
		})

		const { token } = authResponse.body

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
