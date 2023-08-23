import { app } from '@/app'
import request from 'supertest'
import { prisma } from '@/lib/prisma'
import { afterAll, beforeAll, describe, it, expect } from 'vitest'

import { createAuthenticateUser } from '@/utils/test/create-authenticate-user'

describe('CREATE CHECKIN CONTROLLER', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create checkin', async () => {
		const { token } = await createAuthenticateUser(app)

		const { id: gymId } = await prisma.gym.create({
			data: {
				title: 'Gym',
				description: 'Muscle Gym Pro',
				phone: '7070-7070',
				latitude: -27.2092052,
				longitude: -49.6401091,
			},
		})

		const response = await request(app.server)
			.post('/checkins')
			.send({
				gymId,
				latitude: -27.2092052,
				longitude: -49.6401091,
			})
			.set('Authorization', `Bearer ${token}`)

		expect(response.statusCode).toEqual(201)
	})
})
