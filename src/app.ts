import fastify from 'fastify'
import { ZodError } from 'zod'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'

import { env } from './env'

import { usersRoutes } from './http/controllers/users/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { checkInsRoutes } from './http/controllers/checkins/routes'

export const app = fastify()

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	sign: {
		expiresIn: '1d',
	},
	cookie: {
		cookieName: 'refreshToken',
		signed: false,
	},
})

app.register(fastifyCookie)

app.register(fastifyCors, {
	origin: true,
	credentials: true,
})

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply
			.status(400)
			.send({ message: 'Validation error', issues: error.format() })
	}

	if (env.NODE_ENV !== 'prod') {
		console.error(error)
	} else {
		// TODO: Log to an external tool like Sentry/NewRelic/DataDog
	}

	return reply.status(500).send({ message: 'Internal server error' })
})
