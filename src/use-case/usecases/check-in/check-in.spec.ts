import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

import { CheckInUseCase } from './check-in'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'

describe('CHECK-IN USE CASE', () => {
	let inMemoryCheckInsRepository, sut: CheckInUseCase

	beforeEach(() => {
		inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
		sut = new CheckInUseCase(inMemoryCheckInsRepository)

		vi.useFakeTimers()
		vi.setSystemTime(new Date(2023, 0, 1, 6, 0, 0))
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be able to check-in', async () => {
		const { checkIn } = await sut.execute({
			userId: 'user-id',
			gymId: 'gym-id',
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check-in twice on the same day', async () => {
		await sut.execute({
			userId: 'user-id',
			gymId: 'gym-id',
		})

		await expect(() =>
			sut.execute({
				userId: 'user-id',
				gymId: 'gym-id',
			}),
		).rejects.toBeInstanceOf(Error)
	})

	it('should be able to check-in twice on different days', async () => {
		await sut.execute({
			userId: 'user-id',
			gymId: 'gym-id',
		})

		vi.setSystemTime(new Date(2023, 0, 2, 6, 0, 0))

		const { checkIn } = await sut.execute({
			userId: 'user-id',
			gymId: 'gym-id',
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})
})
