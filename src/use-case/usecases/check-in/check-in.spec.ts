import { beforeEach, describe, expect, it } from 'vitest'

import { CheckInUseCase } from './check-in'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'

describe('CHECK-IN USE CASE', () => {
	let inMemoryCheckInsRepository, sut: CheckInUseCase

	beforeEach(() => {
		inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
		sut = new CheckInUseCase(inMemoryCheckInsRepository)
	})

	it('should be able make an check-in', async () => {
		const { checkIn } = await sut.execute({
			userId: 'user-id',
			gymId: 'gym-id',
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})
})
