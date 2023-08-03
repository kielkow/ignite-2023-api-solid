import dayjs from 'dayjs'
import { CheckIn } from '@prisma/client'

import { CheckInsRepository } from '@/repositories/check-ins-repository'

import { ResourceNotFoundError } from '@/use-case/errors/resource-not-found-error'
import { LateCheckInValidationError } from '@/use-case/errors/late-check-in-validation-error'

interface ValidateCheckInUseCaseRequest {
	checkInId: string
}

interface ValidateCheckInUseCaseResponse {
	checkIn: CheckIn
}

export class ValidateCheckInUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({
		checkInId,
	}: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
		const checkIn = await this.checkInsRepository.findById(checkInId)

		if (!checkIn) throw new ResourceNotFoundError()

		const validatedDate = new Date()

		const differenceInMinutesFromCheckInCreation = dayjs(validatedDate).diff(
			checkIn.created_at,
			'minutes',
		)

		if (differenceInMinutesFromCheckInCreation > 20) {
			throw new LateCheckInValidationError()
		}

		checkIn.validated_at = validatedDate

		await this.checkInsRepository.save(checkIn)

		return { checkIn }
	}
}
