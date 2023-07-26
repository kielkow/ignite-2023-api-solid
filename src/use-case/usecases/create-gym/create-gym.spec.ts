import { beforeEach, describe, expect, it } from 'vitest'

import { CreateGymUseCase } from './create-gym'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

describe('CREATE GYM USE CASE', () => {
	let gymsRepository: InMemoryGymsRepository, sut: CreateGymUseCase

	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new CreateGymUseCase(gymsRepository)
	})

	it('should be able create a new gym', async () => {
		const { gym } = await sut.execute({
			title: 'gym-test',
			description: null,
			phone: null,
			latitude: -27.2092052,
			longitude: -49.6401091,
		})

		expect(gym.id).toEqual(expect.any(String))
	})
})
