import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'

import { InvalidCredentialsError } from '@/use-case/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-case/factories/make-authenticate-usecase'

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

    await authenticateUseCase.execute({ email, password })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }

  return reply.status(200).send()
}