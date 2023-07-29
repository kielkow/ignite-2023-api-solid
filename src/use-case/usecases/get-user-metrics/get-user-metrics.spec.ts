import { beforeEach, describe, expect, it } from 'vitest'

import { GetUserMetricsUseCase } from './get-user-metrics'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'

describe('GET USER METRICS USE CASE', () => {
	let checkInsRepository: InMemoryCheckInsRepository, sut: GetUserMetricsUseCase

	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new GetUserMetricsUseCase(checkInsRepository)
	})

	it('should be able to get check-ins count from user metrics', async () => {
		await checkInsRepository.create({
			user_id: 'user-id',
			gym_id: 'gym-01',
		})

		await checkInsRepository.create({
			user_id: 'user-id',
			gym_id: 'gym-02',
		})

		const { checkInsCount } = await sut.execute({
			userId: 'user-id',
		})

		expect(checkInsCount).toEqual(2)
	})
})
