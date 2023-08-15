import { FastifyInstance } from 'fastify'

import { register } from './controllers/register/register'
import { authenticate } from './controllers/authenticate/authenticate'
import { profile } from './controllers/profile/profile'

import { verifyJWT } from './middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
	// Not Authenticated
	app.post('/users', register)
	app.post('/sessions', authenticate)

	// Authenticated
	app.get('/me', { onRequest: [verifyJWT] }, profile)
}
