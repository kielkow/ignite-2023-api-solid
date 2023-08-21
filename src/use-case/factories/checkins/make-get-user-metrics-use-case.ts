import { GetUserMetricsUseCase } from '../../usecases/get-user-metrics/get-user-metrics'

import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export function makeGetUserMetricsUseCase() {
	const prismaCheckInsRepository = new PrismaCheckInsRepository()

	const getUserMetricsUseCase = new GetUserMetricsUseCase(
		prismaCheckInsRepository,
	)

	return getUserMetricsUseCase
}
