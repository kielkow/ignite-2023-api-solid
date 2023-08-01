import { beforeEach, describe, expect, it } from 'vitest'

import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

describe('FETCH NEARBY GYMS USE CASE', () => {
	let gymsRepository: InMemoryGymsRepository, sut: FetchNearbyGymsUseCase

	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new FetchNearbyGymsUseCase(gymsRepository)
	})

	it('should be able to fetch nearby gyms', async () => {
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
			userLatitude: -27.2092052,
			userLongitude: -49.6401091,
		})

		expect(gyms).toHaveLength(2)
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'gym-01' }),
			expect.objectContaining({ title: 'gym-02' }),
		])
	})

	it('should not be able to find distant gyms', async () => {
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
			userLatitude: 0,
			userLongitude: 0,
		})

		expect(gyms).toHaveLength(0)
	})
})
