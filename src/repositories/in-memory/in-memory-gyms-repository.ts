import { randomUUID } from 'crypto'
import { Gym, Prisma } from '@prisma/client'

import { GymsRepository } from '../gyms-repository'
import { Decimal } from '@prisma/client/runtime'

export class InMemoryGymsRepository implements GymsRepository {
	public gyms: Gym[] = []

	async findById(id: string) {
		const gym = this.gyms.find((gym) => gym.id === id)

		if (!gym) return null

		return gym
	}

	async create(data: Prisma.GymCreateInput) {
		const { title, description, phone, latitude, longitude } = data

		const gym = {
			id: randomUUID(),
			title,
			description: description || null,
			phone: phone || null,
			latitude: new Decimal(Number(latitude)),
			longitude: new Decimal(Number(longitude)),
		}

		this.gyms.push(gym)

		return gym
	}
}
