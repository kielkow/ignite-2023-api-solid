import { hash } from 'bcryptjs'

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
  const prismaUsersRepoditory = new PrismaUsersRepoditory()

  const userExists = await prismaUsersRepoditory.findByEmail(email)
  if (userExists) throw new Error('E-mail already exists')

  const password_hash = await hash(password, 6)

  await prismaUsersRepoditory.create({ name, email, password_hash })
}
