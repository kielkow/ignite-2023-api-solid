import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'

import { makeCreateGymUsecase } from '@/use-case/factories/gyms/make-create-gym-use-case'

import { GymAlreadyExistsError } from '@/use-case/errors/gym-already-exists-error'

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const createGymBodySchema = z.object({
		title: z.string(),
		description: z.string().nullable(),
		phone: z.string().nullable(),
		latitude: z.coerce.number().refine((value) => {
			return Math.abs(value) <= 90
		}),
		longitude: z.coerce.number().refine((value) => {
			return Math.abs(value) <= 180
		}),
	})

	const { title, description, phone, latitude, longitude } =
		createGymBodySchema.parse(request.body)

	try {
		const createGymUseCase = makeCreateGymUsecase()

		await createGymUseCase.execute({
			title,
			description,
			phone,
			latitude,
			longitude,
		})
	} catch (error) {
		if (error instanceof GymAlreadyExistsError) {
			return reply.status(409).send({ message: error.message })
		}

		throw error
	}

	return reply.status(201).send()
}
