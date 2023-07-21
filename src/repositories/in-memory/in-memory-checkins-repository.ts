import { randomUUID } from 'crypto'
import { CheckIn, Prisma } from '@prisma/client'

import { CheckInsRepository } from '../check-ins-repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
	public checkIns: CheckIn[] = []

	async create(data: Prisma.CheckInUncheckedCreateInput) {
		const { user_id, gym_id, validated_at } = data

		const checkIn = {
			id: randomUUID(),
			user_id,
			gym_id,
			validated_at: validated_at ? new Date(validated_at) : null,
			created_at: new Date(),
		}

		this.checkIns.push(checkIn)

		return checkIn
	}
}
