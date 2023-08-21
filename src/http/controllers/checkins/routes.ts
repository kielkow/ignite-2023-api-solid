import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { create } from './create/create'
import { history } from './history/history'
import { metrics } from './metrics/metrics'
import { validate } from './validate/validate'

export async function checkInsRoutes(app: FastifyInstance) {
	app.addHook('onRequest', verifyJWT)

	app.post('/checkins', create)

	app.get('/checkins/history', history)
	app.get('/checkins/metrics', metrics)

	app.patch('/checkins/:checkInId/validate', validate)
}
