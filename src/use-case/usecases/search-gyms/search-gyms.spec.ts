import { beforeEach, describe, expect, it } from 'vitest'

import { SearchGymsUseCase } from './search-gyms'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

describe('SEARCH GYMS USE CASE', () => {
	let gymsRepository: InMemoryGymsRepository, sut: SearchGymsUseCase

	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new SearchGymsUseCase(gymsRepository)
	})

	it('should be able to search gyms', async () => {
		await gymsRepository.create({
			title: 'gym-01',
			description: null,
			phone: null,
			latitude: -27.2092052,
			longitude: -49.6401091,
		})

		await gymsRepository.create({
			title: 'gym-02',
			description: null,
			phone: null,
			latitude: -27.2092052,
			longitude: -49.6401091,
		})

		const { gyms } = await sut.execute({
			query: 'gym-01',
			page: 1,
		})

		expect(gyms).toHaveLength(1)
		expect(gyms).toEqual([expect.objectContaining({ title: 'gym-01' })])
	})

	it('should be able to search paginated gyms', async () => {
		for (let i = 1; i <= 22; i++) {
			await gymsRepository.create({
				title: `gym-${i}`,
				description: null,
				phone: null,
				latitude: -27.2092052,
				longitude: -49.6401091,
			})
		}

		const { gyms } = await sut.execute({
			query: 'gym',
			page: 2,
		})

		expect(gyms).toHaveLength(2)
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'gym-21' }),
			expect.objectContaining({ title: 'gym-22' }),
		])
	})
})
