import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

import { CheckInUseCase } from '../../usecases/check-in/check-in'

export function makeCreateCheckInUsecase() {
	const prismaCheckInsRepository = new PrismaCheckInsRepository()
	const prismaGymsRepository = new PrismaGymsRepository()

	const checkInUseCase = new CheckInUseCase(
		prismaCheckInsRepository,
		prismaGymsRepository,
	)

	return checkInUseCase
}
