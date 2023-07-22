import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

import { CheckInUseCase } from './check-in'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'

describe('CHECK-IN USE CASE', () => {
	let inMemoryCheckInsRepository, sut: CheckInUseCase

	beforeEach(() => {
		inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
		sut = new CheckInUseCase(inMemoryCheckInsRepository)

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be able to check-in', async () => {
		vi.setSystemTime(new Date(2023, 0, 1, 6, 0, 0))

		const { checkIn } = await sut.execute({
			userId: 'user-id',
			gymId: 'gym-id',
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})
})
