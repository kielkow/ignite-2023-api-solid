import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'

import { makeCreateCheckInUsecase } from '@/use-case/factories/checkins/make-create-check-in-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const createCheckInBodySchema = z.object({
		gymId: z.string().uuid().nonempty(),
		latitude: z.number().refine((value) => {
			return Math.abs(value) <= 90
		}),
		longitude: z.number().refine((value) => {
			return Math.abs(value) <= 180
		}),
	})

	const { gymId, latitude, longitude } = createCheckInBodySchema.parse(
		request.body,
	)

	const createCheckInUseCase = makeCreateCheckInUsecase()

	await createCheckInUseCase.execute({
		gymId,
		userId: request.user.sub,
		userLatitude: latitude,
		userLongitude: longitude,
	})

	return reply.status(201).send()
}
