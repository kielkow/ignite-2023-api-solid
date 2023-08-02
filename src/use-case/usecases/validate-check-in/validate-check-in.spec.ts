import { beforeEach, describe, expect, it } from 'vitest'

import { ValidateCheckInUseCase } from './validate-check-in'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'

describe('VALIDATE CHECK-IN USE CASE', () => {
	let checkInsRepository: InMemoryCheckInsRepository,
		sut: ValidateCheckInUseCase

	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new ValidateCheckInUseCase(checkInsRepository)
	})

	it('should be able to validate check-in', async () => {
		const { id: checkInId } = await checkInsRepository.create({
			user_id: 'user-id',
			gym_id: 'gym-id',
		})

		const { checkIn } = await sut.execute({ checkInId })

		expect(checkIn.validated_at).toEqual(expect.any(Date))
		expect(checkInsRepository.checkIns[0].validated_at).toEqual(
			expect.any(Date),
		)
	})
})
