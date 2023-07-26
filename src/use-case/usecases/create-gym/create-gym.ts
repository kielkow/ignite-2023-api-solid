import { Gym } from '@prisma/client'

import { GymsRepository } from '@/repositories/gyms-repository'
import { GymAlreadyExistsError } from '../../errors/gym-already-exists-error'

interface CreateGymUseCaseRequest {
	title: string
	description: string | null
	phone: string | null
	latitude: number
	longitude: number
}

interface CreateGymUseCaseResponse {
	gym: Gym
}

export class CreateGymUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute({
		title,
		description,
		phone,
		latitude,
		longitude,
	}: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
		const gymExists = await this.gymsRepository.findByTitle(title)

		if (gymExists) throw new GymAlreadyExistsError()

		const gym = await this.gymsRepository.create({
			title,
			description,
			phone,
			latitude,
			longitude,
		})

		return { gym }
	}
}
