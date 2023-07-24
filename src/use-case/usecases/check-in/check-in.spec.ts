import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

import { Gym } from '@prisma/client'

import { CheckInUseCase } from './check-in'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

describe('CHECK-IN USE CASE', () => {
	let checkInsRepository: InMemoryCheckInsRepository,
		gymsRepository: InMemoryGymsRepository,
		sut: CheckInUseCase,
		gym: Gym

	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		gymsRepository = new InMemoryGymsRepository()
		sut = new CheckInUseCase(checkInsRepository, gymsRepository)

		gym = await gymsRepository.create({
			title: 'gym-test',
			latitude: 0,
			longitude: 0,
		})

		vi.useFakeTimers()
		vi.setSystemTime(new Date(2023, 0, 1, 6, 0, 0))
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be able to check-in', async () => {
		const { checkIn } = await sut.execute({
			userId: 'user-id',
			gymId: gym.id,
			userLatitude: 0,
			userLongitude: 0,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check-in twice on the same day', async () => {
		await sut.execute({
			userId: 'user-id',
			gymId: gym.id,
			userLatitude: 0,
			userLongitude: 0,
		})

		await expect(() =>
			sut.execute({
				userId: 'user-id',
				gymId: gym.id,
				userLatitude: 0,
				userLongitude: 0,
			}),
		).rejects.toBeInstanceOf(Error)
	})

	it('should be able to check-in twice on different days', async () => {
		await sut.execute({
			userId: 'user-id',
			gymId: gym.id,
			userLatitude: 0,
			userLongitude: 0,
		})

		vi.setSystemTime(new Date(2023, 0, 2, 6, 0, 0))

		const { checkIn } = await sut.execute({
			userId: 'user-id',
			gymId: gym.id,
			userLatitude: 0,
			userLongitude: 0,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})
})
