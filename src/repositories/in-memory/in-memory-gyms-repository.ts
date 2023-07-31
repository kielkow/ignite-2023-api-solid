import { randomUUID } from 'crypto'
import { Gym, Prisma } from '@prisma/client'

import { GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
	public gyms: Gym[] = []

	async findById(id: string) {
		const gym = this.gyms.find((gym) => gym.id === id)

		if (!gym) return null

		return gym
	}

	async findByTitle(title: string) {
		const gym = this.gyms.find(
			(gym) => gym.title.toLowerCase() === title.toLowerCase(),
		)

		if (!gym) return null

		return gym
	}

	async create(data: Prisma.GymCreateInput) {
		const { id, title, description, phone, latitude, longitude } = data

		const gym = {
			id: id || randomUUID(),
			title,
			description: description || null,
			phone: phone || null,
			latitude: new Prisma.Decimal(Number(latitude)),
			longitude: new Prisma.Decimal(Number(longitude)),
			created_at: new Date(),
		}

		this.gyms.push(gym)

		return gym
	}

	async search(query: string, page: number): Promise<Gym[]> {
		const gyms = this.gyms
			.filter((gym) => gym.title.toLowerCase().includes(query.toLowerCase()))
			.slice((page - 1) * 20, page * 20)

		return gyms
	}
}
