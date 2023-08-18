import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

import { FetchUserCheckInsHistoryUseCase } from '../../usecases/fetch-user-check-ins-history/fetch-user-check-ins-history'

export function makeFetchUserCheckInsHistoryUsecase() {
	const prismaCheckInsRepository = new PrismaCheckInsRepository()

	const fetchUserCheckInsHistoryUseCase = new FetchUserCheckInsHistoryUseCase(
		prismaCheckInsRepository,
	)

	return fetchUserCheckInsHistoryUseCase
}
