import { beforeEach, describe, expect, it } from 'vitest'

import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'

describe('FETCH USER CHECK-INS HISTORY USE CASE', () => {
	let checkInsRepository: InMemoryCheckInsRepository,
		sut: FetchUserCheckInsHistoryUseCase

	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
	})

	it('should be able to fetch check-in history', async () => {
		await checkInsRepository.create({
			user_id: 'user-id',
			gym_id: 'gym-01',
		})

		await checkInsRepository.create({
			user_id: 'user-id',
			gym_id: 'gym-02',
		})

		const { checkIns } = await sut.execute({
			userId: 'user-id',
		})

		expect(checkIns).toHaveLength(2)
		expect(checkIns).toEqual([
			expect.objectContaining({ gym_id: 'gym-01' }),
			expect.objectContaining({ gym_id: 'gym-02' }),
		])
	})
})
