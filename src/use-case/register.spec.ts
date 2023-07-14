import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { RegisterUseCase } from './register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

describe('REGISTER USE CASE', () => {
  let inMemoryUsersRepository, registerUseCase: any

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    registerUseCase = new RegisterUseCase(inMemoryUsersRepository)
  })

  it('should hash user password upon registration', async () => {
    const { user } = await registerUseCase.execute({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBeTruthy()
  })
})
