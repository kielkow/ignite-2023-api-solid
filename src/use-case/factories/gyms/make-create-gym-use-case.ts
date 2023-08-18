import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

import { CreateGymUseCase } from '../../usecases/create-gym/create-gym'

export function makeCreateGymUsecase() {
	const prismaGymsRepository = new PrismaGymsRepository()

	const createGymUseCase = new CreateGymUseCase(prismaGymsRepository)

	return createGymUseCase
}
