import 'dotenv/config'

import { randomUUID } from 'crypto'
import { Environment } from 'vitest'
import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateDatabaseURL(schema: string) {
	if (!process.env.DATABASE_URL) {
		throw new Error('Database URL must be provided.')
	}

	const databaseURL = new URL(process.env.DATABASE_URL)

	databaseURL.searchParams.set('schema', schema)

	return databaseURL.toString()
}

export default <Environment>{
	name: 'prisma',
	async setup() {
		console.log('prisma-test-environment executing...')

		const schema = randomUUID()

		const databaseURL = generateDatabaseURL(schema)

		process.env.DATABASE_URL = databaseURL

		execSync('npx prisma migrate deploy')

		return {
			async teardown() {
				await prisma.$executeRawUnsafe(
					`DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
				)

				await prisma.$disconnect()

				console.log('prisma-test-environment finalizing...')
			},
		}
	},
}
