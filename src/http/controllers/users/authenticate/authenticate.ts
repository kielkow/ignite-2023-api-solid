import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'

import { InvalidCredentialsError } from '@/use-case/errors/invalid-credentials-error'

import { makeAuthenticateUseCase } from '@/use-case/factories/users/make-authenticate-usecase'

export async function authenticate(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const registerBodySchema = z.object({
		email: z.string().email(),
		password: z.string().min(6),
	})

	const { email, password } = registerBodySchema.parse(request.body)

	try {
		const authenticateUseCase = makeAuthenticateUseCase()

		const { user } = await authenticateUseCase.execute({ email, password })

		const token = await reply.jwtSign({}, { sign: { sub: user.id } })

		return reply.status(200).send({ token })
	} catch (error) {
		if (error instanceof InvalidCredentialsError) {
			return reply.status(400).send({ message: error.message })
		}

		throw error
	}
}
