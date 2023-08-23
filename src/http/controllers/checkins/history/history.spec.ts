import { app } from '@/app'
import request from 'supertest'
import { prisma } from '@/lib/prisma'
import { afterAll, beforeAll, describe, it, expect } from 'vitest'

import { createAuthenticateUser } from '@/utils/test/create-authenticate-user'

describe('HISTORY CHECKIN CONTROLLER', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to get user history checkin', async () => {
		const { token, id: userId } = await createAuthenticateUser(app)

		const { id: gymId } = await prisma.gym.create({
			data: {
				title: 'Gym',
				description: 'Muscle Gym Pro',
				phone: '7070-7070',
				latitude: -27.2092052,
				longitude: -49.6401091,
			},
		})

		await prisma.checkIn.createMany({
			data: [
				{
					user_id: userId,
					gym_id: gymId,
				},
				{
					user_id: userId,
					gym_id: gymId,
				},
			],
		})

		const response = await request(app.server)
			.get('/checkins/history')
			.query({
				page: 1,
			})
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.checkIns).toEqual([
			expect.objectContaining({
				user_id: userId,
				gym_id: gymId,
			}),
			expect.objectContaining({
				user_id: userId,
				gym_id: gymId,
			}),
		])
	})
})
