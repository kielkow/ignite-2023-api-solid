import { hash } from 'bcryptjs'

import { beforeEach, describe, expect, it } from 'vitest'

import { AuthenticateUseCase } from './authenticate'
import { UsersRepository } from '@/repositories/users-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

describe('AUTHENTICATE USE CASE', () => {
  let inMemoryUsersRepository: UsersRepository, sut: any

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(inMemoryUsersRepository)
  })

  it('should be able authenticate an user', async () => {
    await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'jonhdoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'jonhdoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
})
