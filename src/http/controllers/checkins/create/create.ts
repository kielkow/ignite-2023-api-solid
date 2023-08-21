import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'

import { makeCreateCheckInUsecase } from '@/use-case/factories/checkins/make-create-check-in-use-case'

import { MaxDistanceError } from '@/use-case/errors/max-distance-error'
import { ResourceNotFoundError } from '@/use-case/errors/resource-not-found-error'
import { MaxNumberOfCheckInsError } from '@/use-case/errors/max-number-of-check-ins-error'

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

	try {
		const createCheckInUseCase = makeCreateCheckInUsecase()

		await createCheckInUseCase.execute({
			gymId,
			userId: request.user.sub,
			userLatitude: latitude,
			userLongitude: longitude,
		})
	} catch (error) {
		if (error instanceof MaxDistanceError) {
			return reply.status(400).send({ message: error.message })
		}

		if (error instanceof ResourceNotFoundError) {
			return reply.status(409).send({ message: error.message })
		}

		if (error instanceof MaxNumberOfCheckInsError) {
			return reply.status(400).send({ message: error.message })
		}

		throw error
	}

	return reply.status(201).send()
}
