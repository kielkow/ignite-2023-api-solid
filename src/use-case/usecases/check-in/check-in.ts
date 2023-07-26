import { CheckIn } from '@prisma/client'

import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'

import { MaxDistanceError } from '@/use-case/errors/max-distance-error'
import { ResourceNotFoundError } from '@/use-case/errors/resource-not-found-error'
import { MaxNumberOfCheckInsError } from '@/use-case/errors/max-number-of-check-ins-error'

import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
interface CheckInUseCaseRequest {
	userId: string
	gymId: string
	userLatitude: number
	userLongitude: number
}

interface CheckInUseCaseResponse {
	checkIn: CheckIn
}

export class CheckInUseCase {
	constructor(
		private checkInsRepository: CheckInsRepository,
		private gymsRepository: GymsRepository,
	) {}

	async execute({
		userId,
		gymId,
		userLatitude,
		userLongitude,
	}: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
		const gym = await this.gymsRepository.findById(gymId)

		if (!gym) throw new ResourceNotFoundError()

		const distance = getDistanceBetweenCoordinates(
			{ latitude: userLatitude, longitude: userLongitude },
			{ latitude: Number(gym.latitude), longitude: Number(gym.longitude) },
		)

		const MAX_DISTANCE_IN_KILOMETERS = 0.1

		if (distance > MAX_DISTANCE_IN_KILOMETERS) throw new MaxDistanceError()

		const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
			userId,
			new Date(),
		)

		if (checkInOnSameDay) throw new MaxNumberOfCheckInsError()

		const checkIn = await this.checkInsRepository.create({
			user_id: userId,
			gym_id: gymId,
		})

		return { checkIn }
	}
}
