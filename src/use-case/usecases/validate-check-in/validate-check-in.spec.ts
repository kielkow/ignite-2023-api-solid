import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ValidateCheckInUseCase } from './validate-check-in'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'

import { ResourceNotFoundError } from '@/use-case/errors/resource-not-found-error'
import { LateCheckInValidationError } from '@/use-case/errors/late-check-in-validation-error'

describe('VALIDATE CHECK-IN USE CASE', () => {
	let checkInsRepository: InMemoryCheckInsRepository,
		sut: ValidateCheckInUseCase

	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new ValidateCheckInUseCase(checkInsRepository)

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
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

	it('should not be able to validate invalid check-in', async () => {
		await expect(() =>
			sut.execute({ checkInId: 'invalid-check-in' }),
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})

	it('should not be able to validate check-in after 20 minutes of its creation', async () => {
		vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

		const { id: checkInId } = await checkInsRepository.create({
			user_id: 'user-id',
			gym_id: 'gym-id',
		})

		vi.advanceTimersByTime(1000 * 60 * 21) // 21 minutes

		await expect(() => sut.execute({ checkInId })).rejects.toBeInstanceOf(
			LateCheckInValidationError,
		)
	})
})
