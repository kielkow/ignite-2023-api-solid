import { Environment } from 'vitest'

export default <Environment>{
	name: 'prisma',
	async setup() {
		console.log('prisma-test-environment executing...')

		return {
			async teardown() {
				console.log('prisma-test-environment finalizing...')
			},
		}
	},
}
