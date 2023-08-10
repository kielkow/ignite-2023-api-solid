import { FastifyRequest, FastifyReply } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
	await request.jwtVerify()

	const { user } = request

	return reply.status(200).send({ id: user.sub })
}
