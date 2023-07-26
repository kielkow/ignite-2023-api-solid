import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

import { Gym } from '@prisma/client'

import { CheckInUseCase } from './check-in'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { MaxDistanceError } from '@/use-case/errors/max-distance-error'
import { MaxNumberOfCheckInsError } from '@/use-case/errors/max-number-of-check-ins-error'

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
			latitude: -27.2092052,
			longitude: -49.6401091,
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
			userLatitude: -27.2092052,
			userLongitude: -49.6401091,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check-in twice on the same day', async () => {
		await sut.execute({
			userId: 'user-id',
			gymId: gym.id,
			userLatitude: -27.2092052,
			userLongitude: -49.6401091,
		})

		await expect(() =>
			sut.execute({
				userId: 'user-id',
				gymId: gym.id,
				userLatitude: -27.2092052,
				userLongitude: -49.6401091,
			}),
		).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
	})

	it('should be able to check-in twice on different days', async () => {
		await sut.execute({
			userId: 'user-id',
			gymId: gym.id,
			userLatitude: -27.2092052,
			userLongitude: -49.6401091,
		})

		vi.setSystemTime(new Date(2023, 0, 2, 6, 0, 0))

		const { checkIn } = await sut.execute({
			userId: 'user-id',
			gymId: gym.id,
			userLatitude: -27.2092052,
			userLongitude: -49.6401091,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check-in on distant gym', async () => {
		const distantGym = await gymsRepository.create({
			title: 'distant-gym-test',
			latitude: -27.074279,
			longitude: -49.4889672,
		})

		await expect(() =>
			sut.execute({
				userId: 'user-id',
				gymId: distantGym.id,
				userLatitude: -27.2092052,
				userLongitude: -49.6401091,
			}),
		).rejects.toBeInstanceOf(MaxDistanceError)
	})
})
