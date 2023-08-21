import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'

import { ResourceNotFoundError } from '@/use-case/errors/resource-not-found-error'
import { LateCheckInValidationError } from '@/use-case/errors/late-check-in-validation-error'

import { makeValidateCheckInUsecase } from '@/use-case/factories/checkins/make-validate-check-in-use-case'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
	const validateCheckInParamsSchema = z.object({
		checkInId: z.string().uuid().nonempty(),
	})

	const { checkInId } = validateCheckInParamsSchema.parse(request.params)

	try {
		const validateCheckInUseCase = makeValidateCheckInUsecase()

		await validateCheckInUseCase.execute({
			checkInId,
		})
	} catch (error) {
		if (error instanceof ResourceNotFoundError) {
			return reply.status(409).send({ message: error.message })
		}

		if (error instanceof LateCheckInValidationError) {
			return reply.status(400).send({ message: error.message })
		}

		throw error
	}

	return reply.status(204).send()
}
