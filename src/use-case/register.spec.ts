import { describe, expect, it } from 'vitest'
import { compare } from 'bcryptjs'

import { RegisterUseCase } from './register'

describe('REGISTER USE CASE', () => {
  const registerUseCase = new RegisterUseCase({
    async create(data) {
      return {
        id: 'user-id',
        name: data.name,
        email: data.email,
        password_hash: data.password_hash,
        created_at: new Date(),
      }
    },

    async findByEmail(email) {
      return null
    },
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
