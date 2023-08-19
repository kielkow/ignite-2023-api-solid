import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { create } from './create/create'
import { search } from './search/search'
import { nearby } from './nearby/nearby'

export async function gymsRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJWT)

	app.post('/gyms', create)

	app.get('/gyms/search', search)
	app.get('/gyms/nearby', nearby)
}
