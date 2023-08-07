import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

import { FetchNearbyGymsUseCase } from '../usecases/fetch-nearby-gyms/fetch-nearby-gyms'

export function makeFetchNearbyGymsUsecase() {
	const prismaGymsRepository = new PrismaGymsRepository()

	const fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(
		prismaGymsRepository,
	)

	return fetchNearbyGymsUseCase
}
