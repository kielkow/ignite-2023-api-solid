import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'

import { makeFetchUserCheckInsHistoryUsecase } from '@/use-case/factories/checkins/make-fetch-user-check-ins-history-use-case'

export async function history(request: FastifyRequest, reply: FastifyReply) {
	const checkInHistoryQuerySchema = z.object({
		page: z.coerce.number().min(1).default(1),
	})

	const { page } = checkInHistoryQuerySchema.parse(request.query)

	const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUsecase()

	const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
		page,
		userId: request.user.sub,
	})

	return reply.status(200).send({ checkIns })
}
