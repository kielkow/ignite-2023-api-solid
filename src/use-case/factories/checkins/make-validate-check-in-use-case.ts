import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

import { ValidateCheckInUseCase } from '../../usecases/validate-check-in/validate-check-in'

export function makeValidateCheckInUsecase() {
	const prismaCheckInsRepository = new PrismaCheckInsRepository()

	const validateCheckInUseCase = new ValidateCheckInUseCase(
		prismaCheckInsRepository,
	)

	return validateCheckInUseCase
}
