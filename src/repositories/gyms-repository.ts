import { Gym, Prisma } from '@prisma/client'

export interface GymsRepository {
	findById(id: string): Promise<Gym | null>
	findByTitle(title: string): Promise<Gym | null>
	create(data: Prisma.GymCreateInput): Promise<Gym>
	search(query: string, page: number): Promise<Gym[]>
}
