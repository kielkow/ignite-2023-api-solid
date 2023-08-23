import request from 'supertest'
import { FastifyInstance } from 'fastify'

export async function createAuthenticateUser(app: FastifyInstance) {
	await request(app.server).post('/users').send({
		name: 'John Doe',
		email: 'jonhdoe@example.com',
		password: '123456',
	})

	const authResponse = await request(app.server).post('/sessions').send({
		email: 'jonhdoe@example.com',
		password: '123456',
	})

	const { token } = authResponse.body

	const profileResponse = await request(app.server)
		.get('/me')
		.set('Authorization', `Bearer ${token}`)
		.send()

	return { token, ...profileResponse.body.user }
}
