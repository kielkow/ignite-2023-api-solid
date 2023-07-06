import { hash } from 'bcryptjs'

import { prisma } from '@/lib/prisma'
import { PrismaUsersRepoditory } from '@/repositories/prisma-users-repository'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export async function registerUseCase({
  name,
  email,
  password,
}: RegisterUseCaseRequest) {
  const userExists = await prisma.user.findUnique({ where: { email } })
  if (userExists) throw new Error('E-mail already exists')

  const password_hash = await hash(password, 6)

  const prismaUsersRepoditory = new PrismaUsersRepoditory()

  await prismaUsersRepoditory.create({ name, email, password_hash })
}
