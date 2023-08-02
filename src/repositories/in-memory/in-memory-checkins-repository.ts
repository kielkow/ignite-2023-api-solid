import dayjs from 'dayjs'
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

	async findById(id: string): Promise<CheckIn | null> {
		const checkIn = this.checkIns.find((checkIn) => checkIn.id === id)

		if (!checkIn) return null

		return checkIn
	}

	async findByUserIdOnDate(
		userId: string,
		date: Date,
	): Promise<CheckIn | null> {
		const startOfTheDay = dayjs(date).startOf('date')
		const endOfTheDay = dayjs(date).endOf('date')

		const checkInOnSameDate = this.checkIns.find((checkIn) => {
			const checkInDate = dayjs(checkIn.created_at)

			const isOnSameDate =
				checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

			return checkIn.user_id === userId && isOnSameDate
		})

		if (!checkInOnSameDate) return null

		return checkInOnSameDate
	}

	async findByUserId(userId: string, page: number): Promise<CheckIn[]> {
		const checkIns = this.checkIns
			.filter((checkIn) => checkIn.user_id === userId)
			.slice((page - 1) * 20, page * 20)

		return checkIns
	}

	async countByUserId(userId: string): Promise<number> {
		const checkInsCount = this.checkIns.filter(
			(checkIn) => checkIn.user_id === userId,
		).length

		return checkInsCount
	}
}
