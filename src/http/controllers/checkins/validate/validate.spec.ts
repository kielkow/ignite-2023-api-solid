import { app } from '@/app'
import request from 'supertest'
import { prisma } from '@/lib/prisma'
import { afterAll, beforeAll, describe, it, expect } from 'vitest'

import { createAuthenticateUser } from '@/utils/test/create-authenticate-user'

describe('VALIDATE CHECKIN CONTROLLER', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to validate checkin', async () => {
		const { token, id: userId } = await createAuthenticateUser(app, true)

		const { id: gymId } = await prisma.gym.create({
			data: {
				title: 'Gym',
				description: 'Muscle Gym Pro',
				phone: '7070-7070',
				latitude: -27.2092052,
				longitude: -49.6401091,
			},
		})

		const { id: checkInId } = await prisma.checkIn.create({
			data: {
				user_id: userId,
				gym_id: gymId,
			},
		})

		const response = await request(app.server)
			.patch(`/checkins/${checkInId}/validate`)
			.set('Authorization', `Bearer ${token}`)
			.send()

		const validatedCheckIn = await prisma.checkIn.findUniqueOrThrow({
			where: {
				id: checkInId,
			},
		})

		expect(response.statusCode).toEqual(204)
		expect(validatedCheckIn.validated_at).toEqual(expect.any(Date))
	})
})
