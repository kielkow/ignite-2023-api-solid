import { CheckIn } from '@prisma/client'

import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface FetchUserCheckInsHistoryUseCaseRequest {
	userId: string
	page: number
}

interface FetchUserCheckInsHistoryUseCaseResponse {
	checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({
		userId,
		page = 1,
	}: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
		const checkIns = await this.checkInsRepository.findByUserId(userId, page)

		return { checkIns }
	}
}
