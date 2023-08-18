import { FastifyInstance } from 'fastify'

import { register } from './register/register'
import { authenticate } from './authenticate/authenticate'
import { profile } from './profile/profile'

import { verifyJWT } from '../../middlewares/verify-jwt'

export async function usersRoutes(app: FastifyInstance) {
	// Not Authenticated
	app.post('/users', register)
	app.post('/sessions', authenticate)

	// Authenticated
	app.get('/me', { onRequest: [verifyJWT] }, profile)
}
